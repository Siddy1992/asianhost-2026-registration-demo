'use strict';
// Illustration only: no authenticated user, real payment, legal invoice, or GST calculation.
const STORAGE_KEY='asianhost2026_demo_registrations_inr_v2';
const SAMPLE_PAID={'AH26-SAMPLE-0001':{id:'AH26-SAMPLE-0001',kind:'registration',purpose:'author',period:'early',categoryName:'IEEE Member',amount:50000,currency:'INR',paperId:'5',paperTitle:'Separating Low-Pass Filtering from Decimation in Dilithium Side-Channel Profiling',person:{name:'Avery Example',email:'avery@example.org',institution:'Example University'},status:'paid',created:'2026-10-30T10:20:00Z',sample:true}};
const $=id=>document.getElementById(id),money=n=>'₹'+Number(n).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function records(){let d={};try{let x=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');if(x&&typeof x==='object'&&!Array.isArray(x))d=x}catch(_){}return {...SAMPLE_PAID,...d}}
function set(id,value){$(id).textContent=String(value??'—')}
function error(msg){$('invoice-sheet').hidden=true;$('print-invoice').disabled=true;$('invoice-error').hidden=false;$('invoice-error').innerHTML='<h2>Illustrative invoice unavailable</h2><p>'+esc(msg)+'</p><a href="index.html?view=status">Return to registration status</a>'}
function date(iso){let d=new Date(iso);return Number.isNaN(d.getTime())?'—':new Intl.DateTimeFormat('en-IN',{day:'2-digit',month:'short',year:'numeric',timeZone:'Asia/Kolkata'}).format(d)}
function render(rec){
 if(!rec||rec.kind==='balance')return error('No valid conference registration was found for this reference.');
 if(rec.status!=='paid')return error('This illustration is available only for successful or complimentary demo registrations.');
 if(rec.currency!=='INR')return error('Only INR registrations are supported.');
 const p=rec.person||{},waived=rec.paymentMethod==='complimentary_coupon',original=Number(rec.originalAmount??rec.amount),discount=waived?Number(rec.discountAmount??original):0,correction=rec.balancePaid?10000:0,total=Number(rec.amount)+correction;
 if(![original,discount,total].every(x=>Number.isFinite(x)&&x>=0))return error('Incomplete fee data.');
 $('invoice-bill-to').innerHTML='<strong>'+esc(p.billing||p.name||'—')+'</strong><br>'+esc(p.institution||'')+(p.institution?'<br>':'')+esc([p.city,p.country].filter(Boolean).join(', '))+'<br>'+esc(p.email||'');
 set('invoice-gstin',p.gstin?'GSTIN provided by participant (unverified): '+p.gstin:'No participant GSTIN provided');
 set('invoice-number','SAMPLE-'+rec.id);set('invoice-registration',rec.id);set('invoice-date',date(rec.updated||rec.created));set('invoice-method',waived?'100% complimentary coupon':'Simulated payment success');set('invoice-status',waived?'COMPLIMENTARY':'SIMULATED PAID');
 const description=rec.purpose==='phd'?'PhD Forum participation':rec.purpose==='author'?'Conference author registration':'Conference registration',paper=rec.paperId?' · Paper #'+rec.paperId:'',period=['early','regular'].includes(rec.period)?(rec.period==='early'?'Early registration':'Regular / on-site'):'Fixed fee';
 let rows='<tr><td><strong>'+esc(description)+'</strong><small>'+esc('AsianHOST 2026'+paper)+'</small></td><td>'+esc(rec.categoryName||'Registration')+'<small>'+esc(period)+'</small></td><td class="right">'+money(original)+'</td></tr>';
 if(correction)rows+='<tr><td><strong>Supplementary category correction</strong></td><td>Additional fee</td><td class="right">'+money(correction)+'</td></tr>';
 $('invoice-lines').innerHTML=rows;set('invoice-subtotal',money(original+correction));$('discount-row').hidden=!waived;set('invoice-discount','−'+money(discount));set('invoice-total',money(total));
 set('invoice-waiver-note',waived?'A 100% example coupon ('+(rec.couponCode||'')+') was applied. No gateway transaction occurred.':'This is a simulated success record; no actual funds were received.');
 $('invoice-error').hidden=true;$('invoice-sheet').hidden=false;$('print-invoice').disabled=false;document.title='SAMPLE Invoice '+rec.id+' | AsianHOST 2026';
}
document.addEventListener('DOMContentLoaded',()=>{let id=new URLSearchParams(location.search).get('id');if(!id)return error('Open with a confirmed registration ID.');let rec=records()[id];if(!rec)return error('Registration not found in this browser.');render(rec);$('print-invoice').onclick=()=>window.print()});
