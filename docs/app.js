import { sections, questions, cleanAnswers } from './questions.js';
import { config } from './config.js';
import { fiQuestions, fiSections, fiInfo } from './fi.js';
import { svInfo } from './sv-info.js';
import { strings } from './ui.js';

const main = document.querySelector('#main');
const steps = document.querySelector('#steps');
const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let lang = new URLSearchParams(location.search).get('lang') === 'fi' ? 'fi' : 'sv';
let answers = {}, page = -1, consentAccepted = false, busy = false, declined = false;
let contact = {name:'', email:'', consent:false}, contactSaved = false;
const responseId = crypto.randomUUID();
const contactId = crypto.randomUUID();
const t = key => strings[lang][key];
const localQuestion = q => lang === 'fi' ? {...q, ...fiQuestions[q.id]} : q;
const localSection = i => lang === 'fi' ? {title:fiSections[i][0], subtitle:fiSections[i][1]} : sections[i];

const languageControl = document.createElement('div');
languageControl.className = 'language-control';
languageControl.setAttribute('role','group');
languageControl.setAttribute('aria-label','Språk / Kieli');
languageControl.innerHTML = '<button type="button" lang="sv" data-lang="sv">Svenska</button><button type="button" lang="fi" data-lang="fi">Suomi</button>';
document.querySelector('header').append(languageControl);
languageControl.querySelectorAll('button').forEach(b => b.onclick = () => {
  if (busy || b.dataset.lang === lang) return;
  lang = b.dataset.lang;
  const url = new URL(location.href); url.searchParams.set('lang', lang);
  history.replaceState(null, '', url);
  render();
});

