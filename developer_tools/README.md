# Private coupon generation utility

Use this script locally to generate a CSV of 150 or more unique coupon codes. Do **not** upload the generated CSV to public GitHub Pages or publish actual authorized coupon codes in browser JavaScript.

```bash
python3 generate_coupons.py --count 150 --prefix AH26 --output coupons_private.csv
```

The frontend includes only three intentionally public **example** 100% waiver codes. The production developer must implement a private server-side coupon registry, eligibility/expiry/usage limits, one-time redemption, atomic transactions and audit logging.
