'use strict';
/* AsianHOST 2026: static UI prototype. No real transactions, accounts or mail delivery. */
const STORAGE_KEY='asianhost2026_demo_registrations_inr_v2';
const OTHER_PAPER_VALUE='other';
// Early rates are available through 15 November 2026, 23:59:59 IST.
// At 00:00 IST on 16 November, only regular/on-site rates remain available.
const REGULAR_START_MS = Date.parse('2026-11-16T00:00:00+05:30');
function isEarlyRegistrationOpen(){return Date.now()<REGULAR_START_MS;}

const PAPER_LIST=[
{id:'5',title:'Separating Low-Pass Filtering from Decimation in Dilithium Side-Channel Profiling',authors:'Xu Li, Jiatong Tian, Bei Wang, Chenghua Wang, Weiqiang Liu and Yijun Cui'},
{id:'9',title:'ARCHE: Hardware-Managed Pointer Provenance Propagation for Capability Architectures',authors:'Mishel Jyothis Paul, Edwin Kayang, Eric Jahns and Michel Kinsy'},
{id:'10',title:'ENFORGE: Automatic Capability Injection for Hardware-Enforced Memory Safety',authors:'Edwin Kayang, Mishel Jyothis Paul and Michel Kinsy'},
{id:'18',title:'ScanFree: LLM-Guided Sequential ATPG for Circuits Where Scan Chains Are Inadmissible',authors:'Weimin Fu, Zelin Lu, Gang Qu and Xiaolong Guo'},
{id:'19',title:'Control-Flow Collapse: Hijacking Mixture-of-Experts Routing via Single-Bit Faults in the Gating Path',authors:'Weimin Fu, Zelin Lu, Gang Qu and Xiaolong Guo'},
{id:'22',title:"StreamLeak: Exploiting Intel's Write-Combining Buffer for Cross-Domain Covert and Side Channels",authors:'Taiyuan Shi, Zhihao Zhang, Qingyu Ye, Chunlu Wang and Pengfei Qiu'},
{id:'23',title:'Accelerating Fault Propagation Property Verification for Cryptographic Designs Through Symbolic Execution',authors:'Xuan Huang, Wei Hu, Shibo Tang, Xingxin Wang, Lingjuan Wu, Liang Hong and Yannan Li'},
{id:'24',title:'Tripwire: Fault-Delivery Relocation Across Software Component Boundaries via Deferred x87 Exceptions',authors:'Xiaojie Zhang, Zeru Lan, Qingyu Ye, Chunlu Wang, Pengfei Qiu and Chongyan Gao'},
{id:'26',title:'A Heuristic-Based Fault-Tolerant Solver for Noisy Small-Integer Inequality Systems',authors:'Xiaoyu Zhang, Yijun Cui, Bei Wang, Jiatong Tian, Chenghua Wang and Weiqiang Liu'},
{id:'28',title:'State-Space Efficient Security Verification of CVA6 MMU',authors:'Rakesh Patil, Chinmayi P R, Chandana R, Prathyush A Kamti, Sudeendra Kumar and Ayaskanta Swain'},
{id:'29',title:'Where Do Faults Matter in Quantum ML? A Study of Fault Position, Fault Type, and Hidden Sensitivity',authors:'Jayanth Thangellamudi, Guru Venkataramani and Sai Manoj Pudukotai Dinakarrao'},
{id:'32',title:'When Filtered Power Still Tells the Truth: Side-Channel Leakage on Obfuscated RAPL Energy Interfaces of Intel Processors',authors:'Himanshu Pandey, Arnav Geet Verma, Debapriya Basu Roy and Urbi Chatterjee'}
];
const RATES=[
{id:'ieee',name:'IEEE Member',currency:'INR',early:50000,regular:60000,full:true,ieee:true},
{id:'nonieee',name:'Non-IEEE Member',currency:'INR',early:60000,regular:70000,full:true},
{id:'ieee-student',name:'IEEE Member – Student',currency:'INR',early:15000,regular:25000,student:true,ieee:true},
{id:'nonieee-student',name:'Non-IEEE Member – Student',currency:'INR',early:25000,regular:35000,student:true},
{id:'life',name:'IEEE Life Member',currency:'INR',early:25000,regular:35000,ieee:true},
{id:'indian-student',name:'General Participation – Indian Student',currency:'INR',fixed:2000,student:true,indian:true},
{id:'phd-intl',name:'PhD Forum – International',currency:'INR',fixed:15000,phd:true},
{id:'phd-indian',name:'PhD Forum – Indian',currency:'INR',fixed:5000,phd:true,indian:true}
];
const SAMPLE_RECORDS={
  'AH26-SAMPLE-0001':{id:'AH26-SAMPLE-0001',kind:'registration',purpose:'author',period:'early',category:'ieee',categoryName:'IEEE Member',amount:50000,currency:'INR',paperId:'5',coversPaper:true,person:{name:'Avery Example',email:'avery@example.org'},status:'paid',ieeeVerification:'awaiting_organizer_review',created:'2026-10-30T10:20:00Z',sample:true},
  'AH26-SAMPLE-0002':{id:'AH26-SAMPLE-0002',kind:'registration',purpose:'attendee',period:'regular',category:'nonieee',categoryName:'Non-IEEE Member',amount:70000,currency:'INR',person:{name:'Jordan Example',email:'jordan@example.org'},status:'failed',created:'2026-10-30T11:05:00Z',sample:true},
  'AH26-SAMPLE-0003':{id:'AH26-SAMPLE-0003',kind:'registration',purpose:'phd',period:'early',category:'phd-indian',categoryName:'PhD Forum – Indian',amount:5000,currency:'INR',person:{name:'Sam Example',email:'sam@example.org'},status:'pending',created:'2026-10-30T12:15:00Z',sample:true}
};
const $=id=>document.getElementById(id);
const state={purpose:'author',period:isEarlyRegistrationOpen()?'early':'regular',category:'ieee',paperId:'',cover:true,step:1,person:null};
let toastTimer;
function currency(rate, amount){return (rate.currency==='INR'?'₹':'$')+Number(amount).toLocaleString('en-IN',{maximumFractionDigits:2});}
function currentRate(){return RATES.find(x=>x.id===state.category)||RATES[0];}
function currentAmount(){let r=currentRate();return r.fixed??r[state.period];}
function showToast(message){const t=$('toast');t.textContent=message;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),3700);}
function escapeHTML(x){return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function records(){try{return {...SAMPLE_RECORDS,...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}}catch(e){return {...SAMPLE_RECORDS}}}
function saveRecord(record){let d=records();d[record.id]=record;try{localStorage.setItem(STORAGE_KEY,JSON.stringify(d));return true}catch(e){showToast('Browser storage is unavailable. Please try another browser.');return false;}}
function createId(prefix){let s;if(window.crypto?.getRandomValues){const a=new Uint32Array(2);crypto.getRandomValues(a);s=(a[0].toString(36)+a[1].toString(36)).toUpperCase().slice(0,10)}else{s=Math.random().toString(36).slice(2,12).toUpperCase()}return prefix+s}
function purposeLabel(){return state.purpose==='author'?'Paper author':state.purpose==='phd'?'PhD Forum':'General attendee'}
function allowedRates(){if(state.purpose==='phd')return RATES.filter(x=>x.phd);if(state.purpose==='author'&&state.cover)return RATES.filter(x=>x.full);return RATES.filter(x=>!x.phd);}
function synchronizeRegistrationPeriod(){
  const closed=!isEarlyRegistrationOpen();
  const changed=closed && state.period!=='regular';
  if(closed)state.period='regular';
  const early=$('early-btn'),regular=$('regular-btn');
  early.disabled=closed;
  early.setAttribute('aria-disabled',String(closed));
  early.title=closed?'Early registration closed on 15 November 2026 (IST).':'Early registration closes 15 November 2026 at 11:59 p.m. IST.';
  early.classList.toggle('active',!closed && state.period==='early');
  regular.classList.toggle('active',state.period==='regular');
  const note=$('registration-deadline-note');
  note.textContent=closed
    ?'Early registration closed on 15 November 2026. Only regular / on-site rates are available.'
    :'Early registration closes 15 November 2026 at 11:59 p.m. IST. Regular / on-site rates apply from 16 November.';
  note.classList.toggle('closed',closed);
  return changed;
}
function renderRates(){synchronizeRegistrationPeriod();let rates=allowedRates();if(!rates.some(r=>r.id===state.category))state.category=rates[0].id;$('fee-options').innerHTML=rates.map(r=>{const amount=r.fixed??r[state.period];return `<button class="fee-option ${state.category===r.id?'selected':''}" type="button" role="radio" aria-checked="${state.category===r.id}" data-category="${r.id}"><span class="fee-name"><strong>${escapeHTML(r.name)}</strong><small>${r.fixed!=null?'Fixed fee':state.period==='early'?'Early registration':'Regular / on-site'}</small></span><span class="price">${currency(r,amount)}</span></button>`}).join('');document.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{state.category=b.dataset.category;renderRates()});let fixed=rates.every(r=>r.fixed!=null);document.querySelector('.tier-row').classList.toggle('hidden',fixed);let r=currentRate();$('category-advisory').textContent=state.purpose==='author'&&state.cover?'Mandatory paper coverage: only IEEE Member and Non-IEEE Member full registrations qualify.':r.ieee?'IEEE membership number will be collected and manually verified by an organizer after payment.':state.purpose==='phd'?'PhD Forum references will be confirmed by the organizing committee.':'The final payment amount will match the selected category.';updateSummary();updateConditionalFields();}
function updateSummary(){const r=currentRate();$('fee-preview').textContent=currency(r,currentAmount());$('currency-preview').textContent=`${r.currency} · ${r.fixed!=null?'Fixed fee':state.period==='early'?'Early registration':'Regular / on-site'}`;$('category-preview').textContent=r.name;$('purpose-preview').textContent=purposeLabel()}
function updateConditionalFields(){const r=currentRate();$('ieee-input').classList.toggle('hidden',!r.ieee);$('student-input').classList.toggle('hidden',!r.student);$('international-input').classList.toggle('hidden',$('country').value==='India'||$('country').value==='');}
function updatePurpose(p){state.purpose=p;document.querySelectorAll('[data-purpose]').forEach(el=>{el.classList.toggle('selected',el.dataset.purpose===p);el.setAttribute('aria-pressed',String(el.dataset.purpose===p))});$('paper-fields').classList.toggle('hidden',p!=='author');$('phd-fields').classList.toggle('hidden',p!=='phd');state.cover=p==='author'?$('cover-paper').checked:false;renderRates()}
function showStep(n){state.step=n;[1,2,3].forEach(i=>$('step'+i+'-panel').classList.toggle('hidden',i!==n));document.querySelectorAll('[data-step-dot]').forEach(el=>{let i=Number(el.dataset.stepDot);el.classList.toggle('active',i===n);el.classList.toggle('done',i<n)});document.querySelector('#register-view .section-lead')?.scrollIntoView({behavior:'smooth',block:'start'});if(n===3)renderReview()}
function validateStep1(){if(state.purpose==='author'&&!state.paperId){showToast('Select the accepted paper to continue.');$('paper-select').focus();return false}if(state.purpose==='author'&&state.paperId===OTHER_PAPER_VALUE){if(!$('other-paper-id').value.trim()||!$('other-paper-title').value.trim()){showToast('Enter both the paper ID and title.');(!$('other-paper-id').value.trim() ? $('other-paper-id') : $('other-paper-title')).focus();return false}}if(state.purpose==='phd'&&!$('phd-ref').value.trim()){showToast('Enter the PhD Forum reference.');$('phd-ref').focus();return false}if(state.purpose==='author'&&state.cover&&!currentRate().full){showToast('Paper coverage requires a full registration category.');return false}return true}
function validateStep2(){const f=$('details-form');for(const el of f.querySelectorAll('[required]')){if(el.closest('.hidden'))continue;if(!el.checkValidity()){el.reportValidity();return false}}let r=currentRate();if(r.ieee){const e=$('ieee-number');if(!/^\d{4,15}$/.test(e.value.trim())){showToast('Enter a valid-format IEEE member number (4–15 digits). The committee will verify it later.');e.focus();return false}}if(r.student&&!$('student-attest').checked){showToast('Confirm current student enrolment.');$('student-attest').focus();return false}if(r.indian&&$('country').value!=='India'){showToast('This category is reserved for participants from India. Please select the appropriate category.');$('country').focus();return false}return true}
function collectPerson(){return{name:$('full-name').value.trim(),email:$('email').value.trim(),phone:$('phone').value.trim(),institution:$('institution').value.trim(),country:$('country').value,city:$('city').value.trim(),ieee:$('ieee-number').value.trim(),visa:$('visa-help').checked,billing:$('billing-name').value.trim(),gstin:$('gstin').value.trim()}}
function reviewRows(rows){return rows.map(([k,v])=>`<div class="review-row"><span>${escapeHTML(k)}</span><strong>${escapeHTML(v)}</strong></div>`).join('')}
function renderReview(){synchronizeRegistrationPeriod();const r=currentRate(),p=PAPER_LIST.find(x=>x.id===state.paperId);$('review-card').innerHTML=`<div class="review-group"><div class="review-title">REGISTRATION</div>${reviewRows([['Registration type',purposeLabel()],['Category',r.name],['Period',r.fixed?'Fixed rate':state.period==='early'?'Early':'Regular / On-site'],...(state.purpose==='author'?[['Paper',p?'#'+p.id+' — '+p.title:state.paperId===OTHER_PAPER_VALUE?'#'+$('other-paper-id').value.trim()+' — '+$('other-paper-title').value.trim():'—'],['Covers mandatory full registration',state.cover?'Yes':'No']]:[]),...(state.purpose==='phd'?[['PhD Forum reference',$('phd-ref').value.trim()]]:[])])}</div><div class="review-group"><div class="review-title">PARTICIPANT</div>${reviewRows([['Full name',state.person.name],['Email',state.person.email],['Institution',state.person.institution],['Country',state.person.country],...(r.ieee?[['IEEE member number',state.person.ieee+' (to be verified)']]:[])])}</div><div class="review-total"><div><span>Payable registration fee</span><small>Amount and currency to be passed to payment gateway</small></div><strong>${currency(r,currentAmount())}</strong></div>`}
function registerOrder(){if(synchronizeRegistrationPeriod())return null;const r=currentRate(),p=PAPER_LIST.find(x=>x.id===state.paperId);const rec={id:createId('AH26-'),kind:'registration',purpose:state.purpose,period:state.period,category:r.id,categoryName:r.name,amount:currentAmount(),currency:r.currency,feeFinal:false,paperId:state.purpose==='author'?(state.paperId===OTHER_PAPER_VALUE?$('other-paper-id').value.trim():state.paperId):null,paperTitle:state.purpose==='author'?(state.paperId===OTHER_PAPER_VALUE?$('other-paper-title').value.trim():p?.title||''):'',paperSource:state.purpose==='author'?(state.paperId===OTHER_PAPER_VALUE?'manual':'listed'):null,paperVerification:state.purpose==='author'&&state.paperId===OTHER_PAPER_VALUE?'pending_organizer_review':'not_required',coversPaper:state.purpose==='author'&&state.cover,phdReference:state.purpose==='phd'?$('phd-ref').value.trim():'',person:state.person,created:new Date().toISOString(),status:'pending',ieeeVerification:r.ieee?'awaiting_organizer_review':'not_required',balancePaid:false};return saveRecord(rec)?rec:null}
function navigate(view){['register','status','confirmation'].forEach(v=>$(v+'-view').classList.toggle('hidden',v!==view));document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));const preservedId=new URLSearchParams(location.search).get('id');history.replaceState(null,'',`index.html?view=${view}${(view==='status'||view==='confirmation')&&preservedId?'&id='+encodeURIComponent(preservedId):''}`);window.scrollTo({top:0,behavior:'smooth'});if(view==='status')autofillLookupFromQuery();if(view==='confirmation')renderConfirmationFromQuery()}
function autofillLookupFromQuery(){const p=new URLSearchParams(location.search);let id=p.get('id');if(id){$('lookup-id').value=id;let rec=records()[id];if(rec){$('lookup-email').value=rec.person.email;showStatus(rec)}}}
function statusPill(rec){if(rec.status==='paid'&&rec.paymentMethod==='complimentary_coupon')return '<span class="status-pill">Registration confirmed · Fee waived</span>';if(rec.status==='paid')return '<span class="status-pill">Payment successful</span>';if(rec.status==='failed')return '<span class="status-pill failed">Payment unsuccessful</span>';return '<span class="status-pill pending">Payment pending</span>'}
function statusText(rec){return rec.status==='paid'&&rec.paymentMethod==='complimentary_coupon'?'Your complimentary registration is confirmed; no bank payment is required.':rec.status==='paid'?'Your payment is recorded as successful.':rec.status==='failed'?'The transaction was unsuccessful. You may retry payment.':'The transaction is awaiting confirmation.'}
function showStatus(rec){
 const r=RATES.find(x=>x.id===rec.category)||{currency:'INR'};
 const total=rec.amount+(rec.balancePaid?10000:0);
 const paperLine=rec.paperId?`<div class="status-meta-row"><span>Paper ID</span><strong>#${escapeHTML(rec.paperId)}</strong></div>${rec.paperTitle?`<div class="status-meta-row"><span>Paper title</span><strong>${escapeHTML(rec.paperTitle)}</strong></div>`:''}${rec.paperSource==='manual'?'<p class="field-help">Manually entered paper details are subject to organizer verification.</p>':''}`:'';
 const ieeeLine=rec.ieeeVerification==='awaiting_organizer_review'?'<p class="field-help">IEEE membership eligibility is subject to verification by the organizing committee.</p>':'';
 let actions='';
 if(rec.status!=='paid'&&!rec.sample)actions+=`<button type="button" class="btn btn-primary btn-small" data-retry="${escapeHTML(rec.id)}">Return to payment →</button>`;
 if(rec.status==='paid'&&rec.category==='ieee'&&rec.paymentMethod!=='complimentary_coupon'&&!rec.balancePaid&&!rec.sample)actions+=`<button type="button" class="btn btn-outline btn-small" data-balance="${escapeHTML(rec.id)}">Preview supplementary ₹10,000 payment</button>`;
 $('status-result').innerHTML=`<div class="status-box"><div class="status-head"><h3>${escapeHTML(rec.id)}</h3>${statusPill(rec)}</div><p class="status-message">${statusText(rec)}</p><div class="status-meta-row"><span>Registrant</span><strong>${escapeHTML(rec.person.name)}</strong></div><div class="status-meta-row"><span>Registration category</span><strong>${escapeHTML(rec.categoryName)}</strong></div><div class="status-meta-row"><span>Amount due</span><strong>${currency(r,total)}</strong></div>${rec.couponCode?`<div class="status-meta-row"><span>Coupon</span><strong>${escapeHTML(rec.couponCode)} · Fee waived</strong></div>`:''}${paperLine}<div class="status-meta-row"><span>Registered email</span><strong>${escapeHTML(rec.person.email)}</strong></div>${ieeeLine}<p class="status-invoice">An invoice can be requested from the organizing committee and will be provided at a later date.</p>${rec.sample?'<p class="preview-disclosure">Example record for interface preview. No payment or email notification has occurred.</p>':''}<div class="status-actions">${actions}</div></div>`;
 document.querySelectorAll('[data-retry]').forEach(el=>el.onclick=()=>location.href='checkout.html?id='+encodeURIComponent(el.dataset.retry));
 document.querySelectorAll('[data-balance]').forEach(el=>el.onclick=()=>{
   const item=records()[el.dataset.balance];if(!item||item.status!=='paid'||item.category!=='ieee'||item.balancePaid)return;
   const id=createId('AH26-BAL-');const balance={id,kind:'balance',parentId:item.id,person:item.person,categoryName:'Other – Balance Payment (IEEE to Non-IEEE)',category:'balance',currency:'INR',amount:10000,status:'pending',created:new Date().toISOString(),purpose:'balance'};
   if(saveRecord(balance))location.href='checkout.html?id='+encodeURIComponent(id)
 });
}
function renderConfirmationFromQuery(){
 const id=new URLSearchParams(location.search).get('id');let rec=records()[id];const panel=$('confirmation-card');if(!panel)return;
 if(!rec){panel.innerHTML='<h2>Registration reference not found</h2><p>Return to the registration page or check your reference details.</p><a class="btn btn-primary" href="index.html">Return to registration</a>';return}
 const paid=rec.status==='paid',failed=rec.status==='failed';const c=rec.kind==='balance'?'Supplementary payment':'Conference registration';
 const waived=paid&&rec.paymentMethod==='complimentary_coupon';const title=waived?'Registration confirmed — fee waived':paid?'Payment successful':failed?'Payment unsuccessful':'Payment pending';
 const desc=waived?'Your complimentary registration has been recorded successfully. No bank payment is required.':paid?`Your ${c.toLowerCase()} payment has been recorded as successful for this preview.`:failed?'Your payment could not be completed in this preview. Please try again using the registration reference below.':'Your payment has not yet been confirmed.';
 const notice=waived?'A complimentary registration confirmation email will be sent to your registered address when connected to the live system.':paid?'A confirmation email will be sent to the registered email address when connected to the live system.':failed?'A payment-failure notification will be sent to the registered email address when connected to the live system.':'You can check the transaction status using your registration reference.';
 panel.innerHTML=`<div class="confirmation-icon ${paid?'paid':failed?'failed':'pending'}">${paid?'✓':failed?'!':'◷'}</div><div class="section-tag">PAYMENT UPDATE</div><h2>${title}</h2><p class="confirmation-description">${desc}</p><div class="confirmation-reference"><small>REGISTRATION / PAYMENT REFERENCE</small><strong>${escapeHTML(rec.id)}</strong></div><div class="confirmation-breakdown"><div><span>Participant</span><strong>${escapeHTML(rec.person.name)}</strong></div><div><span>Category</span><strong>${escapeHTML(rec.categoryName)}</strong></div><div><span>Amount due</span><strong>₹${Number(rec.amount).toLocaleString('en-IN')}</strong></div>${waived?`<div><span>Coupon applied</span><strong>${escapeHTML(rec.couponCode)} (100% waiver)</strong></div>`:''}<div><span>Registered email</span><strong>${escapeHTML(rec.person.email)}</strong></div></div><div class="confirmation-email"><span aria-hidden="true">✉</span><p>${notice}</p></div><p class="confirmation-invoice">Invoice: Available upon request at a later date.</p><div class="confirmation-actions"><button class="btn btn-primary" id="confirmation-lookup" type="button">Check registration status →</button><a class="btn btn-outline" href="index.html">Back to registration</a>${!paid&&!rec.sample?`<a class="btn btn-outline" href="checkout.html?id=${encodeURIComponent(rec.id)}">Retry payment</a>`:''}</div><div class="preview-disclosure">Preview environment — transaction outcome is simulated in this browser. No actual payment or email has been sent.</div>`;
 $('confirmation-lookup').onclick=()=>navigate('status');
}
function init(){PAPER_LIST.forEach(p=>{const opt=document.createElement('option');opt.value=p.id;opt.textContent=`#${p.id} — ${p.title}`;$('paper-select').appendChild(opt)});const otherOpt=document.createElement('option');otherOpt.value=OTHER_PAPER_VALUE;otherOpt.textContent='Other — my accepted paper is not listed';$('paper-select').appendChild(otherOpt);
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.view)));
document.querySelectorAll('[data-purpose]').forEach(b=>b.onclick=()=>updatePurpose(b.dataset.purpose));
$('cover-paper').onchange=e=>{state.cover=e.target.checked;renderRates()};
$('paper-select').onchange=e=>{state.paperId=e.target.value;let p=PAPER_LIST.find(x=>x.id===state.paperId);$('paper-detail').classList.toggle('hidden',!p);$('other-paper-fields').classList.toggle('hidden',state.paperId!==OTHER_PAPER_VALUE);$('paper-detail').innerHTML=p?`<strong>Paper #${p.id} · ${escapeHTML(p.title)}</strong><p>Authors: ${escapeHTML(p.authors)}</p>`:''};
$('early-btn').onclick=()=>{if(!isEarlyRegistrationOpen()){renderRates();showToast('Early registration closed on 15 November 2026.');return;}state.period='early';renderRates()};
$('regular-btn').onclick=()=>{state.period='regular';renderRates()};
// Re-check on return to a tab left open across the 15 November deadline.
window.addEventListener('focus',()=>{if(synchronizeRegistrationPeriod()){renderRates();if(state.step===3&&state.person)renderReview();}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden && synchronizeRegistrationPeriod()){renderRates();if(state.step===3&&state.person)renderReview();}});
$('country').onchange=updateConditionalFields;
$('continue-1').onclick=()=>{if(validateStep1())showStep(2)};
$('back-2').onclick=()=>showStep(1);
$('details-form').onsubmit=e=>{e.preventDefault();if(!validateStep2())return;state.person=collectPerson();showStep(3)};
$('back-3').onclick=()=>showStep(2);
$('proceed-checkout').onclick=()=>{
  if(synchronizeRegistrationPeriod()){
    renderRates();renderReview();
    showToast('Early registration has closed. Please review the updated regular/on-site fee before proceeding.');
    $('terms').checked=false;
    return;
  }
  if(!$('terms').checked){showToast('Please confirm your registration details.');return}
  const rec=registerOrder();
  if(rec)location.href='checkout.html?id='+encodeURIComponent(rec.id);
  else {renderRates();renderReview();showToast('Registration rates have changed. Please review the amount again.');}
};
$('fill-sample').onclick=()=>{let d={'full-name':'Alex Example','email':'alex@example.org','phone':'+91 90000 00000','institution':'Example University','country':'India','city':'Kolkata','ieee-number':'12345678','billing-name':'Example University'};for(const[k,v]of Object.entries(d)){const el=$(k);if(el)el.value=v}$('student-attest').checked=true;updateConditionalFields();showToast('Sample details added for preview.')};
$('status-form').onsubmit=e=>{e.preventDefault();let id=$('lookup-id').value.trim();let email=$('lookup-email').value.trim().toLowerCase();let rec=records()[id];if(!rec||rec.person.email.toLowerCase()!==email){$('status-result').innerHTML='<div class="notice-inline">No matching registration was found. Please check the reference ID and registered email address.</div>';return}showStatus(rec)};
$('sample-records').innerHTML=Object.values(SAMPLE_RECORDS).map(x=>`<button class="sample-record" type="button" data-sample-id="${x.id}"><strong>${escapeHTML(x.id)}</strong><small>${escapeHTML(x.person.email)}</small><span class="status-pill ${x.status==='paid'?'':x.status}">${x.status==='paid'?'Successful':x.status==='failed'?'Failed':'Pending'}</span></button>`).join('');
 document.querySelectorAll('[data-sample-id]').forEach(button=>button.onclick=()=>{const rec=SAMPLE_RECORDS[button.dataset.sampleId];$('lookup-id').value=rec.id;$('lookup-email').value=rec.person.email;showStatus(rec)});
updatePurpose('author');showStep(1);const p=new URLSearchParams(location.search);const view=p.get('view');if(['status','confirmation'].includes(view)){navigate(view);if(view==='status')autofillLookupFromQuery();if(view==='confirmation')renderConfirmationFromQuery()} }
document.addEventListener('DOMContentLoaded',init);
