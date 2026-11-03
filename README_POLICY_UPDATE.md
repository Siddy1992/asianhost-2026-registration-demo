# AsianHOST 2026 — policy and contact pages

## Files
- `terms.html`, `refund.html`, `privacy.html`, `about-contact.html`: four standalone informational pages.
- `policy.css`: styling for the four pages (existing `styles.css` remains unchanged).
- `apply_policy_links.py`: non-destructive script to add footer links and policy acknowledgement to the **current** `index.html`, and links to `checkout.html`.

## Apply to current GitHub checkout
1. Download/clone the **current** repository. Do not replace its existing `app.js`, `checkout.js`, `invoice.html`, or `styles.css` with older demo copies.
2. Copy the five new HTML/CSS files into the repository root, alongside `index.html`.
3. Run `python3 apply_policy_links.py .` from the repository root, or manually add the same links. The script is idempotent.
4. Commit the four pages, CSS, and modified `index.html`/`checkout.html` to `main`. GitHub Pages will deploy automatically.

## Policy approval required
The AsianHOST 2025 cancellation policy requires written requests **before 1 December**, imposes a **USD 50** processing fee, and permits same-price-category substitutions after the deadline. The 2026 adaptation in `refund.html` uses a cutoff of **5 December 2026, 11:59 p.m. IST** (requests received from **6 December** are not considered), as directed by the organizers, and retains the previously drafted **₹5,000** processing fee (at the planning rate of 100 INR/USD). Confirm the processing fee and other policy terms with the organizing committee/administration before production publication. The 2025 policy did not establish a 2026 fee or deadline automatically.

Refund requests are addressed to **Prof. Sarani Bhattacharya**, Program Chair (official 2026 committee spelling), and emailed directly to **bhattacharya.sarani.iitkgp@gmail.com**, the address supplied by the organizer.

The privacy page is a draft. Verify the actual payment gateway, data controller, retention periods and applicable legal notices before launch. The GitHub Pages demonstration is not a live payment processor.

Source: https://www.asianhost.org/2025/registration.htm
Official 2026 committee: https://www.asianhost.org/2026/committee.htm
