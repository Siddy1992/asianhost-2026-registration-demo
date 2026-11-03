#!/usr/bin/env python3
"""Browser regression tests for the static AsianHOST 2026 developer reference.

Requires: pip install playwright beautifulsoup4; chromium installed at /usr/bin/chromium.
Run: python developer_tools/regression_suite.py
Tests run in-memory; they do not contact a payment provider or send emails.
"""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import subprocess, json, shutil, re

P=Path(__file__).resolve().parent.parent
KEY='asianhost2026_demo_registrations_inr_v2'


def setup_page(browser, name, js, records=None, query_id=None, fake_time=None):
    page=browser.new_page()
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.set_content((P/name).read_text(),wait_until='domcontentloaded')
    seed=json.dumps(records or {})
    bootstrap="""(seed) => {
      let data=JSON.stringify(seed);
      Object.defineProperty(window,'localStorage',{configurable:true,value:{
        getItem:(k)=>k==='asianhost2026_demo_registrations_inr_v2'?data:null,
        setItem:(k,v)=>{if(k==='asianhost2026_demo_registrations_inr_v2')data=v},
        removeItem:()=>{data='{}'},clear:()=>{data='{}'}
      }});
      window.__getRecords=()=>JSON.parse(data);
      history.replaceState=()=>{};
      window.scrollTo=()=>{};
    }"""
    page.evaluate(bootstrap,records or {})
    script=(P/js).read_text()
    if query_id is not None:
        if js=='app.js':
            script=script.replace("const id=new URLSearchParams(location.search).get('id');let rec=records()[id];const panel=$('confirmation-card');",f"const id={json.dumps(query_id)};let rec=records()[id];const panel=$('confirmation-card');")
        elif js=='invoice.js':
            script=script.replace("let id=new URLSearchParams(location.search).get('id');",f"let id={json.dumps(query_id)};")
        elif js=='checkout.js':
            script=script.replace("const id=new URLSearchParams(location.search).get('id');",f"const id={json.dumps(query_id)};")
            script=script.replace("function goHome(id){location.href='index.html?view=confirmation&id='+encodeURIComponent(id)}", "function goHome(id){window.__navigated=id}")
    if fake_time:
        page.evaluate("t => {Date.now=()=>Date.parse(t)}",fake_time)
    page.add_script_tag(content=script)
    page.evaluate("document.dispatchEvent(new Event('DOMContentLoaded'))")
    return page,errors


