# Private coupon generation utility

Use this script locally to generate a CSV of 150 or more unique coupon codes. Do **not** upload the generated CSV to public GitHub Pages or publish actual authorized coupon codes in browser JavaScript.

```bash
python3 generate_coupons.py --count 150 --prefix AH26 --output coupons_private.csv
```

The frontend includes only three intentionally public **example** 100% waiver codes. The production developer must implement a private server-side coupon registry, eligibility/expiry/usage limits, one-time redemption, atomic transactions and audit logging.

## Verification and regression tests

From the website root:

```bash
python3 developer_tools/verify_package.py
python3 developer_tools/regression_suite.py
```

The second script requires `playwright` and `beautifulsoup4`, plus a Chromium binary at `/usr/bin/chromium`. It checks the **View / Print Invoice Preview** button on both successful confirmation and status lookup, the print control, coupon waivers, fixed fees, full-paper eligibility, manual paper entry and the 15 November cutoff. It also checks that failed and pending records cannot open an invoice preview. The tests are browser-local and never contact a real payment gateway.

The static GitHub Pages ZIP intentionally excludes this `developer_tools/` folder. The complete developer ZIP includes it.