function chrome() {
  document.documentElement.lang = lang;
  document.title = t('title');
  document.querySelector('meta[name=description]').content = t('description');
  document.querySelector('.brand').innerHTML = `<span class="brand-mark" aria-hidden="true">b.</span> ${t('brand')}`;
  document.querySelector('.header-note').textContent = t('header');
  document.querySelector('.eyebrow').textContent = t('eyebrow');
  document.querySelector('h1').innerHTML = t('hero');
  document.querySelector('.aside-intro').textContent = t('intro');
  document.querySelector('.aside-note').innerHTML = t('voluntary');
  document.querySelector('footer').innerHTML = `${t('brand')} <span>${t('footer')}</span>`;
  steps.setAttribute('aria-label',t('navLabel'));
  languageControl.querySelectorAll('button').forEach(b => {b.setAttribute('aria-pressed',String(b.dataset.lang === lang)); b.disabled = busy;});
  if (!config.url || !config.key) {
    let notice = document.querySelector('.preview-notice');
    if (!notice) {notice=document.createElement('div');notice.className='preview-notice';document.querySelector('header').after(notice);}
    notice.textContent = t('preview');
  }
}
function navigation() {
  document.querySelector('.mobile-navigation')?.remove();
  if (page === 99) {steps.innerHTML='';return;}
  steps.innerHTML = [t('information'), ...sections.map((_,i)=>localSection(i).title), t('reviewNav')].map((title,i) =>
    `<button type="button" class="step ${page===i-1?'active':''}" data-page="${i-1}" ${busy || (i>0 && !consentAccepted)?'disabled':''} ${page===i-1?'aria-current="step"':''}><span class="step-num">${i===0?'i':i}</span>${escape(title)}</button>`).join('');
  steps.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>go(Number(b.dataset.page)));
  const mobile = document.createElement('label');
  mobile.className = 'mobile-navigation';
  mobile.textContent = t('navLabel');
  const select = document.createElement('select');
  select.id = 'section-select';
  select.disabled = busy;
  [t('information'), ...sections.map((_,i)=>localSection(i).title), t('reviewNav')].forEach((title,i)=>{
    const option = new Option(title, String(i-1), false, page===i-1);
    option.disabled = i>0 && !consentAccepted;
    select.add(option);
  });
  select.onchange = () => go(Number(select.value));
  mobile.append(select);
  steps.after(mobile);
}
function go(p) {
  if (busy || (p >= 0 && !consentAccepted)) return;
  page=p; declined=false;
  render();window.scrollTo({top:0});main.focus();
}
function render() {
  chrome();navigation();
  if (page===99) {showSuccess();return;}
  if (declined) {showDeclined();return;}
  if (page===-1) {showIntro();return;}
  if (page===sections.length) {review();return;}
  const section=localSection(page);
  main.innerHTML=`<div class="progress-meta"><span>${t('part')} ${page+1} ${t('of')} ${sections.length}</span><span>${Math.round(page/sections.length*100)} ${t('progressSuffix')}</span></div>
    <progress value="${page}" max="${sections.length}" aria-label="${t('progress')}"></progress>
    <div class="section-heading"><p class="step-kicker">${escape(section.subtitle)}</p><h2>${escape(section.title)}</h2><p>${t('optional')}</p></div>
    <form class="panel" id="survey">${sections[page].questions.map(questionHTML).join('')}
      <div class="actions"><button class="secondary" type="button" id="back">${t('back')}</button><button class="primary">${t(page===sections.length-1?'reviewButton':'next')}</button></div>
      <p class="privacy-note">${t('memory')}</p></form>`;
  const form=document.querySelector('#survey');
  form.addEventListener('change',record);
  form.addEventListener('input',e=>{if(e.target.matches('textarea,input[type=text]'))record(e);});
  form.onsubmit=e=>{e.preventDefault();go(page+1);};
  document.querySelector('#back').onclick=()=>go(page-1);
  updateConditional();
}
function showIntro() {
  main.innerHTML=`<section class="panel"><p class="step-kicker">${t('welcome')}</p><h2>${t('studyInfo')}</h2>
    ${lang==='fi'?fiInfo:svInfo}<p class="hint">${t('translationNote')}</p><p class="intro-note">${t('introNote')}</p>
    <form id="consent"><fieldset class="question"><legend><span class="q-num">${t('question')} 1</span>${t('consent')}</legend><div class="choices compact">
    ${['Ja','Nej'].map((v,i)=>`<label class="choice"><input required type="radio" name="consent" value="${v}" ${answers.Q24===v?'checked':''}>${t(i===0?'yes':'no')}</label>`).join('')}</div></fieldset>
    <div class="actions"><span class="hint">${t('pace')}</span><button class="primary">${t('continue')}</button></div></form></section>`;
  document.querySelectorAll('[name=consent]').forEach(el=>el.onchange=()=>{if(el.value==='Nej'){answers={};consentAccepted=false;navigation();}answers.Q24=el.value;});
  document.querySelector('#consent').onsubmit=e=>{
    e.preventDefault();
    if(new FormData(e.target).get('consent')==='Ja'){answers.Q24='Ja';consentAccepted=true;go(0);}
    else {answers={};consentAccepted=false;page=-1;declined=true;render();}
  };
}
function showDeclined() {
  main.innerHTML=`<section class="panel"><h2>${t('declinedTitle')}</h2><p>${t('declined')}</p><button class="secondary" id="restart">${t('backInfo')}</button></section>`;
  document.querySelector('#restart').onclick=()=>go(-1);
}
function questionHTML(q) {
  const value=answers[q.id], translated=localQuestion(q);
  const label=`<span class="q-num">${q.number?t('question')+' '+q.number:t('extra')}</span>${escape(translated.title)}`;
  let body='';
  if(q.type==='text') body=`<textarea aria-label="${escape(translated.title)}" name="${q.id}" maxlength="5000" rows="3">${escape(value)}</textarea>`;
  else if(q.type==='matrix') body=`<p class="hint">${t('matrixHint')}</p>${q.rows.map((_,r)=>
    `<fieldset class="matrix-row"><legend>${escape(translated.rows[r])}</legend><div class="matrix-options" style="--cols:${q.options.length}">
    ${q.options.map((v,i)=>`<label class="choice"><input type="radio" name="${q.id}:${r}" value="${escape(v)}" ${value?.[r]===v?'checked':''}><span>${escape(translated.options[i])}</span></label>`).join('')}</div></fieldset>`).join('')}`;
  else body=`${q.type==='multi'?`<p class="hint">${t('multiHint')}</p>`:''}<div class="choices ${translated.options.every(o=>o.length<40)?'compact':''}">
    ${q.options.map((v,i)=>`<label class="choice"><input type="${q.type==='multi'?'checkbox':'radio'}" name="${q.id}" value="${escape(v)}" ${(q.type==='multi'?value?.includes(v):value===v)?'checked':''}><span>${escape(translated.options[i])}</span></label>`).join('')}</div>
    ${q.other?`<label class="other-label" id="${q.id}_other_wrap">${t('other')}<input type="text" name="${q.id}_other" maxlength="5000" value="${escape(answers[q.id+'_other'])}"></label>`:''}`;
  return `<fieldset class="question" data-question="${q.id}"><legend>${label}</legend>${body}</fieldset>`;
}
function record(e) {
  const el=e.target, [id,row]=el.name.split(':'); if(!id)return;
  const q=questions.find(q=>q.id===id);
  if(el.type==='checkbox') {
    let values=[...document.querySelectorAll(`input[name="${id}"]:checked`)].map(x=>x.value);
    if(q?.exclusive&&el.checked) {
      values=el.value===q.exclusive?[q.exclusive]:values.filter(x=>x!==q.exclusive);
      document.querySelectorAll(`input[name="${id}"]`).forEach(x=>x.checked=values.includes(x.value));
    }
    answers[id]=values;
  } else if(row!==undefined) {answers[id]??={};answers[id][row]=el.value;}
  else answers[id]=el.value;
  updateConditional();
}
function updateConditional() {
  for(const q of questions) {
    const box=document.querySelector(`[data-question="${q.id}"]`); if(!box)continue;
    if(q.when) {
      const visible=answers[q.when[0]]===q.when[1];box.hidden=!visible;box.disabled=!visible;
      if(!visible)delete answers[q.id];
    }
    if(q.other) {
      const show=answers[q.id]?.includes('Annat'), wrap=document.querySelector('#'+q.id+'_other_wrap');
      wrap.hidden=!show;wrap.querySelector('input').disabled=!show;
      if(!show)delete answers[q.id+'_other'];
    }
  }
}
function review() {
  const cleaned=cleanAnswers(answers);
  main.innerHTML=`<section class="panel"><p class="step-kicker">${t('last')}</p><h2>${t('reviewTitle')}</h2><p>${t('reviewHint')}</p>
    ${sections.map((s,i)=>`<details class="review-section"><summary>${escape(localSection(i).title)}</summary><dl>
      ${s.questions.filter(q=>!q.when||answers[q.when[0]]===q.when[1]).map(q=>`<dt>${q.number?q.number+'. ':''}${escape(localQuestion(q).title)}</dt><dd>${answerText(q,cleaned[q.id])}</dd>`).join('')}</dl>
      <button type="button" class="text-button" data-edit="${i}">${t('edit')}</button></details>`).join('')}
    <p class="privacy-note">${t('privacy')}</p><div role="alert" id="error" class="error"></div>
    <div class="actions"><button class="secondary" id="back">${t('back')}</button><button class="primary" id="send">${t('send')}</button></div></section>`;
  document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>go(Number(b.dataset.edit)));
  document.querySelector('#back').onclick=()=>go(sections.length-1);
  document.querySelector('#send').onclick=submit;
}
function answerText(q,v) {
  if(v===undefined)return t('unanswered');
  const translated=localQuestion(q), option=value=>translated.options[q.options.indexOf(value)]??t('unanswered');
  if(q.type==='matrix')return q.rows.map((_,i)=>escape(translated.rows[i])+': '+escape(option(v[i]))).join('<br>');
  if(q.type==='text')return escape(v);
  return escape(Array.isArray(v)?v.map(option).join('; ')+(answers[q.id+'_other']?' — '+answers[q.id+'_other']:''):option(v));
}
async function send(table,payload) {
  if(!config.url||!config.key)throw new Error(t('notOpen'));
  let res;
  try {
    res=await fetch(`${config.url}/rest/v1/${table}`,{method:'POST',headers:{'Content-Type':'application/json',apikey:config.key,Prefer:'return=minimal'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});
  } catch(e) {throw new Error(t(e.name==='TimeoutError'?'timeout':'sendError'));}
  if(res.status===409){const body=await res.json().catch(()=>({}));if(body.code==='23505')return;}
  if(!res.ok)throw new Error(t('sendError'));
}
function lock(value) {
  busy=value;languageControl.querySelectorAll('button').forEach(b=>b.disabled=value);
  steps.querySelectorAll('button').forEach(b=>b.disabled=value || (Number(b.dataset.page)>=0 && !consentAccepted));
  main.querySelectorAll('button').forEach(b=>b.disabled=value);
  const select = document.querySelector('#section-select');
  if (select) select.disabled = value;
}
async function submit() {
  if(busy)return;lock(true);
  const button=document.querySelector('#send');button.textContent=t('sending');document.querySelector('#error').textContent='';
  try {
    await send(config.responseTable,{id:responseId,survey_version:'1.0',answers:cleanAnswers(answers)});
    answers={};consentAccepted=false;page=99;lock(false);render();window.scrollTo({top:0});main.focus();
  } catch(e) {
    document.querySelector('#error').textContent=e.message;button.textContent=t('retry');lock(false);
  }
}
function showSuccess() {
  main.innerHTML=`<section class="panel"><div class="success-mark" aria-hidden="true">✓</div><p class="step-kicker">${t('sent')}</p><h2>${t('thanks')}</h2><p>${t('saved')}</p>
    <hr class="divider"><h2>${t('interview')}</h2><p>${t('interviewIntro')}</p><p class="hint">${t('interviewPrivacy')}</p>
    ${contactSaved?`<p role="status"><strong>${t('contactSaved')}</strong></p>`:`<form class="contact" id="contact">
      <label>${t('name')}<input type="text" name="name" required maxlength="200" autocomplete="name" value="${escape(contact.name)}"></label>
      <label>${t('email')}<input type="email" name="email" required maxlength="254" autocomplete="email" value="${escape(contact.email)}"></label>
      <label class="choice"><input type="checkbox" name="consent" required ${contact.consent?'checked':''}><span>${t('contactConsent')}</span></label>
      <div class="error" id="contact-error" role="alert"></div><button class="primary" type="submit">${t('contactSend')}</button></form>`}
    <p class="privacy-note">${t('close')}</p></section>`;
  const form=document.querySelector('#contact');if(!form)return;
  form.oninput=e=>{contact[e.target.name]=e.target.type==='checkbox'?e.target.checked:e.target.value;e.target.setCustomValidity('');};
  form.onsubmit=async e=>{
    e.preventDefault();if(busy)return;
    if(!contact.name.trim()){form.elements.name.setCustomValidity(t('nameError'));form.elements.name.reportValidity();return;}
    lock(true);const button=form.querySelector('button');button.textContent=t('sending');
    try {
      await send(config.contactTable,{id:contactId,name:contact.name.trim(),email:contact.email.trim(),consent:true});
      contact={name:'',email:'',consent:false};contactSaved=true;lock(false);render();
    } catch(err){document.querySelector('#contact-error').textContent=err.message;button.textContent=t('contactSend');lock(false);}
  };
}
window.addEventListener('beforeunload',e=>{if(Object.keys(answers).length>1){e.preventDefault();e.returnValue='';}});
render();
