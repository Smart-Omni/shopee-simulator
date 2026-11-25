#!/usr/bin/env python3
"""Seed a 50-product Vietnamese fashion pilot to one Shopee Simulator shop.

Uses archive/data.csv and archive/data/*.jpg as source records. Product details,
variation values, prices, stock, and some descriptions are synthetic. Every
archive row is recorded in archive/fashion_seed_manifest.csv.
"""

from __future__ import annotations

import argparse
import csv
import json
import mimetypes
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import uuid
from pathlib import Path

BASE_URL_DEFAULT = "https://shopee-simulator.onrender.com"
SHOP_ID_DEFAULT = "839910244"  # Hanoi Streetwear Co.
SHOP_NAMES = {
    "727720655": "SmartOmni Official Flagship",
    "839910244": "Hanoi Streetwear Co.",
    "910283751": "Saigon Modern Living",
}
TARGET_COUNT = 50
COLORS = ["Đen", "Kem"]
SIZES = ["Cỡ S", "Cỡ M", "Cỡ L", "Cỡ XL"]

# Archive category -> (Vietnamese type, simulator leaf category for men/women).
CATEGORY_MAP = {
    "Tshirts": ("Áo thun", 100244, 100352),
    "Shirts": ("Áo sơ mi", 100242, 100353),
    "Jeans": ("Quần jean", 100047, 100103),
    "Shorts": ("Quần short", 100053, 100360),
    "Trousers": ("Quần dài", 100240, 100358),
    "Dresses": ("Đầm", 100104, 100104),
    "Jackets": ("Áo khoác", 100230, 100370),
    "Sweatshirts": ("Áo nỉ", 100227, 100373),
    "Sweaters": ("Áo len", 100049, 100108),
    "Track Pants": ("Quần thể thao", 100239, 100358),
    "Tops": ("Áo kiểu", 100244, 100352),
    "Kurtis": ("Áo kiểu truyền thống", 100251, 100400),
    "Tunics": ("Áo tunic", 100244, 100352),
}
BASE_PRICE = {
    "Tshirts": 159_000,
    "Shirts": 229_000,
    "Jeans": 329_000,
    "Shorts": 179_000,
    "Trousers": 249_000,
    "Dresses": 279_000,
    "Jackets": 429_000,
    "Sweatshirts": 299_000,
    "Sweaters": 289_000,
    "Track Pants": 229_000,
    "Tops": 189_000,
    "Kurtis": 249_000,
    "Tunics": 219_000,
}
MANIFEST_FIELDS = [
    "archive_row", "image", "source_name", "source_category", "status",
    "status_reason", "shop_id", "item_sku", "item_id", "category_id",
    "vietnamese_name", "image_url", "image_file_id", "variant_skus",
    "price_range_vnd", "synthetic_fields",
]


