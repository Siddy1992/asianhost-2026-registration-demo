#!/usr/bin/env python3
"""Generate cryptographically random, unique coupon codes for conference registration.

Examples:
  python generate_coupons.py
  python generate_coupons.py --count 500 --prefix AH26 --length 10 --output coupons.csv

The output contains codes and blank policy fields for the registration administrator.
Discounts and redemption limits MUST be enforced by the production server.
"""
import argparse
import csv
from pathlib import Path
import secrets
import sys

ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"  # Avoid 0/O, 1/I
FIELDS = ["coupon_code", "discount_type", "discount_value", "max_redemptions", "expires_at_ist", "notes"]


def make_codes(count: int, prefix: str, length: int) -> list[str]:
    if count < 1:
        raise ValueError("--count must be at least 1")
    if length < 6 or length > 32:
        raise ValueError("--length must be between 6 and 32")
    if not prefix or not prefix.isalnum() or len(prefix) > 20:
        raise ValueError("--prefix must be 1–20 letters/digits")
    prefix = prefix.upper()
    if count > len(ALPHABET) ** length:
        raise ValueError("Requested more codes than possible combinations")
    codes: set[str] = set()
    while len(codes) < count:
        token = ''.join(secrets.choice(ALPHABET) for _ in range(length))
        codes.add(f"{prefix}-{token}")
    return sorted(codes)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--count", type=int, default=150, help="Number of unique coupons (default: 150)")
    parser.add_argument("--prefix", default="AH26", help="Coupon prefix (default: AH26)")
    parser.add_argument("--length", type=int, default=10, help="Random characters per code (default: 10)")
    parser.add_argument("--output", default="asianhost_coupon_codes.csv", help="CSV output filename")
    parser.add_argument("--overwrite", action="store_true", help="Replace an existing output file")
    args = parser.parse_args()
    try:
        codes = make_codes(args.count, args.prefix, args.length)
        destination = Path(args.output)
        destination.parent.mkdir(parents=True, exist_ok=True)
        with destination.open("w" if args.overwrite else "x", newline="", encoding="utf-8-sig") as file:
            writer = csv.DictWriter(file, fieldnames=FIELDS)
            writer.writeheader()
            writer.writerows({"coupon_code": code, "discount_type": "", "discount_value": "", "max_redemptions": "", "expires_at_ist": "", "notes": ""} for code in codes)
        print(f"Generated {len(codes)} unique codes in {destination.resolve()}")
        print("Configure discount rules and redemption limits before enabling any code.")
    except (ValueError, FileExistsError, OSError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
