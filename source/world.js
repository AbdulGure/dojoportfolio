/* Original low-poly sets and characters, built from geometry. No remote models. */
(() => {
 'use strict';
 const host=document.getElementById('world');
 const fallback={setScene(){},strike(){return 1400},setMotion(){},setPaused(){},setLook(){},inspect(){return 'The dojo, lantern garden and archive hold the three lessons. Use the lesson button to train.'}};
 if(!window.THREE){host.innerHTML='<div class="world-fallback">The mountains are hidden in mist.<small>3D could not load. The complete story and code duel are still playable.</small></div>';window.DojoWorld=fallback;return;}
 const T=THREE;
 let renderer;
 try{renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});}catch(e){host.innerHTML='<div class="world-fallback">The mountains are hidden in mist.<small>WebGL is unavailable. You can still train and play the full code duel.</small></div>';window.DojoWorld=fallback;return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=T.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.setClearColor(0x191329);
 host.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-label','3D dojo, mountain landscape and two swordsmen. Use Inspect the dojo for a text description.');
 const scene=new T.Scene();scene.background=new T.Color(0x191329);scene.fog=new T.FogExp2(0x21182f,.018);
 const camera=new T.PerspectiveCamera(innerWidth<700?54:42,innerWidth/innerHeight,.1,180);camera.position.set(18,12,23);
 const hemi=new T.HemisphereLight(0xc8b5ff,0x30243a,2.1);scene.add(hemi);
 const sun=new T.DirectionalLight(0xe3ceff,3.2);sun.position.set(-12,22,9);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-22,right:22,top:22,bottom:-22,near:1,far:65});sun.shadow.bias=-.0008;scene.add(sun);
 const rim=new T.DirectionalLight(0x9c65ff,2.3);rim.position.set(15,9,-10);scene.add(rim);
 const palette={ink:0x16121d,wood:0x382638,edge:0x120f18,floor:0x8b7d88,paper:0xe9e1e5,purple:0x9164ca,stone:0x655c72,leaf:0x76508d};
 const mats={};const material=(color,emissive=0)=>mats[color+'_'+emissive]||(mats[color+'_'+emissive]=new T.MeshToonMaterial({color,emissive,emissiveIntensity:emissive?.6:0}));
 const boxGeo=new T.BoxGeometry(1,1,1);
 function box(parent,x,y,z,w,h,d,color,shadow=true){const m=new T.Mesh(boxGeo,material(color));m.position.set(x,y,z);m.scale.set(w,h,d);m.castShadow=shadow;m.receiveShadow=true;parent.add(m);return m;}
 function shape(parent,geometry,color,x,y,z){const m=new T.Mesh(geometry,material(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function group(parent,x=0,y=0,z=0){const g=new T.Group();g.position.set(x,y,z);parent.add(g);return g;}
 const ground=box(scene,0,-.6,0,95,1,95,0x282333,false);ground.receiveShadow=true;
 // A mountain amphitheatre, terraced rocks and an approach through the gate.
 for(let i=0;i<19;i++){const a=i/19*Math.PI*2;const r=34+(i%4)*3;const h=7+(i*13%15);const m=shape(scene,new T.ConeGeometry(6+(i%3)*2,h,4),i%2?0x3b304d:0x30283e,Math.cos(a)*r,h/2-.6,Math.sin(a)*r);m.rotation.y=i*.72;}
 for(let i=0;i<12;i++)box(scene,Math.sin(i*.7)*.2,-.02,6+i*1.1,2.7,.15,.82,i%2?0x8c7d93:0x70667d,false);
 const moon=new T.Mesh(new T.SphereGeometry(3,32,20),new T.MeshBasicMaterial({color:0xc5a5eb}));moon.position.set(-22,24,-39);scene.add(moon);
 function tree(x,z,size=1){const g=group(scene,x,0,z);g.scale.setScalar(size);shape(g,new T.CylinderGeometry(.12,.25,2.7,6),palette.wood,0,1.2,0);for(let j=0;j<3;j++){const foliage=shape(g,new T.IcosahedronGeometry(1.45-j*.17,0),j%2?0x9064a7:0x674778,Math.sin(j*2)*.5,2.2+j*.55,Math.cos(j*2)*.4);foliage.scale.y=.6;}return g;}
 const trees=[];for(let i=0;i<21;i++){const a=i/21*Math.PI*2;trees.push(tree(Math.cos(a)*(17+i%4),Math.sin(a)*(14+i%3)-2,.8+(i%4)*.2));}
 // Dojo: open front, raised wooden floor, individually modeled beams and roof.
 const dojo=group(scene,0,0,-2);
 box(dojo,0,.1,0,12.8,.35,10,0x4e3a4a);for(let i=0;i<16;i++)box(dojo,-5.7+i*.76,.31,0,.72,.08,9.5, i%2?0xa4979f:0x93858e,false);
 box(dojo,0,.15,5.35,5,.3,.9,palette.wood);box(dojo,0,.02,6,5.6,.14,.55,palette.stone);
 for(const x of [-6,6])for(const z of [-4.5,0,4.5]){box(dojo,x,2.65,z,.34,5,.34,palette.wood);box(dojo,x,4.8,z,.6,.3,.6,palette.ink);}
 for(const z of [-4.5,4.5])box(dojo,0,4.9,z,13,.4,.45,palette.wood);
 for(const x of [-6,6])box(dojo,x,4.9,0,.4,.4,10,palette.wood);
 // Paper screens at back, including slender mullions.
 for(let i=0;i<6;i++){const x=-5+i*2;box(dojo,x,2.4,-4.6,1.9,4,.12,palette.paper);for(let j=0;j<4;j++)box(dojo,x-.8+j*.53,2.4,-4.49,.035,4,.05,palette.wood,false);for(let j=0;j<5;j++)box(dojo,x,.6+j*.8,-4.47,1.9,.035,.05,palette.wood,false);}
 // Each sloping roof half is geometry, with dark eaves and a violet ridge.
 for(const side of [-1,1]){const roof=box(dojo,side*3.4,5.65,0,7.3,.28,11.3,0x211a2c);roof.rotation.z=side*-.2;for(let i=0;i<14;i++){const tile=box(dojo,side*3.4,5.85,-5.2+i*.8,7.3,.09,.045,0x544365,false);tile.rotation.z=side*-.2;}}
 box(dojo,0,6.46,0,.42,.32,11.7,0x8b5db1);
 // Hanging banner and a practice target.
 box(dojo,0,3.1,-4.36,1.25,2.2,.08,0x271a36);box(dojo,0,3.8,-4.28,.65,.08,.04,0xb998df);box(dojo,0,3.1,-4.28,.08,1.3,.04,0xb998df);box(dojo,0,2.7,-4.28,.55,.08,.04,0xb998df);
 const torii=group(scene,0,0,11);for(const x of [-3.3,3.3]){box(torii,x,2.6,0,.42,5.3,.42,0x6b448a);box(torii,x,.3,0,.6,.6,.6,palette.ink);}box(torii,0,4.25,0,7.6,.25,.35,0xa47bcc);box(torii,0,5.25,0,8.3,.38,.6,palette.ink);box(torii,0,5.5,0,8.8,.16,.7,0x87649e);
 const hotspots=[];const lamps=[];
 function hotspot(mesh,text){mesh.userData.description=text;hotspots.push(mesh);}
 function lantern(x,z){const g=group(scene,x,0,z);box(g,0,.12,0,.8,.2,.8,palette.stone);box(g,0,.8,0,.24,1.4,.24,palette.wood);const light=box(g,0,1.7,0,.65,.8,.65,0xceadf2);light.material=material(0xc9a0ed,0x8351a5);for(const a of [-1,1])box(g,a*.33,1.7,0,.05,.85,.7,palette.wood);shape(g,new T.ConeGeometry(.65,.35,4),palette.ink,0,2.3,0).rotation.y=Math.PI/4;lamps.push(light);hotspot(light,'A violet lantern. The garden teaches JavaScript: give each value a name, and let intention guide the light.');return g;}
 for(const [x,z] of [[-4,9],[4,9],[-7,4],[7,4],[10,1],[14,-4]])lantern(x,z);
 // Garden pool, stepping stones, bridge and bamboo.
 const garden=group(scene,12,0,-1);const water=shape(garden,new T.CylinderGeometry(3.7,3.7,.1,32),0x4c3c69,0,-.08,0);water.material=new T.MeshPhongMaterial({color:0x5d4979,shininess:80,transparent:true,opacity:.85});hotspot(water,'The reflecting pool. Variables are like vessels: a name holds a value. Today, const power = 10;');
 for(let i=0;i<12;i++){const a=i*Math.PI/6;shape(garden,new T.DodecahedronGeometry(.43+(i%3)*.08,0),palette.stone,Math.cos(a)*3.8,.05,Math.sin(a)*3.8);}
 for(let i=0;i<9;i++)box(garden,-2.4+i*.6,.28,1.2,.55,.15,1.3,palette.wood);for(const z of [.5,1.9]){box(garden,0,1,z,5.6,.09,.09,palette.wood);for(const x of [-2.5,0,2.5])box(garden,x,.7,z,.1,1,.1,palette.wood);}
 for(let i=0;i<9;i++){const x=15+(i%3)*.65,z=-6+Math.floor(i/3)*.7;shape(scene,new T.CylinderGeometry(.07,.1,3+i%3,6),0x6d6880,x,1.5+(i%3)*.5,z);}
 // Archive pavilion: accessible from the side, scrolls individually modeled.
 const archive=group(scene,-11,0,-3);box(archive,0,.12,0,5,.3,6,palette.wood);for(const x of [-2.2,2.2])for(const z of [-2.5,2.5])box(archive,x,2.2,z,.22,4.2,.22,palette.wood);box(archive,0,4.4,0,5.7,.3,6.8,palette.ink);box(archive,0,2,-2.5,4.5,3.7,.15,0x5b446b);
 for(let j=0;j<3;j++){box(archive,0,.7+j*1.05,-1.9,4.4,.13,.9,palette.wood);for(let i=0;i<7;i++){const scroll=shape(archive,new T.CylinderGeometry(.13,.13,.7,8),i%3?palette.paper:0x9e74bc,-1.8+i*.58,1.1+j*1.05,-1.9);scroll.rotation.x=Math.PI/2;hotspot(scroll,'A scroll in the archive. SQL is the art of asking a precise question: SELECT name FROM skills;');}}
 const gongGroup=group(scene,-4.5,.4,-1);box(gongGroup,0,1.25,0,1.8,.12,.25,palette.wood);for(const x of [-.75,.75])box(gongGroup,x,.7,0,.12,1.5,.12,palette.wood);const gong=shape(gongGroup,new T.CylinderGeometry(.62,.62,.12,24),0xb794ca,0,.7,0);gong.rotation.x=Math.PI/2;hotspot(gong,'The training gong. No master begins with mastery. Review the three forms, then write them under pressure.');
 function warrior(isSensei){
  const root=group(scene);const body=group(root,0,0,0);const robe=isSensei?0xd7ccd9:0x7343a1,skin=isSensei?0xa67868:0x825946;
  const torso=box(body,0,1.25,0,.65,.88,.4,robe);box(body,0,.86,0,.7,.12,.44,isSensei?0x6f4592:0xe4d6ec);
  const skirt=shape(body,new T.CylinderGeometry(.36,.49,.45,4),robe,0,.62,0);skirt.rotation.y=Math.PI/4;
  for(const x of [-.19,.19]){box(body,x,.3,0,.2,.55,.22,palette.ink);box(body,x,.06,.11,.23,.15,.4,0x18131e);}
  const head=shape(body,new T.SphereGeometry(.275,10,8),skin,0,1.98,0);head.scale.y=1.08;
  if(isSensei){shape(body,new T.ConeGeometry(.6,.22,12),0x44314d,0,2.28,0);const beard=shape(body,new T.ConeGeometry(.13,.32,5),0xdcd5e0,0,1.75,.23);beard.rotation.z=Math.PI;}else{const hair=shape(body,new T.SphereGeometry(.285,8,6),0x17121c,0,2.09,-.02);hair.scale.y=.55;shape(body,new T.ConeGeometry(.16,.38,5),0x17121c,-.14,2.28,-.04).rotation.z=-.5;box(body,0,1.77,0,.6,.12,.44,0xb78cea);const scarf=box(body,-.28,1.63,-.33,.22,.6,.08,0xab77dc);scarf.rotation.x=-.4;}
  for(const x of [-.1,.1])box(body,x,1.99,.247,.07,.035,.02,0xf6edf8,false);
  const arms=[];for(const side of [-1,1]){const arm=group(body,side*.43,1.58,0);box(arm,0,-.25,0,.22,.5,.25,robe);shape(arm,new T.SphereGeometry(.12,6,5),skin,0,-.54,0);arms.push(arm);}
  const sword=group(arms[1],0,-.58,.04);box(sword,0,.58,0,.055,1.12,.035,0xeee8f6);box(sword,0,.02,0,.24,.045,.13,0xb196c7);box(sword,0,-.12,0,.07,.25,.07,0x23172e);arms[1].rotation.x=-.35;
  return {root,body,arms,sword};
 }
 const hero=warrior(false),sensei=warrior(true);hero.root.name="Abdul";sensei.root.name="Sensei";hero.root.position.set(-1.6,.36,1);sensei.root.position.set(1.6,.36,-.7);hero.root.rotation.y=.6;sensei.root.rotation.y=-.5;
 const sparkGroup=group(scene,0,1.8,1);sparkGroup.visible=false;for(let i=0;i<9;i++){const spark=box(sparkGroup,0,0,0,.035,.4,.035,0xe8d7ff,false);spark.rotation.z=i*Math.PI/9;spark.position.set(Math.cos(i)*.3,Math.sin(i)*.3,0);}
 const poses=[{cam:[17,11,24],look:[0,2,0],hero:[-1.5,.36,3],sensei:[1.6,.36,-.7]}, {cam:[8,6.6,12],look:[0,1.8,-1],hero:[-1.7,.36,1],sensei:[1.7,.36,-.7]}, {cam:[17,6.3,7],look:[11,1.4,-1],hero:[9,0,2],sensei:[12.5,0,1.9]}, {cam:[-16,6.2,6],look:[-10,1.6,-3],hero:[-9.5,.32,-.2],sensei:[-12.2,.32,-1.3]}, {cam:[.5,4.1,8.8],look:[0,1.6,.6],hero:[-1.65,.36,1],sensei:[1.65,.36,1]}];
 let chapter=0,paused=false,motion=true,lookMode=false,orbitX=0,orbitY=0,attack=null,last=performance.now(),time=0;
 let goalCam=new T.Vector3(...poses[0].cam),goalLook=new T.Vector3(...poses[0].look),lookAt=goalLook.clone();
 const baseHero=new T.Vector3(...poses[0].hero),baseSensei=new T.Vector3(...poses[0].sensei);
 let dragging=false,pointerStart=null;
 const ray=new T.Raycaster(),pointer=new T.Vector2();
 renderer.domElement.addEventListener('pointerdown',e=>{pointerStart={x:e.clientX,y:e.clientY};if(lookMode){dragging=true;renderer.domElement.setPointerCapture(e.pointerId);}});
 renderer.domElement.addEventListener('pointermove',e=>{if(dragging&&pointerStart){orbitX=Math.max(-.3,Math.min(.3,orbitX+(e.clientX-pointerStart.x)*.002));orbitY=Math.max(-.15,Math.min(.15,orbitY+(e.clientY-pointerStart.y)*.001));pointerStart={x:e.clientX,y:e.clientY};}});
 renderer.domElement.addEventListener('pointerup',e=>{const wasDragging=dragging;dragging=false;if(!wasDragging&&pointerStart&&Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)<8){pointer.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);ray.setFromCamera(pointer,camera);const hits=ray.intersectObjects(hotspots);if(hits.length)document.dispatchEvent(new CustomEvent('dojo-inspect',{detail:hits[0].object.userData.description}));}pointerStart=null;});
 renderer.domElement.addEventListener('pointercancel',()=>{dragging=false;pointerStart=null});
 document.addEventListener('keydown',e=>{if(!lookMode||paused||/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();orbitX=Math.max(-.3,Math.min(.3,orbitX+(e.key==='ArrowLeft'?-.06:e.key==='ArrowRight'?.06:0)));orbitY=Math.max(-.15,Math.min(.15,orbitY+(e.key==='ArrowUp'?-.03:e.key==='ArrowDown'?.03:0)));}});
 function resize(){camera.fov=innerWidth<700?54:42;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));}addEventListener('resize',resize);
 function animate(now){
  requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.05);last=now;if(document.hidden)return;
  if(!paused)time+=dt;
  const p=poses[chapter],mobile=innerWidth<700;
  const desired=goalCam.clone();if(mobile){desired.y+=2.7;desired.z+=5;}
  if(lookMode){const offset=desired.clone().sub(goalLook);offset.applyAxisAngle(new T.Vector3(0,1,0),orbitX);offset.y+=orbitY*10;desired.copy(goalLook).add(offset);}
  if(motion&&!paused&&!attack){desired.x+=Math.sin(time*.22)*.25;desired.y+=Math.cos(time*.3)*.13;}
  camera.position.lerp(desired,motion?1-Math.exp(-dt*3.5):1);lookAt.lerp(goalLook,motion?1-Math.exp(-dt*4):1);camera.lookAt(lookAt);
  hero.root.position.lerp(baseHero,1-Math.exp(-dt*5));sensei.root.position.lerp(baseSensei,1-Math.exp(-dt*5));
  if(!paused){
   hero.body.position.y=motion?Math.sin(time*1.6)*.016:0;sensei.body.position.y=motion?Math.sin(time*1.4+1)*.016:0;
   trees.forEach((tree,i)=>tree.rotation.z=motion?Math.sin(time*.45+i)*.008:0);lamps.forEach((lamp,i)=>lamp.scale.y=.8+(motion?Math.sin(time*1.7+i)*.015:0));
   hero.arms[1].rotation.set(-.35,0,0);sensei.arms[1].rotation.set(-.35,0,0);hero.body.rotation.z=0;sensei.body.rotation.z=0;sparkGroup.visible=false;
   if(attack){attack.elapsed+=dt;const t=Math.min(1,attack.elapsed/1.4),swing=Math.sin(Math.min(1,t*2)*Math.PI);hero.root.position.x=baseHero.x+swing*.95;hero.arms[1].rotation.x=-.35-swing*1.9;hero.arms[1].rotation.z=-swing*.8;
    if(attack.correct){sensei.body.rotation.z=-swing*.2;sparkGroup.visible=t>.24&&t<.42;sparkGroup.rotation.z=t*8;}
    else if(t>.45){const counter=Math.sin((t-.45)/.55*Math.PI);sensei.root.position.x=baseSensei.x-counter*1.05;sensei.arms[1].rotation.x=-.35-counter*2;hero.body.rotation.z=counter*.22;}
    if(t>=1)attack=null;
   }
  }
  renderer.render(scene,camera);
 }
 requestAnimationFrame(animate);
 window.DojoWorld={
  setScene(index){chapter=Math.max(0,Math.min(4,index));torii.visible=chapter===0;const p=poses[chapter];goalCam.set(...p.cam);goalLook.set(...p.look);baseHero.set(...p.hero);baseSensei.set(...p.sensei);hero.root.rotation.y=chapter===4?Math.PI/2:.6;sensei.root.rotation.y=chapter===4?-Math.PI/2:-.5;orbitX=orbitY=0;attack=null;},
  strike(correct){if(motion)attack={correct,elapsed:0};return motion?1400:450;},
  setMotion(value){motion=value;if(!value){attack=null;sparkGroup.visible=false;}},
  setPaused(value){paused=value;},setLook(value){lookMode=value;if(!value)orbitX=orbitY=0;renderer.domElement.style.cursor=value?'grab':'default';},
  inspect(){return ['The mountain path leads through a torii gate. Abdul arrives at a dojo built from timber, paper and possibility.','An open timber dojo: paper screens, a hanging banner and a training gong. Sensei waits with a wooden practice blade.','A stone bridge crosses a violet reflecting pool. Six lanterns light the path to the next lesson.','Scrolls line the archive shelves. Each one holds a question that code can answer.','The dojo floor is clear. Abdul and Sensei face one another. Three correct code strikes will break the guard.'][chapter];}
 };
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();document.dispatchEvent(new CustomEvent('dojo-inspect',{detail:'The 3D view was interrupted. Your lesson and duel progress are still available. Reload after this session to restore the landscape.'}));});
})();
