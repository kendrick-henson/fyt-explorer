/* BRYC Find Your Thing — shared, public-only discovery helpers. No Fellow data. */
(function(){
'use strict';
const aliases=[
 ['nurse','nurses','nursing','rn','registered nurse'],
 ['doctor','doctors','physician','physicians','medicine','medical','healthcare','health care'],
 ['coding','code','programming','programmer','software developer','software engineering'],
 ['robot','robots','robotics','engineering','engineer','engineers'],
 ['lawyer','lawyers','attorney','attorneys','law','legal'],
 ['photography','photographer','photos','photo'],
 ['journalism','journalist','reporting','reporter','news writing'],
 ['music','musician','musicians','band','orchestra','instrumental music'],
 ['acting','actor','actors','theater','theatre','drama'],
 ['animal','animals','wildlife','zoology','zoo'],
 ['volunteer','volunteers','volunteering','community service'],
 ['college','university','college readiness','college prep'],
 ['entrepreneur','entrepreneurship','starting a business','startup','startups'],
 ['government','civic engagement','public policy','politics']
];
const normalize=s=>String(s||'').toLowerCase().normalize('NFKD')
 .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
const list=x=>Array.isArray(x)?x:[];
const phrase=(hay,needle)=>(' '+hay+' ').includes(' '+needle+' ');
const fieldText=o=>normalize([o.name,o.organization,o.type,o.description,o.fellowUpdate,
  o.commitment,o.location,...list(o.careerCommunities),...list(o.interestTags)].join(' '));
const tagText=o=>normalize([...list(o.careerCommunities),...list(o.interestTags),o.name].join(' '));
const editDistance=(a,b,limit)=>{
 if(Math.abs(a.length-b.length)>limit)return limit+1;
 let prev=Array.from({length:b.length+1},(_,i)=>i);
 for(let i=1;i<=a.length;i++){
  const next=[i];let minimum=i;
  for(let j=1;j<=b.length;j++){
   next[j]=Math.min(prev[j]+1,next[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
   minimum=Math.min(minimum,next[j]);
  }
  if(minimum>limit)return limit+1;
  prev=next;
 }
 return prev[b.length];
};
const fuzzy=(word,term)=>{
 if(word.length<3||term.length<3)return false;
 if(term.startsWith(word)&&word.length>=3)return true;
 const limit=word.length>=7?2:word.length>=4?1:0;
 return limit>0&&editDistance(word,term,limit)<=limit;
};
function match(o,query){
 const raw=normalize(query);if(!raw)return {match:true,score:0};
 const hay=fieldText(o),tags=tagText(o),words=raw.split(' ');
 const full=aliases.find(group=>group.some(x=>normalize(x)===raw));
 if(full){
  const exact=phrase(hay,raw),related=full.some(x=>phrase(hay,normalize(x)));
  if(exact||related)return {match:true,score:exact?30:10};
 }
 let score=phrase(hay,raw)?20:0;
 const tokens=tags.split(' ').filter(x=>x.length>2);
 const allTokens=hay.split(' ').filter(x=>x.length>2);
 for(const word of words){
  if(phrase(hay,word)){score+=phrase(tags,word)?8:4;continue;}
  const family=aliases.find(group=>group.some(x=>normalize(x)===word));
  if(family&&family.some(x=>phrase(hay,normalize(x)))){score+=3;continue;}
  if(tokens.some(token=>fuzzy(word,token))){score+=2;continue;}
  if(allTokens.some(token=>fuzzy(word,token))){score+=1;continue;}
  return {match:false,score:0};
 }
 return {match:true,score};
}
function parseDate(raw){
 const m=String(raw||'').trim().match(/^(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2}),?\s+(\d{4})$/i);
 if(!m)return null;
 const month=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(m[1].toLowerCase().slice(0,3));
 const d=new Date(Number(m[3]),month,Number(m[2]));
 return d.getFullYear()===Number(m[3])&&d.getMonth()===month&&d.getDate()===Number(m[2])?d:null;
}
const today=()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate())};
function expired(o){
 const due=parseDate(o.applicationDeadline);
 return String(o.applicationStatus||'')==='Closed'||!!due&&due<today();
}
function openingDate(o){
 const u=String(o.fellowUpdate||'');
 const m=u.match(/\b(?:open(?:s|ing)?|launch(?:es)?|begin(?:s)?)\s+(?:in\s+|on\s+)?(early\s+|mid[- ]|late\s+)?(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(?:(\d{1,2}),?\s+)?(20\d{2})/i);
 if(!m)return null;
 const month=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(m[2].toLowerCase().slice(0,3));
 const day=m[3]?Number(m[3]):m[1]?/mid/i.test(m[1])?15:/late/i.test(m[1])?25:5:15;
 const d=new Date(Number(m[4]),month,day);return isNaN(d.getTime())?null:d;
}
function order(o){
 const due=parseDate(o.applicationDeadline),status=String(o.applicationStatus||'');
 if(status==='Opening Later'){const opening=openingDate(o);return [1,opening?opening.getTime():Infinity,due?due.getTime():Infinity];}
 if(due&&due>=today())return [0,due.getTime(),0];
 if(status==='Open Now')return [0,Infinity,1];
 if(status==='Year-Round'||status==='Ongoing / Check Availability')return [2,0,0];
 if(status==='Previously Offered'||o.programCycle==='Previously Offered — Next Cycle Unconfirmed')return [4,0,0];
 return [3,0,0];
}
function sort(a,b){
 const x=order(a),y=order(b);
 return x[0]-y[0]||x[1]-y[1]||x[2]-y[2]||String(a.name).localeCompare(String(b.name));
}
function vocabulary(opps){
 const terms=new Map();
 const add=(s,type)=>{s=String(s||'').trim();const n=normalize(s);
  if(n.length<3||n.length>65||terms.has(n))return;
  terms.set(n,{label:s,type,n});
 };
 for(const o of opps||[]){
  list(o.careerCommunities).forEach(s=>add(s,'Career Community'));
  list(o.interestTags).forEach(s=>add(s,'Interest'));
  add(o.name,'Program');
 }
 for(const group of aliases)for(const a of group)add(a,'Related search');
 return [...terms.values()];
}
function suggestions(opps,query){
 const q=normalize(query);if(q.length<2)return [];
 return vocabulary(opps).map(t=>{
  let weight=0;
  if(t.n===q)weight=100;
  else if(t.n.startsWith(q))weight=80;
  else if(t.n.split(' ').some(x=>x.startsWith(q)))weight=65;
  else if(t.n.includes(q))weight=40;
  else if(t.n.split(' ').some(x=>fuzzy(q,x)))weight=25;
  return {...t,weight};
 }).filter(x=>x.weight>0)
  .sort((a,b)=>b.weight-a.weight||a.label.length-b.label.length||a.label.localeCompare(b.label))
  .slice(0,6);
}
function autocomplete(input,getOpportunities,onSelect){
 if(!input)return;
 const container=input.closest('form')&&input.closest('form').classList.contains('hero-search')
  ?input.closest('form'):input.parentElement;
 container.classList.add('fyt-search-anchor');
 const dropdown=document.createElement('div');dropdown.className='fyt-suggestions';
 dropdown.id=input.id+'-suggestions';dropdown.setAttribute('role','listbox');
 dropdown.hidden=true;container.append(dropdown);
 input.setAttribute('role','combobox');input.setAttribute('aria-autocomplete','list');
 input.setAttribute('aria-expanded','false');input.setAttribute('aria-controls',dropdown.id);
 let current=-1,options=[];
 const close=()=>{dropdown.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');current=-1;};
 const choose=index=>{const choice=options[index];if(!choice)return;
  input.value=choice.label;close();onSelect(choice.label);
 };
 const updateActive=()=>{
  const nodes=[...dropdown.children];
  nodes.forEach((node,i)=>node.classList.toggle('is-active',i===current));
  if(current>=0){input.setAttribute('aria-activedescendant',nodes[current].id);nodes[current].scrollIntoView({block:'nearest'});}
  else input.removeAttribute('aria-activedescendant');
 };
 const paint=()=>{
  options=suggestions(getOpportunities().filter(o=>!expired(o)),input.value);
  dropdown.replaceChildren();current=-1;
  for(let i=0;i<options.length;i++){
   const item=options[i],button=document.createElement('button');button.type='button';
   button.id=dropdown.id+'-'+i;button.className='fyt-suggestion';
   button.setAttribute('role','option');button.setAttribute('aria-selected','false');
   const label=document.createElement('span');label.textContent=item.label;
   const type=document.createElement('small');type.textContent=item.type;
   button.append(label,type);
   button.addEventListener('pointerdown',event=>event.preventDefault());
   button.addEventListener('click',()=>choose(i));dropdown.append(button);
  }
  dropdown.hidden=options.length===0;input.setAttribute('aria-expanded',String(options.length>0));
 };
 input.addEventListener('input',paint);
 input.addEventListener('focus',()=>{if(input.value.trim().length>=2)paint()});
 input.addEventListener('keydown',event=>{
  if(event.key==='Escape'){close();return}
  if(dropdown.hidden||!options.length)return;
  if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();
   current=(current+(event.key==='ArrowDown'?1:-1)+options.length)%options.length;updateActive();}
  if(event.key==='Enter'&&current>=0){event.preventDefault();choose(current)}
 });
 input.addEventListener('blur',()=>setTimeout(close,120));
 return {refresh:()=>{if(document.activeElement===input)paint()},close};
}
window.FYTSearch=Object.freeze({normalize,match,parseDate,expired,openingDate,sort,suggestions,autocomplete});
})();
