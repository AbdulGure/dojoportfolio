const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
class Element{
 constructor(id=''){this.id=id;this.events={};this.attrs={};this.dataset={};this.style={};this.value='';this.hidden=false;this.disabled=false;this.open=false;this.isConnected=true;this.textContent='';this.children=[];const cls=new Set();this.classList={add:s=>cls.add(s),remove:s=>cls.delete(s),contains:s=>cls.has(s),toggle:(s,on)=>on?cls.add(s):cls.delete(s)};}
 addEventListener(k,fn){(this.events[k]??=[]).push(fn)}
 dispatch(k,extra={}){for(const f of this.events[k]||[])f({preventDefault(){},target:this,...extra})}
 focus(){doc.activeElement=this}setAttribute(k,v){this.attrs[k]=v}replaceChildren(...c){this.children=c}querySelector(){return this.submit??=new Element()}
 showModal(){this.open=true}close(){this.open=false;this.dispatch('close')}
}
const html=fs.readFileSync('index.html','utf8'),els={};for(const [,id]of html.matchAll(/id="([^"]+)"/g))els[id]=new Element(id);
const dialogIds=['lessonDialog','optionsDialog','pauseDialog','portfolioDialog'];const dialogs=dialogIds.map(id=>els[id]);
const closes=[...html.matchAll(/data-close="([^"]+)"/g)].map(m=>{const b=new Element();b.dataset.close=m[1];return b});
const doc=new Element();doc.body=new Element();doc.hidden=false;doc.activeElement=new Element();doc.getElementById=id=>{assert(els[id],'Unknown ID '+id);return els[id]};doc.createElement=()=>new Element();doc.querySelector=s=>s==='dialog[open]'?dialogs.find(d=>d.open)||null:null;doc.querySelectorAll=s=>s==='dialog'?dialogs:s==='dialog[open]'?dialogs.filter(d=>d.open):s==='[data-close]'?closes:[];
let now=0,raf=[],timers=new Map(),nextTimer=0,worldPaused=false;const strikes=[];const mq={matches:false,addEventListener(){}};
const world={setMotion(){},setPaused(v){worldPaused=v},setLook(){},setScene(){},inspect(){return 'A modeled dojo.'},strike(v){strikes.push(v);return 1400}};
const ctx={document:doc,DojoRules:require('./rules.js'),DojoWorld:world,matchMedia:()=>mq,performance:{now:()=>now},requestAnimationFrame:f=>raf.push(f),setTimeout:(f,t)=>{timers.set(++nextTimer,{at:now+t,f});return nextTimer},clearTimeout:id=>timers.delete(id)};
els.paceSelect.value='20';vm.runInNewContext(fs.readFileSync('app.js','utf8'),ctx);
function click(id){els[id].dispatch('click')}function submit(id){els[id].dispatch('submit')}function tick(ms=16){now+=ms;for(const [id,t] of timers){if(t.at<=now){timers.delete(id);t.f()}}const pending=raf;raf=[];pending.forEach(f=>f(now))}function full(id){return els[id].children.filter(c=>c.className==='full').length}
function train(){click('beginBtn');for(let i=0;i<3;i++){click('storyAction');assert(els.lessonDialog.open);els.lessonInput.value=ctx.DojoRules.lessons[i].example;submit('lessonForm');assert(els.lessonInput.disabled);submit('lessonForm')}assert.equal(doc.body.dataset.mode,'ready');}
train();click('storyAction');assert.equal(doc.body.dataset.mode,'duel');assert.equal(full('playerHealth'),3);
// Pause freezes the deadline, including when the page is hidden.
tick(5000);click('pauseBtn');assert(els.pauseDialog.open&&worldPaused);tick(60000);assert.equal(full('playerHealth'),3);click('resumeBtn');assert(!worldPaused);tick(1000);assert.equal(full('playerHealth'),3);
for(let i=0;i<3;i++){els.qteInput.value=ctx.DojoRules.lessons[i].example;submit('qteForm');submit('qteForm');assert.equal(full('senseiHealth'),2-i);tick(2600)}assert.equal(doc.body.dataset.mode,'ending');assert.equal(els.endingPrimary.dataset.win,'true');assert.deepEqual(strikes,[true,true,true]);
// Loss through incorrect code and timeout, and replay without losing mastery.
click('retryBtn');for(let i=0;i<3;i++){click('storyAction');els.lessonInput.value=ctx.DojoRules.lessons[i].example;submit('lessonForm');submit('lessonForm')}click('storyAction');els.qteInput.value='wrong';submit('qteForm');assert.equal(full('playerHealth'),2);tick(2600);tick(21000);assert.equal(full('playerHealth'),1);tick(2600);tick(21000);tick(2600);assert.equal(doc.body.dataset.mode,'ending');assert.equal(els.endingPrimary.dataset.win,'false');
// Untimed mode, portfolio pause, visibility pause, and a late-submission race.
els.paceSelect.value='0';click('endingPrimary');tick(200000);assert.equal(full('playerHealth'),3);assert.equal(els.timerLabel.textContent,'UNTIMED');click('portfolioBtn');assert(worldPaused);tick(100000);els.portfolioDialog.close();assert(!worldPaused);
doc.hidden=true;doc.dispatch('visibilitychange');assert(els.pauseDialog.open);tick(100000);doc.hidden=false;doc.dispatch('visibilitychange');click('resumeBtn');assert.equal(full('playerHealth'),3);
click('pauseBtn');click('leaveDuelBtn');els.paceSelect.value='20';click('storyAction');now+=21000;els.qteInput.value='print("Ready")';submit('qteForm');assert.equal(full('playerHealth'),2);assert.equal(full('senseiHealth'),3);
console.log('PASS: complete three-lesson story, correct-hit win, wrong-answer and timeout loss, duplicate submissions, pause/resume, portfolio pause, hidden-tab pause, untimed practice and late submission deadline.');
