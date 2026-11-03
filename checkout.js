'use strict';
/* UI reference only: sample coupon codes are public and NOT suitable for production. */
const STORAGE_KEY='asianhost2026_demo_registrations_inr_v2';
const SAMPLE_COUPONS={
  'AH26-WAIVER-100':{percent:100,label:'Complimentary registration'},
  'ASIANHOST-GUEST':{percent:100,label:'Invited participant waiver'},
  'PHD26-FREE':{percent:100,label:'PhD Forum participation waiver'}
};
const REGULAR_START_MS=Date.parse('2026-11-16T00:00:00+05:30');
const REGULAR_AMOUNTS={'ieee':60000,'nonieee':70000,'ieee-student':25000,'nonieee-student':35000,'life':35000};
const $=id=>document.getElementById(id);
const money=n=>'₹'+Number(n).toLocaleString('en-IN',{maximumFractionDigits:2});
function records(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch(_){return {}}}
function save(d){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(d));return true}catch(_){alert('Browser storage unavailable. Please try again.');return false}}
function goHome(id){location.href='index.html?view=confirmation&id='+encodeURIComponent(id)}
document.addEventListener('DOMContentLoaded',()=>{
  const id=new URLSearchParams(location.search).get('id');
  let d=records(),order=d[id];
  if(!order){$('checkout-amount').textContent='Order not found';$('checkout-currency').textContent='Return to the registration page';['simulate-success','simulate-failure','apply-coupon'].forEach(k=>$(k).disabled=true);return}
  // Demo safety net: a pending early-rate order cannot be paid after the cutoff.
  if(order.kind==='registration'&&order.status!=='paid'&&order.period==='early'&&Date.now()>=REGULAR_START_MS&&REGULAR_AMOUNTS[order.category]!=null){
    order.period='regular';order.amount=REGULAR_AMOUNTS[order.category];order.updated=new Date().toISOString();d[id]=order;save(d);
    $('coupon-message').textContent='The early-registration deadline has passed. Your amount has been updated to the regular/on-site fee.';
    $('coupon-message').className='coupon-error';
  }
  const render=()=>{const o=records()[id];if(!o)return;
    $('checkout-amount').textContent=money(o.amount);$('checkout-currency').textContent='INR · Payable amount';
    $('checkout-order').textContent=o.id;$('checkout-category').textContent=o.categoryName;$('checkout-registrant').textContent=o.person.name;
    if(o.couponCode){$('coupon-discount').classList.remove('hidden');$('coupon-discount').textContent='Original fee '+money(o.originalAmount)+' · Coupon discount −'+money(o.discountAmount)+' · Amount due '+money(o.amount);}
  };render();
  const finish=status=>{const data=records(),o=data[id];if(!o)return;
    if(o.status==='paid'){goHome(o.kind==='balance'?o.parentId:id);return;}
    o.status=status;o.updated=new Date().toISOString();data[id]=o;
    if(o.kind==='balance'&&status==='paid'){
      const parent=data[o.parentId];if(parent){parent.balancePaid=true;parent.category='nonieee';parent.categoryName='Non-IEEE Member (corrected)';parent.ieeeVerification='ineligible_corrected_by_balance';data[parent.id]=parent;}
    }
    if(save(data))goHome(o.kind==='balance'?o.parentId:id);
  };
  $('apply-coupon').onclick=()=>{
    const code=$('coupon-code').value.trim().toUpperCase(),coupon=SAMPLE_COUPONS[code],msg=$('coupon-message');msg.className='';
    const current=records()[id];if(!current)return;
    if(current.kind==='balance'){msg.textContent='Supplementary balance payments require organizer authorization and are not eligible for this coupon.';msg.className='coupon-error';return;}
    if(current.status==='paid'){goHome(id);return;}
    if(!coupon){msg.textContent='Coupon code not recognized. Please check the code and try again.';msg.className='coupon-error';return;}
    const data=records(),o=data[id],original=Number(o.originalAmount??o.amount);
    o.originalAmount=original;o.discountAmount=original;o.amount=0;
    o.couponCode=code;o.couponDescription=coupon.label;o.paymentMethod='complimentary_coupon';
    o.status='paid';o.updated=new Date().toISOString();o.paymentGatewaySkipped=true;data[id]=o;
    if(save(data)){msg.textContent='Coupon accepted. Registration fee waived in full.';msg.className='coupon-success';goHome(id);}
  };
  $('simulate-success').onclick=()=>finish('paid');
  $('simulate-failure').onclick=()=>finish('failed');
  $('simulate-cancel').onclick=()=>goHome(order.kind==='balance'?order.parentId:id);
});
