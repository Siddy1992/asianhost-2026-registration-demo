'use strict';
const STORAGE_KEY='asianhost2026_demo_registrations_inr_v2';
const $=id=>document.getElementById(id);
function currency(item){return(item.currency==='INR'?'₹':'$')+Number(item.amount).toLocaleString('en-IN',{maximumFractionDigits:2})}
function records(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch(e){return {}}}
function save(data){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data));return true}catch(e){alert('Browser storage unavailable; this preview cannot be completed.');return false}}
function goHome(id){location.href='index.html?view=confirmation&id='+encodeURIComponent(id)}
document.addEventListener('DOMContentLoaded',()=>{const p=new URLSearchParams(location.search);const id=p.get('id');let list=records(),order=list[id];if(!order){$('checkout-amount').textContent='Order not found';$('checkout-currency').textContent='Return to the registration page';$('simulate-success').disabled=true;$('simulate-failure').disabled=true;return}
$('checkout-amount').textContent=currency(order);$('checkout-currency').textContent=order.currency+' · Payable amount';$('checkout-order').textContent=order.id;$('checkout-category').textContent=order.categoryName;$('checkout-registrant').textContent=order.person.name;
const finish=status=>{const d=records();let o=d[id];if(!o)return;if(o.status==='paid'&&status!=='paid'){goHome(o.kind==='balance'?o.parentId:id);return}o.status=status;o.updated=new Date().toISOString();d[id]=o;if(o.kind==='balance'&&status==='paid'){const parent=d[o.parentId];if(parent){parent.balancePaid=true;parent.category='nonieee';parent.categoryName='Non-IEEE Member (corrected)';parent.ieeeVerification='ineligible_corrected_by_balance';d[parent.id]=parent}}if(save(d))goHome(o.kind==='balance'?o.parentId:id)};
$('simulate-success').onclick=()=>finish('paid');$('simulate-failure').onclick=()=>finish('failed');$('simulate-cancel').onclick=()=>goHome(order.kind==='balance'?order.parentId:id);
});