def run():
    required=['index.html','app.js','styles.css','checkout.html','checkout.js','invoice.html','invoice.js','invoice.css','terms.html','refund.html','privacy.html','about-contact.html','policy.css','README.md','CHANGELOG.md','assets/asianhost-logo.png','assets/iitkgp-logo.png']
    for f in required: assert (P/f).is_file(),f'Missing {f}'
    for name in ['app.js','checkout.js','invoice.js']:
        subprocess.run(['node','--check',str(P/name)],check=True)
    for name in ['index.html','checkout.html','invoice.html','terms.html','refund.html','privacy.html','about-contact.html']:
        soup=BeautifulSoup((P/name).read_text(),'html.parser')
        for tag in soup.find_all(['a','link','script','img']):
            url=tag.get('href') or tag.get('src') or ''
            if not url or url.startswith(('http:','https:','mailto:','#','data:','javascript:')):continue
            target=url.split('?')[0].split('#')[0]
            assert (P/target).exists(),f'{name}: missing {target}'
    for path,term in [
        ('checkout.html','id="coupon-code"'),('checkout.js','AH26-WAIVER-100'),
        ('app.js','invoicePreviewAction(rec)'),('app.js','invoiceRequestAction(rec)'),
        ('index.html','other-paper-fields'),('app.js','REGULAR_START_MS'),
        ('invoice.html','id="print-invoice"'),('invoice.html','NOT AN OFFICIAL INVOICE'),
        ('refund.html','5 December 2026'),('refund.html','bhattacharya.sarani.iitkgp@gmail.com'),
        ('about-contact.html','joydeepchow@gmail.com'),('about-contact.html','siddhartha.chowdhury92@gmail.com'),
        ('README.md','## 17. Mandatory invoice-button regression checks')]:
        assert term in (P/path).read_text(),f'{path}: missing {term}'

    with sync_playwright() as playwright:
        browser=playwright.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
        # Paid sample -> status -> invoice button; failed/pending must not have one.
        page,errors=setup_page(browser,'index.html','app.js',fake_time='2026-11-15T23:59:59+05:30')
        assert page.locator('#paper-select option').count()==14
        fees=page.evaluate('RATES.map(x=>({id:x.id,early:x.early,regular:x.regular,fixed:x.fixed}))')
        assert len(fees)==8,fees
        expected={'ieee':(50000,60000),'nonieee':(60000,70000),'ieee-student':(15000,25000),'nonieee-student':(25000,35000),'life':(25000,35000),'indian-student':(2000,2000),'phd-intl':(15000,15000),'phd-indian':(5000,5000)}
        for f in fees:
            assert (f.get('early') if f.get('early') is not None else f.get('fixed'),f.get('regular') if f.get('regular') is not None else f.get('fixed'))==expected[f['id']],f
        assert page.locator('#fee-preview').inner_text()=='₹50,000'
        assert not page.locator('#early-btn').is_disabled()
        page.locator('[data-view=status]').first.click()
        page.locator('[data-sample-id="AH26-SAMPLE-0001"]').click()
        assert 'Payment successful' in page.locator('#status-result').inner_text()
        button=page.locator('#status-result a.invoice-preview-action')
        assert button.count()==1 and button.is_visible()
        assert button.get_attribute('href')=='invoice.html?id=AH26-SAMPLE-0001'
        assert page.locator('#status-result a[href^="mailto:"]').count()==0
        page.locator('[data-sample-id="AH26-SAMPLE-0002"]').click()
        assert page.locator('#status-result a.invoice-preview-action').count()==0
        page.locator('[data-sample-id="AH26-SAMPLE-0003"]').click()
        assert page.locator('#status-result a.invoice-preview-action').count()==0
        assert not errors,errors
        print('PASS: paid status invoice button, sample lookup, failed/pending restriction')
        page.close()

        # Confirmation paid and complimentary; request action only for non-sample.
        paid={'id':'AH26-PAID-0001','kind':'registration','purpose':'author','period':'early','category':'ieee','categoryName':'IEEE Member','currency':'INR','amount':50000,'person':{'name':'Alex Example','email':'alex@example.org'},'status':'paid','created':'2026-11-01T10:00:00Z'}
        waived={'id':'AH26-WAIVED-0001','kind':'registration','purpose':'phd','period':'regular','category':'phd-indian','categoryName':'PhD Forum – Indian','currency':'INR','amount':0,'originalAmount':5000,'discountAmount':5000,'couponCode':'PHD26-FREE','paymentMethod':'complimentary_coupon','person':{'name':'Sample Waived','email':'waived@example.org'},'status':'paid','created':'2026-11-01T10:00:00Z'}
        for rec in [paid,waived]:
            page,errors=setup_page(browser,'index.html','app.js',records={rec['id']:rec},query_id=rec['id'])
            page.evaluate('renderConfirmationFromQuery()')
            assert page.locator('#confirmation-card a.invoice-preview-action').count()==1
            assert page.locator('#confirmation-card a.invoice-preview-action').get_attribute('href')=='invoice.html?id='+rec['id']
            assert page.locator('#confirmation-card a[href^="mailto:"]').count()==1
            assert 'request' in page.locator('.confirmation-invoice').inner_text().lower()
            page.evaluate(f"showStatus(records()[{json.dumps(rec['id'])}])")
            assert page.locator('#status-result a.invoice-preview-action').count()==1
            assert page.locator('#status-result a[href^="mailto:"]').count()==1
            if rec is waived:
                assert 'Fee waived' in page.locator('#status-result').inner_text()
                assert 'PHD26-FREE' in page.locator('#confirmation-card').inner_text()
            assert not errors,errors
            page.close()
        print('PASS: successful and complimentary confirmation/status invoice + request buttons')

        # Unsuccessful confirmation must not offer invoice actions.
        failed={**paid,'id':'AH26-FAIL-0001','status':'failed'}
        page,errors=setup_page(browser,'index.html','app.js',records={failed['id']:failed},query_id=failed['id'])
        page.evaluate('renderConfirmationFromQuery()')
        assert page.locator('#confirmation-card a.invoice-preview-action').count()==0
        assert page.locator('#confirmation-card a[href^="mailto:"]').count()==0
        assert not errors,errors
        page.close()
        print('PASS: failed confirmation cannot generate invoice preview')

        # Invoice preview should render for paid, waived; print control enabled.
        for rec,amount in [(paid,'50,000.00'),(waived,'0.00')]:
            page,errors=setup_page(browser,'invoice.html','invoice.js',records={rec['id']:rec},query_id=rec['id'])
            assert page.locator('#invoice-sheet').is_visible()
            assert page.locator('#print-invoice').is_enabled()
            page.evaluate('window.print=()=>{window.__printed=true}')
            page.locator('#print-invoice').click()
            assert page.evaluate('window.__printed') is True
            assert amount in page.locator('#invoice-total').inner_text()
            assert 'NOT AN OFFICIAL INVOICE' in page.locator('.watermark').inner_text()
            if rec is waived:
                assert page.locator('#discount-row').is_visible()
            assert not errors,errors
            page.close()
        print('PASS: invoice preview, watermark, print button and waived total')

        # Coupon 100% bypass and no gateway action; invalid coupon.
        order={**paid,'id':'AH26-ORDER-0001','status':'pending'}
        page,errors=setup_page(browser,'checkout.html','checkout.js',records={order['id']:order},query_id=order['id'])
        page.locator('#coupon-code').fill('BAD-CODE')
        page.locator('#apply-coupon').click()
        assert 'not recognized' in page.locator('#coupon-message').inner_text()
        page.locator('#coupon-code').fill('AH26-WAIVER-100')
        page.locator('#apply-coupon').click()
        stored=page.evaluate("window.__getRecords()['AH26-ORDER-0001']")
        assert stored['status']=='paid' and stored['amount']==0 and stored['paymentGatewaySkipped']
        assert page.evaluate('window.__navigated')=='AH26-ORDER-0001'
        assert not errors,errors
        page.close()
        print('PASS: coupon validation, ₹0 waiver and gateway bypass')

        # Manual paper entry and early deadline transition.
        page,errors=setup_page(browser,'index.html','app.js',fake_time='2026-11-15T23:59:59+05:30')
        page.locator('#paper-select').select_option('other')
        assert page.locator('#other-paper-fields').is_visible()
        page.locator('#continue-1').click()
        assert 'Paper ID' in page.locator('#toast').inner_text()
        page.locator('#other-paper-id').fill('AH26-999')
        page.locator('#other-paper-title').fill('Example paper')
        page.locator('#continue-1').click()
        assert page.locator('#step2-panel').is_visible()
        assert not errors,errors
        page.close()
        page,errors=setup_page(browser,'index.html','app.js',fake_time='2026-11-16T00:00:00+05:30')
        assert page.locator('#early-btn').is_disabled()
        assert page.locator('#fee-preview').inner_text()=='₹60,000'
        assert 'closed' in page.locator('#registration-deadline-note').inner_text()
        assert not errors,errors
        # Fixed PhD Forum fees remain available after the early deadline.
        page.evaluate("updatePurpose('phd')")
        assert page.locator('#fee-preview').inner_text()=='₹15,000'
        assert 'hidden' in page.locator('.tier-row').get_attribute('class')
        # Main-conference author coverage restricts categories to full registrations.
        page.evaluate("updatePurpose('author')")
        assert page.locator('#fee-options [data-category]').count()==2
        assert not errors,errors
        page.close()
        print('PASS: manual paper entry, full-paper coverage, PhD fixed fees, deadline boundary')

        browser.close()
    print('ALL REGRESSION TESTS PASSED')

if __name__=='__main__': run()