def api_json(base_url: str, path: str, payload: dict | None = None) -> dict:
    data = None if payload is None else json.dumps(payload, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(
        base_url.rstrip("/") + path,
        data=data,
        headers={"Content-Type": "application/json"} if data is not None else {},
        method="POST" if data is not None else "GET",
    )
    try:
        with urllib.request.urlopen(request, timeout=90) as response:
            result = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", "replace")
        raise RuntimeError(f"HTTP {error.code} {path}: {detail}") from error
    if result.get("error"):
        raise RuntimeError(f"API error at {path}: {result.get('error')}: {result.get('message')}")
    return result.get("response", {})


def upload_batch(base_url: str, paths: list[Path]) -> dict[str, dict]:
    boundary = "----CodexFashionPilot" + uuid.uuid4().hex
    parts: list[bytes] = []
    for path in paths:
        filename = path.name
        content_type = mimetypes.guess_type(filename)[0] or "image/jpeg"
        parts.extend([
            f"--{boundary}\r\n".encode(),
            f'Content-Disposition: form-data; name="files"; filename="{filename}"\r\n'.encode(),
            f"Content-Type: {content_type}\r\n\r\n".encode(),
            path.read_bytes(),
            b"\r\n",
        ])
    parts.append(f"--{boundary}--\r\n".encode())
    request = urllib.request.Request(
        base_url.rstrip("/") + "/api/v2/simulator/media/upload_multiple",
        data=b"".join(parts),
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=180) as response:
            result = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", "replace")
        raise RuntimeError(f"Image upload HTTP {error.code}: {detail}") from error
    if result.get("error"):
        raise RuntimeError(f"Image upload error: {result.get('error')}: {result.get('message')}")
    return {row["file_name"]: row for row in result["response"]["files"]}


def gender_and_category(row: dict) -> tuple[str, str, int] | None:
    source_name = row["display name"]
    if re.search(r"\b(boys|girls|kids|kid|baby|infant)\b", source_name, re.I):
        return None
    category_info = CATEGORY_MAP.get(row["category"])
    if not category_info:
        return None
    is_unisex = bool(re.search(r"\bunisex\b", source_name, re.I))
    is_women = (
        bool(re.search(r"\b(women(?:['’]?s)?|woman|girl)\b", source_name, re.I))
        or row["category"] in {"Dresses", "Kurtis", "Tunics"}
    ) and not is_unisex
    gender = "unisex" if is_unisex else ("nữ" if is_women else "nam")
    item_type, men_category, women_category = category_info
    return item_type, gender, women_category if is_women else men_category


def source_brand(source_name: str) -> str:
    match = re.search(r"\b(?:men(?:['’]?s)?|women(?:['’]?s)?|woman|girl|unisex)\b", source_name, re.I)
    prefix = source_name[:match.start()].strip(" -") if match else ""
    # Names without a gender marker can contain a whole title, so keep only a short brand-like prefix.
    if not prefix:
        prefix = " ".join(source_name.split()[:2])
    return prefix[:32].strip()


def choose_rows(rows: list[dict], image_dir: Path, limit: int = TARGET_COUNT, excluded_images: set[str] | None = None) -> list[dict]:
    buckets: dict[str, list[dict]] = {name: [] for name in CATEGORY_MAP}
    seen: set[tuple[str, str]] = set()
    excluded_images = excluded_images or set()
    for row in rows:
        info = gender_and_category(row)
        if not info or row["image"] in excluded_images:
            continue
        key = (row["category"], row["display name"].strip().casefold())
        if key in seen or not (image_dir / row["image"]).is_file():
            continue
        seen.add(key)
        buckets[row["category"]].append(row)

    selected: list[dict] = []
    offset = 0
    categories = list(CATEGORY_MAP)
    while len(selected) < limit:
        made_progress = False
        for category in categories:
            if offset < len(buckets[category]):
                selected.append(buckets[category][offset])
                made_progress = True
                if len(selected) == limit:
                    break
        if not made_progress:
            raise RuntimeError(f"Only found {len(selected)} eligible unique clothing rows; need {limit}")
        offset += 1
    return selected


def manifest_row(source: dict, row_number: int, image_dir: Path) -> dict:
    eligible = gender_and_category(source)
    if eligible and (image_dir / source["image"]).is_file():
        status = "UNUSED"
        reason = "Eligible for a later fashion seed; not selected in this pilot"
    elif source.get("category") not in CATEGORY_MAP:
        status = "EXCLUDED"
        reason = "Outside the clothing categories selected for this fashion pilot"
    elif not (image_dir / source.get("image", "")).is_file():
        status = "EXCLUDED"
        reason = "Source image is missing from archive/data"
    else:
        status = "EXCLUDED"
        reason = "Children's apparel omitted from this adult-clothing pilot"
    return {
        "archive_row": row_number,
        "image": source.get("image", ""),
        "source_name": source.get("display name", ""),
        "source_category": source.get("category", ""),
        "status": status,
        "status_reason": reason,
        "shop_id": "",
        "item_sku": "",
        "item_id": "",
        "category_id": "",
        "vietnamese_name": "",
        "image_url": "",
        "image_file_id": "",
        "variant_skus": "",
        "price_range_vnd": "",
        "synthetic_fields": "",
    }


def save_manifest(path: Path, manifest: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=MANIFEST_FIELDS)
        writer.writeheader()
        writer.writerows(manifest)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default=BASE_URL_DEFAULT)
    parser.add_argument("--shop-id", default=SHOP_ID_DEFAULT)
    parser.add_argument("--shop-name", default=None)
    parser.add_argument("--archive-dir", type=Path, default=Path("/Users/nguyetminh/Dev/archive"))
    args = parser.parse_args()
    archive_dir = args.archive_dir
    csv_path = archive_dir / "data.csv"
    image_dir = archive_dir / "data"
    manifest_path = archive_dir / "fashion_seed_manifest.csv"

    with csv_path.open(encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        source_rows = list(reader)
    previous_rows = {}
    if manifest_path.exists():
        with manifest_path.open(encoding="utf-8-sig", newline="") as file:
            previous_rows = {row["archive_row"]: row for row in csv.DictReader(file)}
    reserved_images = {
        row.get("image", "") for row in previous_rows.values()
        if row.get("status") in {"SEEDED", "IMAGE_UPLOADED", "PENDING", "FAILED"}
    }
    current_shop_images = {
        row.get("image", "") for row in previous_rows.values()
        if row.get("shop_id") == args.shop_id and row.get("status") == "SEEDED"
    }
    if current_shop_images:
        selected = [row for row in source_rows if row["image"] in current_shop_images][:TARGET_COUNT]
        if len(selected) < TARGET_COUNT:
            selected.extend(choose_rows(source_rows, image_dir, TARGET_COUNT - len(selected), reserved_images))
    else:
        selected = choose_rows(source_rows, image_dir, TARGET_COUNT, reserved_images)

    manifest = [manifest_row(row, index + 2, image_dir) for index, row in enumerate(source_rows)]
    if previous_rows:
        for entry in manifest:
            previous = previous_rows.get(str(entry["archive_row"]))
            if previous and previous.get("status") in {"SEEDED", "IMAGE_UPLOADED", "FAILED"}:
                entry.update(previous)
    by_image = {row["image"]: manifest[index] for index, row in enumerate(source_rows)}
    chosen: list[dict] = []
    for index, source in enumerate(selected, start=1):
        entry = by_image[source["image"]]
        item_type, gender, category_id = gender_and_category(source)  # type: ignore[misc]
        item_sku = f"PILOT{args.shop_id[-4:]}-{entry['archive_row']:05d}"
        brand = source_brand(source["display name"])
        title = f"{item_type} {gender} {brand} mẫu {index:02d}".strip()[:120]
        if entry.get("status") != "SEEDED":
            entry.update({
                "status": "PENDING",
                "status_reason": "Selected for one-shop pilot",
                "shop_id": args.shop_id,
                "item_sku": item_sku,
                "category_id": category_id,
                "vietnamese_name": title,
                "variant_skus": "",
                "price_range_vnd": "",
                "synthetic_fields": "description;color;size;price;stock;brand_attribute",
            })
        chosen.append({"source": source, "entry": entry, "item_type": item_type, "gender": gender, "category_id": category_id, "item_sku": item_sku, "title": title, "brand": brand, "index": index})

    # Record the complete source selection before making remote changes.
    save_manifest(manifest_path, manifest)

    categories = api_json(args.base_url, "/api/v2/simulator/categories")["categories"]
    categories_by_id = {str(row["category_id"]): row for row in categories}
    config = api_json(args.base_url, f"/api/v2/simulator/product-creation/config?shop_id={urllib.parse.quote(args.shop_id)}")
    if config.get("is_vacation"):
        raise RuntimeError("Pilot shop is on vacation; refusing to create active listings")
    shipping_option_ids = [option["option_id"] for option in config["shipping_options"] if option["option_id"] == "pickup_point"]
    if not shipping_option_ids:
        raise RuntimeError("The deployed shop has no enabled pickup_point shipping option")

    existing = api_json(args.base_url, f"/api/v2/simulator/products?shop_id={urllib.parse.quote(args.shop_id)}&page=1&page_size=100").get("products", [])
    existing_by_sku = {product.get("item_sku"): product for product in existing}
    for product in chosen:
        existing_product = existing_by_sku.get(product["item_sku"])
        if existing_product:
            images = existing_product.get("images") or {}
            image_urls = images.get("image_url_list") or []
            product["entry"].update({
                "status": "SEEDED",
                "status_reason": "Already present in pilot shop; preserved from prior run",
                "item_id": existing_product.get("item_id", product["entry"].get("item_id", "")),
                "image_url": image_urls[0] if image_urls else product["entry"].get("image_url", ""),
            })
        elif product["entry"].get("status") == "SEEDED":
            product["entry"].update({"status": "PENDING", "status_reason": "Pilot SKU was not found in the shop; recreating it"})
    save_manifest(manifest_path, manifest)

    # Upload images in the simulator's supported batches of at most 10 files.
    to_upload = [product for product in chosen if product["entry"]["status"] == "PENDING"]
    for start in range(0, len(to_upload), 10):
        batch = to_upload[start:start + 10]
        paths = [image_dir / product["source"]["image"] for product in batch]
        uploads = upload_batch(args.base_url, paths)
        for product in batch:
            uploaded = uploads[product["source"]["image"]]
            product["entry"].update({"status": "IMAGE_UPLOADED", "status_reason": "Waiting for product create", "image_url": uploaded["url"], "image_file_id": uploaded["file_id"]})
        save_manifest(manifest_path, manifest)

    # Create each listing from current category requirements on the deployed simulator.
    created_count = 0
    for product in chosen:
        entry = product["entry"]
        if entry["status"] == "SEEDED":
            continue
        category = categories_by_id.get(str(product["category_id"]))
        if not category or category["has_children"]:
            entry.update({"status": "FAILED", "status_reason": f"Category {product['category_id']} is unavailable or not a leaf"})
            save_manifest(manifest_path, manifest)
            continue
        attrs = []
        for attribute in category.get("attributes", []):
            if not attribute["is_mandatory"]:
                continue
            values = attribute.get("values", [])
            chosen_value = next((value for value in values if value.get("original_value_name") == "Khác"), None)
            if chosen_value is None and values:
                chosen_value = values[0]
            if chosen_value is None:
                entry.update({"status": "FAILED", "status_reason": f"No valid values for mandatory attribute {attribute['name']}"})
                save_manifest(manifest_path, manifest)
                break
            attrs.append({"attribute_id": attribute["attribute_id"], "attribute_value_list": [{"value_id": chosen_value["value_id"]}]})
        if entry["status"] == "FAILED":
            continue

        source_category = product["source"]["category"]
        base_price = BASE_PRICE[source_category]
        size_prices = [int(round(base_price * (1 + size_index * 0.05) / 1000) * 1000) for size_index in range(len(SIZES))]
        models = []
        variant_skus = []
        for color_index, color in enumerate(COLORS):
            color_code = "DEN" if color_index == 0 else "KEM"
            for size_index, size in enumerate(SIZES):
                size_code = ["S", "M", "L", "XL"][size_index]
                sku = f"{product['item_sku']}-{color_code}-{size_code}"
                variant_skus.append(sku)
                models.append({
                    "model_name": f"{color}, {size}",
                    "model_sku": sku,
                    "tier_index": [color_index, size_index],
                    "original_price": size_prices[size_index],
                    "seller_stock": 12 + ((product["entry"]["archive_row"] + color_index * 7 + size_index * 5) % 31),
                })
        desc = (
            f"{product['title']}. Thiết kế dễ phối đồ, phù hợp mặc hằng ngày. "
            "Sản phẩm mới, có hai lựa chọn màu sắc và bốn cỡ để khách hàng lựa chọn. "
            "Vui lòng tham khảo bảng chọn cỡ trước khi đặt hàng."
        )
        payload = {
            "shop_id": int(args.shop_id),
            "category_id": product["category_id"],
            "item_name": product["title"],
            "description": desc,
            "original_price": size_prices[0],
            "item_sku": product["item_sku"],
            "weight": 0.5,
            "package_weight_grams": 500,
            "product_workflow": True,
            "product_condition": "NEW",
            "image_ratio": "1:1",
            "item_status": "NORMAL",
            "shipping_option_ids": shipping_option_ids,
            "attribute_list": attrs,
            "images": [entry["image_url"]],
            "tier_variation": [
                {"name": "Màu sắc", "option_list": [{"option": color} for color in COLORS]},
                {"name": "Kích cỡ", "option_list": [{"option": size} for size in SIZES]},
            ],
            "models": models,
        }
        try:
            response = api_json(args.base_url, "/api/v2/simulator/product/create", payload)
        except Exception as error:
            entry.update({"status": "FAILED", "status_reason": str(error)[:500], "variant_skus": ";".join(variant_skus), "price_range_vnd": f"{size_prices[0]}-{size_prices[-1]}"})
            save_manifest(manifest_path, manifest)
            continue
        entry.update({
            "status": "SEEDED",
            "status_reason": "Created by one-shop fashion pilot",
            "item_id": response["item_id"],
            "variant_skus": ";".join(variant_skus),
            "price_range_vnd": f"{size_prices[0]}-{size_prices[-1]}",
        })
        created_count += 1
        save_manifest(manifest_path, manifest)
        print(f"SEEDED {response['item_id']} {product['title']} ({len(models)} SKU, {size_prices[0]}-{size_prices[-1]} VND)", flush=True)

    result = api_json(args.base_url, f"/api/v2/simulator/products?shop_id={urllib.parse.quote(args.shop_id)}&page=1&page_size=100")
    shop_name = args.shop_name or SHOP_NAMES.get(args.shop_id, f"Shop {args.shop_id}")
    print(json.dumps({"shop_id": args.shop_id, "shop_name": shop_name, "new_products_seeded": created_count, "source_rows": len(source_rows), "pilot_manifest": str(manifest_path), "current_shop_product_total": result.get("total")}, ensure_ascii=False))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"SEED FAILED: {exc}", file=sys.stderr)
        sys.exit(1)
