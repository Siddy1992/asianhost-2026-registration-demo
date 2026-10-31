# AsianHOST 2026 — Interactive Registration / Bank Gateway Demonstration

**A free, static GitHub Pages demo — not a real registration or payment gateway.**

This standalone website demonstrates a conference participant selecting a registration category, entering sample data, reviewing the exact amount/currency, being redirected to a simulated hosted checkout and receiving a mock status confirmation. It uses plain HTML/CSS/JavaScript; no build step or paid hosting is needed.

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server 8000` in the directory and open `http://localhost:8000`.

## Publish free using GitHub Pages

1. Create a repository on GitHub (e.g. `asianhost-2026-registration-demo`).
2. Upload **all the contents of this folder** into the repository root, preserving `assets/`.
3. In the repository go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**. Choose **main** and **/(root)**, then **Save**.
5. GitHub will display the Pages URL: `https://YOUR-USERNAME.github.io/asianhost-2026-registration-demo/`.
6. Use that Pages URL for the bank meeting. No payment gateway account is required for the demo.

For an organization-managed repository, publish under the organization's GitHub account with the proper permissions. If GitHub Pages is unavailable due to repository visibility or plan rules, consult your account settings.

## Demonstrate the workflow

1. Choose `Paper author`, select paper `#18` and note how a covering full registration restricts categories to IEEE Member / Non-IEEE Member.
2. Switch between Early and Regular fees (demo control only; the real registration deadline will be enforced server-side).
3. Continue to details and select **Fill sample participant for demo**.
4. Review, agree to demo acknowledgement and click **Proceed to demo gateway**.
5. The mock checkout shows a specific order ID, currency and fixed fee. Choose **Simulate successful payment**.
6. The registration-status page shows the mock payment result.
7. If the registered category was IEEE Member, use **Demonstrate ₹10,000 non-member balance payment** in Status to illustrate a supplementary charge.
8. Use **For the Bank** to explain requirements for a live gateway integration.

## Fee configuration

| Category | Early | Regular / On-site | Fixed |
| --- | --- | --- | --- |
| IEEE Member | ₹50,000 | ₹60,000 | — |
| Non-IEEE Member | ₹60,000 | ₹70,000 | — |
| IEEE Member – Student | ₹15,000 | ₹25,000 | — |
| Non-IEEE Member – Student | ₹25,000 | ₹35,000 | — |
| IEEE Life Member | ₹25,000 | ₹35,000 | — |
| General Participation – Indian Student | — | — | ₹2,000 |
| PhD Forum – International | — | — | ₹15,000 |
| PhD Forum – Indian | — | — | ₹5,000 |

All eight registration categories use INR as the fixed base currency. The values reflect the organizer-proposed conversion of the earlier USD prices at ₹100 per USD; they are not live FX quotes. Any optional local-currency display or dynamic currency conversion for international participants would be managed by the real payment provider. This static demonstration displays and simulates charges in INR only. The committee supplied these fee amounts. The 12 accepted main-conference paper IDs/titles are from [AsianHOST 2026's programme](https://www.asianhost.org/2026/program.htm); the programme is subject to organizer updates. Paper #18 is only a sample in the walkthrough; paper coverage is **not** actually verified across visitors because the site is static.

## Important limits

- No payments are processed; there is **no Razorpay/bank integration**, merchant key, payment API or bank settlement.
- No real registration is completed or submitted to organizers. Data is stored in browser **localStorage** only, on that device. The updated INR demo uses a fresh demonstration storage key, so older simulated USD transactions will not appear. The Check Status page works only on the same browser. Use sample data, not actual personal information.
- IEEE membership numbers are not checked. The live system will send them for manual organizer verification.
- The mock ₹10,000 balance-payment mechanism only covers a wrong **IEEE Member → Non-IEEE Member** selection; it is a simulation.
- The Early/Regular switch is for demonstration. In production the deadline and price must be calculated and enforced by the backend.
- Do **not** insert real gateway public or secret credentials into client-side JavaScript or GitHub Pages.
- Live integration requires a trusted backend (or approved serverless functions) to create fixed-amount orders, verify authenticated gateway callbacks, keep registration records, enforce one full registration per paper, and reconcile payment status. A browser redirect or static success message alone is not proof of payment.
- Hosting the form publicly may require conference approval for branding and a privacy policy before processing personal data.

## Brand / event references

AsianHOST 2026, 11–13 December 2026, IIT Kharagpur Research Park, Kolkata. Logos were provided by the conference organizers for this demo. Website: https://www.asianhost.org/2026/.
