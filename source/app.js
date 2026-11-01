(() => {
 'use strict';
 const $=id=>document.getElementById(id),rules=DojoRules,world=DojoWorld;
 const panels=['opening','storyUI','duelUI','ending'];
 let mode='opening',lessonIndex=0,mastered=[false,false,false],lessonPassed=false;
 let state={health:3,opponent:3,round:0},phase='idle',paused=false,deadline=0,remaining=0,limit=20,roundLesson=0,lastFocus=null,look=false;
 const mq=matchMedia('(prefers-reduced-motion: reduce)');let manualMotion=true;
 const announce=text=>{$('announcer').textContent=text;};
 function motion(){const enabled=manualMotion&&!mq.matches;world.setMotion(enabled);document.body.classList.toggle('reduced-motion',!enabled);$('motionBtn').textContent=enabled?'MOTION ON':'MOTION OFF';$('motionBtn').setAttribute('aria-pressed',String(enabled));}
 motion();mq.addEventListener('change',motion);$('motionBtn').addEventListener('click',()=>{manualMotion=!manualMotion;motion()});
 function showPanel(id){panels.forEach(p=>$(p).hidden=p!==id);document.body.dataset.mode=mode;}
 function note(text){$('notice').textContent=text;$('notice').hidden=false;clearTimeout(note.timeout);note.timeout=setTimeout(()=>$('notice').hidden=true,6500);}
 document.addEventListener('dojo-inspect',e=>note(e.detail));
 function seals(){mastered.forEach((done,i)=>{$('seal'+i).classList.toggle('earned',done);$('seal'+i).textContent=(done?'✓ ':'0'+(i+1)+' / ')+rules.lessons[i].name.toUpperCase();});}
 function resetLook(){look=false;world.setLook(false);$('cameraBtn').setAttribute('aria-pressed','false');$('cameraBtn').textContent='↔ LOOK AROUND';}
 function setStory(index){
  mode='story';phase='idle';paused=false;world.setPaused(false);resetLook();lessonIndex=index;lessonPassed=false;
  const lesson=rules.lessons[index];showPanel('storyUI');world.setScene(index+1);seals();
  $('chapterLabel').textContent=`0${index+1} / ${lesson.location.toUpperCase()}`;$('chapterTitle').textContent=lesson.title+'.';
  $('speaker').textContent='SENSEI / FORM 0'+(index+1);$('dialogueText').textContent=lesson.line;
  $('storyAction').textContent='LEARN '+lesson.name.toUpperCase()+' →';$('practiceBtn').hidden=true;
  $('locationLabel').textContent=lesson.location.toUpperCase()+' / THE APPRENTICE';$('worldHint').textContent='TAP OBJECTS TO INSPECT';
  $('inspectBtn').textContent='◈ INSPECT '+lesson.location.toUpperCase();announce(lesson.location+'. '+lesson.line);
 }
 function ready(){
  mode='ready';phase='idle';paused=false;world.setPaused(false);resetLook();showPanel('storyUI');world.setScene(4);seals();
  $('chapterLabel').textContent='04 / THE FIRST DUEL';$('chapterTitle').textContent='Put intention into motion.';
  $('speaker').textContent='SENSEI / THE TEST';$('dialogueText').textContent='Three forms learned. Now use them while the blade is moving. Write the correct line before time runs out. A correct answer lands your strike. A mistake or timeout leaves you open to mine. Three hits will decide this duel.';
  $('storyAction').textContent='DRAW YOUR SWORD →';$('practiceBtn').hidden=false;$('inspectBtn').textContent='◈ INSPECT THE ARENA';$('locationLabel').textContent='THE DOJO / TRIAL OF THREE FORMS';$('worldHint').textContent='CHOOSE YOUR PACE IN PLAY OPTIONS';
 }
 function begin(){setStory(0);$('storyAction').focus({preventScroll:true});}
 $('beginBtn').addEventListener('click',begin);
 $('homeBtn').addEventListener('click',()=>{
  phase='idle';mode='opening';paused=false;world.setPaused(false);document.querySelectorAll('dialog[open]').forEach(d=>d.close());mastered=[false,false,false];seals();resetLook();showPanel('opening');world.setScene(0);$('locationLabel').textContent='THE VIOLET MOUNTAINS / PROLOGUE';$('worldHint').textContent='A STORY YOU CAN PLAY';$('beginBtn').focus({preventScroll:true});
 });
 $('storyAction').addEventListener('click',()=>mode==='ready'?startDuel():openLesson());
 $('practiceBtn').addEventListener('click',()=>setStory(0));
 $('inspectBtn').addEventListener('click',()=>note(world.inspect()));
 $('cameraBtn').addEventListener('click',()=>{look=!look;world.setLook(look);$('cameraBtn').setAttribute('aria-pressed',String(look));$('cameraBtn').textContent=look?'↔ RESET VIEW':'↔ LOOK AROUND';if(look)note('Drag the landscape or use arrow keys to look around. Select Reset view to return to the story camera.');});
 function pauseClock(){
  if(mode!=='duel'||paused)return;
  remaining=Math.max(0,deadline-performance.now());paused=true;world.setPaused(true);$('pauseBtn').textContent='Ⅱ PAUSED';
 }
 function resumeClock(){
  if(mode!=='duel'||!paused)return;
  if(document.hidden)return;
  paused=false;deadline=performance.now()+remaining;world.setPaused(false);$('pauseBtn').textContent='Ⅱ PAUSE / HELP';if(phase==='waiting')$('qteInput').focus({preventScroll:true});
 }
 function openDialog(id){
  pauseClock();lastFocus=document.activeElement;world.setPaused(true);const d=$(id);if(!d.open)d.showModal();
 }
 document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',()=>{
  if(document.querySelector('dialog[open]'))return;
  if(mode==='duel')resumeClock();else world.setPaused(false);
  if(lastFocus?.isConnected)lastFocus.focus({preventScroll:true});
 }));
 document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.close).close()));
 $('portfolioBtn').addEventListener('click',()=>openDialog('portfolioDialog'));
 $('settingsBtn').addEventListener('click',()=>openDialog('optionsDialog'));
 function openLesson(){
  const lesson=rules.lessons[lessonIndex];lessonPassed=false;
  $('lessonTag').textContent=lesson.name.toUpperCase()+' / LESSON 0'+(lessonIndex+1);$('lessonTitle').textContent=lesson.title+'.';$('lessonExplanation').textContent=lesson.explanation;$('lessonExample').textContent=lesson.example;$('lessonPrompt').textContent=lesson.prompt;
  $('lessonInput').value='';$('lessonInput').disabled=false;$('lessonResult').textContent='Try the line yourself. There is no time limit while training.';$('lessonResult').className='';$('lessonForm').querySelector('button').textContent='TEST MY CODE →';
  openDialog('lessonDialog');$('lessonInput').focus();
 }
 $('lessonForm').addEventListener('submit',event=>{
  event.preventDefault();
  if(lessonPassed){$('lessonDialog').close();if(lessonIndex<2)setStory(lessonIndex+1);else ready();$('storyAction').focus({preventScroll:true});return;}
  const correct=rules.check(lessonIndex,$('lessonInput').value);
  if(correct){mastered[lessonIndex]=true;lessonPassed=true;seals();$('lessonResult').textContent='Form mastered. Sensei nods: “Good. You meant it, and the code obeyed.”';$('lessonResult').className='success';$('lessonInput').disabled=true;$('lessonForm').querySelector('button').textContent=lessonIndex<2?'CONTINUE THE JOURNEY →':'ENTER THE FINAL TRIAL →';$('lessonForm').querySelector('button').focus();}
  else{$('lessonResult').textContent='Not quite. '+rules.lessons[lessonIndex].explanation+' Check the example above and try again.';$('lessonResult').className='error';$('lessonInput').focus();}
 });
 function health(){
  for(const [id,value,label] of [['playerHealth',state.health,'Your health'],['senseiHealth',state.opponent,'Sensei guard']]){$(id).replaceChildren(...Array.from({length:3},(_,i)=>{const s=document.createElement('span');s.className=i<value?'full':'empty';s.setAttribute('aria-hidden','true');return s}));$(id).setAttribute('aria-label',`${label}: ${value} of 3`);}
  $('roundLabel').textContent='EXCHANGE '+String(state.round+1).padStart(2,'0');
 }
 function startDuel(){
  if(!mastered.every(Boolean)){note('Complete all three lessons before beginning the duel.');return;}
  mode='duel';phase='idle';state={health:3,opponent:3,round:0};paused=false;limit=Number($('paceSelect').value);resetLook();showPanel('duelUI');world.setScene(4);world.setPaused(false);$('locationLabel').textContent='THE DOJO / SWORDS DRAWN';$('worldHint').textContent='CORRECT CODE LANDS A STRIKE';$('duelModeLabel').textContent=limit?`${limit} SECONDS PER STRIKE`:'UNTIMED PRACTICE';$('pauseBtn').textContent='Ⅱ PAUSE / HELP';beginRound();
 }
 function beginRound(){
  if(state.health<=0||state.opponent<=0){finish();return;}
  phase='waiting';roundLesson=3-state.opponent;const lesson=rules.lessons[roundLesson];health();
  $('qteLanguage').textContent=lesson.name.toUpperCase()+' / FORM 0'+(roundLesson+1);$('qtePrompt').textContent=lesson.prompt;$('qteInput').value='';$('qteInput').disabled=false;$('strikeBtn').disabled=false;$('qteForm').classList.remove('resolved');$('qteHelp').textContent='Complete the line, then press Enter. Correct code breaks the guard.';$('fightCaption').textContent='';
  $('qteInput').focus({preventScroll:true});deadline=performance.now()+limit*1000;remaining=limit*1000;updateTimer(performance.now());announce('Your turn. '+lesson.name+'. '+lesson.prompt+(limit?` You have ${limit} seconds.`:' No time limit.'));
 }
 function updateTimer(now){const left=limit?Math.max(0,(deadline-now)/1000):Infinity;$('timerLabel').textContent=limit?left.toFixed(1)+' s':'UNTIMED';$('timerBar').style.transform=`scaleX(${limit?Math.min(1,left/limit):1})`;$('timerBar').classList.toggle('urgent',limit>0&&left<5);return left;}
 function resolveRound(correct,timedOut=false){
  if(mode!=='duel'||phase!=='waiting'||paused)return;
  phase='resolving';state=rules.resolve(state,correct);health();$('qteInput').disabled=true;$('strikeBtn').disabled=true;$('qteForm').classList.add('resolved');
  const feedback=correct?'STRIKE LANDED.':timedOut?'TOO SLOW. COUNTERSTRIKE.':'MISSED. COUNTERSTRIKE.';
  $('fightCaption').textContent=feedback;$('fightCaption').className='fight-caption '+(correct?'hit':'miss');$('qteHelp').textContent=correct?'Sensei’s guard breaks. Your next form is coming.':`You lose one health. The form was: ${rules.lessons[roundLesson].example}`;
  announce(feedback+` Your health ${state.health} of 3. Sensei guard ${state.opponent} of 3.`);
  if(!document.body.classList.contains('reduced-motion')){$('impact').className=correct?'strike-flash':'damage-flash';setTimeout(()=>$('impact').className='',500);}
  deadline=performance.now()+world.strike(correct)+1100;remaining=deadline-performance.now();
 }
 $('qteForm').addEventListener('submit',event=>{event.preventDefault();if(phase!=='waiting'||paused)return;if(limit&&performance.now()>=deadline){resolveRound(false,true);return;}resolveRound(rules.check(roundLesson,$('qteInput').value));});
 function finish(){
  mode='ending';phase='idle';paused=false;world.setPaused(false);showPanel('ending');const win=state.opponent===0;
  $('endingTag').textContent=win?'CHAPTER COMPLETE / THREE FORMS LEARNED':'THE LESSON CONTINUES';$('endingTitle').innerHTML=win?'YOUR FIRST<br><em>REAL STRIKE.</em>':'FALL. LEARN.<br><em>RISE AGAIN.</em>';
  $('endingText').textContent=win?'Sensei lowers his blade. “You came here to learn a language. You leave knowing how to turn an idea into action.” This is where the story meets the real work.':'Sensei offers a hand. “A missed strike is information. Read it. Try again.” Review the lessons or choose a slower pace before the next duel.';
  $('endingPrimary').textContent=win?'EXPLORE MY WORK ↗':'TRY THE DUEL AGAIN →';$('endingPrimary').dataset.win=String(win);$('retryBtn').textContent='REVIEW THE THREE FORMS ↺';$('endingPrimary').focus({preventScroll:true});$('worldHint').textContent=win?'THE STORY CONTINUES IN THE WORK':'EVERY MASTER WAS A BEGINNER';
 }
 $('endingPrimary').addEventListener('click',()=>{$('endingPrimary').dataset.win==='true'?openDialog('portfolioDialog'):startDuel()});
 $('retryBtn').addEventListener('click',()=>setStory(0));
 function pauseDuel(){if(mode!=='duel')return;const lesson=rules.lessons[roundLesson];$('pauseHelp').textContent=lesson.explanation;$('pauseExample').textContent=lesson.example;openDialog('pauseDialog');}
 $('pauseBtn').addEventListener('click',pauseDuel);$('resumeBtn').addEventListener('click',()=>$('pauseDialog').close());
 $('leaveDuelBtn').addEventListener('click',()=>{mode='ready';phase='idle';paused=false;$('pauseDialog').close();ready();});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&mode==='duel'&&!document.querySelector('dialog[open]')){event.preventDefault();pauseDuel();}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='duel'){pauseClock();if(!document.querySelector('dialog[open]'))pauseDuel();}else if(!document.hidden&&mode==='duel'&&paused&&!document.querySelector('dialog[open]'))pauseDuel();});
 function clock(now){if(mode==='duel'&&!paused&&!document.hidden){if(phase==='waiting'){if(updateTimer(now)<=0)resolveRound(false,true);}else if(phase==='resolving'&&now>=deadline)beginRound();}requestAnimationFrame(clock);}
 requestAnimationFrame(clock);seals();
})();
