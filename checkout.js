'use strict';
/* UI reference only: coupon codes are public and NOT suitable for production. */
const STORAGE_KEY='asianhost2026_demo_registrations_inr_v2';
const SAMPLE_COUPONS={
  'AH26-WAIVER-100':{percent:100,label:'Complimentary registration'},
  'ASIANHOST-GUEST':{percent:100,label:'Invited participant waiver'},
  'PHD26-FREE':{percent:100,label:'PhD Forum participation waiver'}
};
const $=id=>document.getElementById(id);
function currency(amount){return '₹'+Number(amount).toLocaleString('en-IN',{maximumFractionDigits:2});}
function escapeHTML(x){return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function records(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch(e){return {}}}
function save(data){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data));return true}catch(e){alert('Browser storage unavailable; this preview cannot be completed.');return false}}
function goHome(id){location.href='index.html?view=confirmation&id='+encodeURIComponent(id)}
document.addEventListener('DOMContentLoaded',()=>{
  const id=new URLSearchParams(location.search).get('id');
  let list=records(),order=list[id];
  if(!order){$('checkout-amount').textContent='Order not found';$('checkout-currency').textContent='Return to the registration page';$('simulate-success').disabled=true;$('simulate-failure').disabled=true;$('apply-coupon').disabled=true;return;}
  const original=Number(order.originalAmount??order.amount);
  const render=()=>{
    const o=records()[id];if(!o)return;
    $('checkout-amount').textContent=currency(o.amount);
    $('checkout-currency').textContent=o.currency+' · Payable amount';
    $('checkout-order').textContent=o.id;
    $('checkout-category').textContent=o.categoryName;
    $('checkout-registrant').textContent=o.person.name;
    if(o.couponCode){$('coupon-discount').classList.remove('hidden');$('coupon-discount').textContent='Original fee '+currency(o.originalAmount)+' · Coupon discount −'+currency(o.discountAmount)+' · Amount due '+currency(o.amount);}
  };
  render();
  const finish=status=>{
    const d=records();let o=d[id];if(!o)return;
    if(o.status==='paid'){goHome(o.kind==='balance'?o.parentId:id);return;}
    o.status=status;o.updated=new Date().toISOString();d[id]=o;
    if(o.kind==='balance'&&status==='paid'){
      const parent=d[o.parentId];if(parent){parent.balancePaid=true;parent.category='nonieee';parent.categoryName='Non-IEEE Member (corrected)';parent.ieeeVerification='ineligible_corrected_by_balance';d[parent.id]=parent;}
    }
    if(save(d))goHome(o.kind==='balance'?o.parentId:id);
  };
  $('apply-coupon').onclick=()=>{
    const code=$('coupon-code').value.trim().toUpperCase();const coupon=SAMPLE_COUPONS[code];
    const msg=$('coupon-message');msg.className='';
    if(order.kind==='balance'){msg.textContent='Supplementary balance payments require organizer authorization and are not eligible for this sample coupon flow.';msg.className='coupon-error';return;}
    if(order.status==='paid'){goHome(id);return;}
    if(!coupon){msg.textContent='Coupon code not recognized. Please check the code and try again.';msg.className='coupon-error';return;}
    const d=records();const o=d[id];if(!o)return;
    // 100% waiver: create a confirmed zero-amount registration, no gateway redirect.
    o.originalAmount=original;o.discountAmount=original;o.amount=0;
    o.couponCode=code;o.couponDescription=coupon.label;o.paymentMethod='complimentary_coupon';
    o.status='paid';o.updated=new Date().toISOString();o.paymentGatewaySkipped=true;
    d[id]=o;
    if(save(d)){msg.textContent='Coupon accepted. Registration fee waived in full.';msg.className='coupon-success';goHome(id);}
  };
  $('simulate-success').onclick=()=>finish('paid');
  $('simulate-failure').onclick=()=>finish('failed');
  $('simulate-cancel').onclick=()=>goHome(order.kind==='balance'?order.parentId:id);
});
