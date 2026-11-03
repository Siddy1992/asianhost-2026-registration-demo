#!/usr/bin/env python3
"""Add informational-page links to an existing AsianHOST site without replacing app.js or styles.css."""
from pathlib import Path
import sys
root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.')
links='<div class="policy-links" style="display:flex;flex-wrap:wrap;gap:12px;margin-top:8px;font-size:12px">'+''.join('<a style="color:inherit;text-decoration:underline" href="'+u+'">'+n+'</a>' for n,u in [('Terms & Conditions','terms.html'),('Refund & Cancellation','refund.html'),('Privacy Policy','privacy.html'),('About & Contact','about-contact.html')])+'</div>'
for filename in ['index.html','checkout.html']:
 p=root/filename
 if not p.exists():
  print('Skipping missing',filename);continue
 s=p.read_text(encoding='utf-8')
 if 'href="terms.html"' not in s:
  if filename=='index.html' and '<footer class="site-footer">' in s:
   s=s.replace('</footer>',links+'</footer>',1)
  elif filename=='checkout.html':
   s=s.replace('</body>', '<div class="checkout-policy-links" style="max-width:1100px;margin:25px auto;padding:0 20px;color:#5c6c85;text-align:center">'+links+'</div></body>')
  else:
   print('Could not identify footer in',filename);continue
 if filename=='index.html' and 'id="terms"' in s and 'I agree to the' not in s:
  s=s.replace('I have reviewed the details and confirm they are accurate.', 'I have reviewed the details, confirm they are accurate, and agree to the <a href="terms.html" target="_blank" rel="noopener">Terms & Conditions</a>, <a href="refund.html" target="_blank" rel="noopener">Refund & Cancellation Policy</a> and <a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a>.')
 p.write_text(s,encoding='utf-8')
 print('Updated',filename)
print('Keep all other existing application files unchanged.')
