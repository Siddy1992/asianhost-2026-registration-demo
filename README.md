# AsianHOST 2026 – Conference Registration Portal (UI Reference)

A responsive GitHub Pages website showing a conference registration flow, INR registration fees, a sample payment checkout and a searchable sample registration-status page.

## Features
- Registration type selection (paper authors, general attendees and PhD Forum).
- All eight current INR-denominated fee categories.
- Paper-to-full-registration validation and IEEE number collection for organizer review.
- Mobile-friendly participant details, review and checkout.
- Payment success/failure confirmation pages, with registered email, registration ID and invoice-on-request notice.
- Registration status lookup using ID + email. Three built-in fictional records are available to inspect without going through registration.
- Optional ₹10,000 supplementary IEEE/non-IEEE correction workflow.
- Original IIT Kharagpur and AsianHOST logos.

## IMPORTANT: prototype, not live payment collection

This is a **static UI reference for developer handoff**, not a working registration backend or payment provider. No transaction, email, invoice or verification takes place. Browser-generated registrations are stored only in the visitor's `localStorage` and cannot be retrieved from another browser. Sample records are defined in `app.js` and are public fictional data. The confirmation page simulates what the live system should display; actual confirmation/failure emails require a backend with a transactional email service. **Never use this repository to solicit real registrations or payments.**

For production, the website developer must add authenticated backend data storage, real bank gateway order creation and payment verification via signed server callbacks/webhooks, email dispatch, admin access control, and server-side fee verification. Sensitive participant information must not be stored only in browser storage or public GitHub code. GitHub Pages is suitable for demonstration only.

## Deploy to GitHub Pages

1. Upload all files to a public repository, keeping `index.html` and `checkout.html` in its root and `assets/` intact.
2. Settings → Pages → Deploy from a branch → `main` / `(root)` → Save.
3. Open `https://USERNAME.github.io/REPOSITORY/`.
4. Re-upload updated files to `main` to redeploy.

## Sample status references
- `AH26-SAMPLE-0001` + `avery@example.org` — successful
- `AH26-SAMPLE-0002` + `jordan@example.org` — unsuccessful
- `AH26-SAMPLE-0003` + `sam@example.org` — pending

**Registration cutoff:** Early registration is available **through 15 November 2026, 11:59 p.m. IST**. From **16 November 2026, 12:00 a.m. IST**, the demo automatically disables early registration and selects the regular/on-site fee. Fixed-fee categories remain unchanged. The browser also rechecks the cutoff on return to the page and before payment navigation.

**Production requirement:** This GitHub Pages implementation checks the visitor's device clock and is for demonstration only. The live vendor must enforce the deadline and locked fee server-side, using a trusted server timestamp at order creation/payment verification. Users must not be able to select an expired fee by changing the device clock or JavaScript.

Fees are INR base amounts; the production bank gateway may offer international cardholders local-currency conversion, subject to approval and bank policies. The conference team must enforce paper coverage, membership, student eligibility and the registration deadline using a trusted backend.

## Production notification email requirements (developer handoff)

Send a transaction update from the live backend to the email address registered for the participant **after verifying the payment provider's authenticated status response**. Do not trigger a success email based solely on the return-page URL.

**On success**

Subject: `AsianHOST 2026 — Registration Payment Successful — [Registration ID]`

Body should include participant name, registration ID, category, paid amount in INR, payment transaction reference, conference dates, and a link to the Check Status page. State that the invoice can be requested and will be provided at a later date.

**On failure**

Subject: `AsianHOST 2026 — Registration Payment Unsuccessful — [Registration ID]`

Body should include participant name, registration ID, attempted amount, status, advice to retry or contact the registration team, and the status-check link. Avoid saying the registration is confirmed.

**On pending**

Do not issue a success email until payment has been verified. The status page should show `Payment pending` and allow a secure retry or further enquiry.

The developer must replace the public JavaScript data lookup with a secure backend lookup keyed by registration ID and authenticated or appropriately verified email, and integrate a transactional email provider. The static demonstration has no server-side data or email delivery.

## Additional flow: manually entered paper and complimentary coupon

- **Other paper:** In Paper author registration, choose **Other — my accepted paper is not listed**. Paper ID and Paper Title are then required. These are stored in the order with `paperSource: manual` and `paperVerification: pending_organizer_review`. The full-registration coverage rule remains unchanged. In production, the committee must validate the paper against its acceptance records before confirming coverage.
- **100% fee-waiver coupons at checkout:** Enter `AH26-WAIVER-100`, `ASIANHOST-GUEST`, or `PHD26-FREE` on the checkout page. These are fictional **public demo codes**, each reducing the current registration fee to ₹0. On application the browser records a complimentary registration and opens the success page directly, without redirecting to a bank or payment gateway. Status lookup shows the waiver. The codes apply to normal registration categories in this demo; supplementary balance corrections are excluded.
- **Production security:** Never ship valid coupons or authorization logic in public JavaScript. Coupons must be generated and redeemed server-side, with access control, eligibility/scope, limits, expiry, audit trail, atomic redemption and an immutable fee breakdown. Free registrations must be verified and recorded server-side; no gateway charge should be initiated for a zero-value order. The backend must still issue a confirmed registration and confirmation email.
