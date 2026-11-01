"use strict";
// Demonstration only: no backend, authenticated user, legal invoice, payment, or GST calculation.
const STORAGE_KEY = 'asianhost2026_demo_registrations_inr_v2';
const SAMPLE_PAID = {
  'AH26-SAMPLE-0001': {id:'AH26-SAMPLE-0001',kind:'registration',purpose:'author',period:'early',categoryName:'IEEE Member',amount:50000,currency:'INR',paperId:'5',paperTitle:'Separating Low-Pass Filtering from Decimation in Dilithium Side-Channel Profiling',person:{name:'Avery Example',email:'avery@example.org',institution:'Example University'},status:'paid',created:'2026-10-30T10:20:00Z',sample:true}
};
const $ = id => document.getElementById(id);
const money = n => '₹' + Number(n).toLocaleString('en-IN', {minimumFractionDigits:2,maximumFractionDigits:2});
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function records(){
  let stored={};
  try { const x=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'); if(x && typeof x==='object' && !Array.isArray(x))stored=x; } catch(_){}
  return {...SAMPLE_PAID,...stored};
}
function setText(id, val){$(id).textContent=String(val??'—');}
function error(msg){
  $('invoice-sheet').hidden=true;
  $('print-invoice').disabled=true;
  $('invoice-error').hidden=false;
  $('invoice-error').innerHTML='<h2>Invoice preview unavailable</h2><p>'+esc(msg)+'</p><a class="action secondary" href="index.html?view=status">Return to registration status</a>';
}
function prettyDate(iso){
  const d=new Date(iso);
  return Number.isNaN(d.getTime())?'—':new Intl.DateTimeFormat('en-IN',{day:'2-digit',month:'short',year:'numeric',timeZone:'Asia/Kolkata'}).format(d);
}
function makeInvoice(rec){
  if(!rec || rec.kind==='balance')return error('No valid conference registration was found for this reference.');
  if(rec.status!=='paid')return error('The registration is not confirmed. Invoice previews are available only for successful or complimentary registrations.');
  if(rec.currency!=='INR')return error('This preview currently supports INR registrations only.');
  const person=rec.person||{};
  const isWaived=rec.paymentMethod==='complimentary_coupon';
  const original=Number(rec.originalAmount??rec.amount);
  const discount=isWaived?Number(rec.discountAmount??original):0;
  const correction=rec.balancePaid?10000:0;
  const finalAmount=Number(rec.amount)+correction;
  if(!Number.isFinite(original)||original<0||!Number.isFinite(discount)||discount<0||!Number.isFinite(finalAmount)||finalAmount<0)return error('This registration has incomplete fee information.');
  const billName=person.billing||person.name||'—';
  $('invoice-bill-to').innerHTML='<strong>'+esc(billName)+'</strong><br>'+esc(person.institution||'')+(person.institution?'<br>':'')+esc([person.city,person.country].filter(Boolean).join(', '))+'<br>'+esc(person.email||'');
  $('invoice-gstin').textContent=person.gstin?'GSTIN provided by participant (unverified): '+person.gstin:'No participant GSTIN provided';
  setText('invoice-number','DEMO-INV-'+rec.id);
  setText('invoice-registration',rec.id);
  setText('invoice-date',prettyDate(rec.updated||rec.created));
  setText('invoice-method',isWaived?'100% complimentary coupon':rec.sample?'Simulated successful payment':'Simulated payment success');
  setText('invoice-status',isWaived?'COMPLIMENTARY':'SIMULATED PAID');
  const description=rec.purpose==='phd'?'PhD Forum participation':rec.purpose==='author'?'Conference author registration':'Conference registration';
  const paper=rec.paperId?' · Paper #'+rec.paperId:'';
  const period=['early','regular'].includes(rec.period)?(rec.period==='early'?'Early registration':'Regular / on-site'):'Fixed fee';
  let rows='<tr><td><strong>'+esc(description)+'</strong><small>'+esc('AsianHOST 2026'+paper)+'</small></td><td>'+esc(rec.categoryName||'Registration')+'<small>'+esc(period)+'</small></td><td class="right">'+money(original)+'</td></tr>';
  if(correction)rows+='<tr><td><strong>Supplementary category correction</strong><small>IEEE to Non-IEEE balance payment (demo)</small></td><td>Additional fee</td><td class="right">'+money(correction)+'</td></tr>';
  $('invoice-lines').innerHTML=rows;
  setText('invoice-subtotal',money(original+correction));
  $('discount-row').hidden=!isWaived;
  setText('invoice-discount','−'+money(discount));
  setText('invoice-total',money(finalAmount));
  $('invoice-waiver-note').textContent=isWaived?'A 100% complimentary coupon ('+String(rec.couponCode||'demo coupon')+') was applied. No payment gateway transaction occurred.':'This record is marked as successfully paid in the static demo; no real funds were received.';
  $('invoice-error').hidden=true;
  $('invoice-sheet').hidden=false;
  $('print-invoice').disabled=false;
  document.title='DEMO Invoice '+rec.id+' | AsianHOST 2026';
}
document.addEventListener('DOMContentLoaded',()=>{
  const id=new URLSearchParams(location.search).get('id');
  if(!id)return error('Open this page from a confirmed registration or its status screen.');
  const rec=records()[id];
  if(!rec)return error('This registration was not found in this browser. Sample records and new registrations are stored locally in the demo.');
  makeInvoice(rec);
  $('print-invoice').addEventListener('click',()=>window.print());
});
