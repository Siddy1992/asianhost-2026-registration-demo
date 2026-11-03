# AsianHOST 2026 — Restored Feature Package (3 November 2026)

## Corrected regression

The previous complete package inadvertently reused older `app.js`, `checkout.js`, `index.html` and `styles.css` files, removing features from the earlier GitHub revisions. This release restores them while retaining the latest policy pages and fee updates.

## Restored

- Coupon field and 100% complimentary-registration workflow (`checkout.html`, `checkout.js`).
- Three public example waiver codes for **demonstration only**; valid codes skip the mock gateway and confirm ₹0 due.
- Clear complimentary confirmation and status information (`app.js`).
- **Other — my accepted paper is not listed** option with mandatory Paper ID and Paper Title.
- Illustrative printable invoice layout (`invoice.html`, `invoice.js`, `invoice.css`), explicitly **not an official invoice** and not automatically presented to participants.
- Detailed developer README with the original 14-part structure, now expanded to 16 sections.
- Private coupon-code generator source, capable of producing 150+ unique codes; no real coupon CSV included.

## Retained and updated

- All eight INR fee categories, paper coverage rules, IEEE and student eligibility, and ₹10,000 supplemental balance-payment example.
- Early cutoff: 15 November 2026, 11:59 p.m. IST; regular fees from 16 November.
- Professional participant registration, checkout, confirmation and status lookup with fictional sample records.
- Four mandatory public pages: Terms & Conditions, Refund & Cancellation, Privacy Policy, About & Contact.
- Refund request cutoff: 5 December 2026, 11:59 p.m. IST.
- Refund requests: Prof. Sarani Bhattacharya, `bhattacharya.sarani.iitkgp@gmail.com`.
- Contact: `joydeepchow@gmail.com` and `siddhartha.chowdhury92@gmail.com`.
- Invoice upon request at a later date; real success/failure emails require production backend.

## Additional fixes

- Fixed loading a direct confirmation URL (`index.html?view=confirmation&id=...`).
- Added a checkout-time deadline recheck for unpaid early-rate orders.
- Removed internal 2025 currency-conversion rationale from participant-facing refund page.

## Production caveats

No real payments, coupon validation, email delivery, invoices, or shared status database are provided. A production developer must implement all of them securely. The ₹5,000 processing fee and other legal policy details require organizing-committee approval.
