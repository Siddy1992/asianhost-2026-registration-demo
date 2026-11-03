#!/usr/bin/env python3
"""Static checks for the AsianHOST 2026 reference website; no dependencies."""
from pathlib import Path
import shutil, subprocess
root=Path(__file__).resolve().parent.parent
required=['index.html','app.js','styles.css','checkout.html','checkout.js','invoice.html','invoice.js','invoice.css','terms.html','refund.html','privacy.html','about-contact.html','policy.css','README.md','assets/asianhost-logo.png','assets/iitkgp-logo.png']
for name in required:
    assert (root/name).is_file(),f'Missing {name}'
for name,term in [('checkout.html','id="coupon-code"'),('checkout.js','complimentary_coupon'),('app.js','other-paper-fields'),('index.html','id="other-paper-fields"'),('app.js','2026-11-16T00:00:00+05:30'),('app.js','invoicePreviewAction(rec)'),('app.js','invoiceRequestAction(rec)'),('README.md','## 17. Mandatory invoice-button regression checks'),('refund.html','5 December 2026'),('refund.html','bhattacharya.sarani.iitkgp@gmail.com'),('about-contact.html','joydeepchow@gmail.com'),('README.md','## 14. Developer handoff')]:
    assert term in (root/name).read_text(),f'{name}: missing {term}'
if shutil.which('node'):
    for name in ['app.js','checkout.js','invoice.js']:
        subprocess.run(['node','--check',str(root/name)],check=True)
print('PASS: complete website, coupon feature, invoice action links, policies, deadline, and JavaScript syntax')
