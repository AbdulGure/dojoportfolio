const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const THREE={...require('./three.min.js')};let outputScene,outputCamera;
const canvas={style:{},setAttribute(){},addEventListener(){},setPointerCapture(){}};
THREE.WebGLRenderer=class{constructor(){this.domElement=canvas;this.shadowMap={};}setPixelRatio(){}setSize(){}setClearColor(){}render(scene,camera){outputScene=scene;outputCamera=camera;scene.updateMatrixWorld(true);}};
let time=0;const frames=[],events={};const context={window:{THREE},THREE,document:{addEventListener(){},hidden:false,getElementById:()=>({appendChild(){}}),dispatchEvent(){}},devicePixelRatio:1,innerWidth:1280,innerHeight:800,performance:{now:()=>time},addEventListener:(key,fn)=>events[key]=fn,requestAnimationFrame:f=>frames.push(f),CustomEvent:class{constructor(type,init){this.type=type;this.detail=init.detail}}};
vm.runInNewContext(fs.readFileSync('world.js','utf8'),context);
function tick(n){for(let i=0;i<n;i++){time+=16;frames.shift()(time)}}
tick(5);let meshes=0;outputScene.traverse(node=>{if(node.isMesh){meshes++;assert(node.geometry);assert(node.material);assert(node.position.toArray().every(Number.isFinite));}});assert(meshes>350);
for(let scene=0;scene<5;scene++){context.window.DojoWorld.setScene(scene);tick(120);assert(outputCamera.position.toArray().every(Number.isFinite));assert(context.window.DojoWorld.inspect().length>30);}
context.window.DojoWorld.strike(true);tick(100);context.window.DojoWorld.strike(false);tick(100);context.window.DojoWorld.setPaused(true);tick(5);context.window.DojoWorld.setPaused(false);context.window.DojoWorld.setMotion(false);context.window.DojoWorld.setScene(2);tick(2);assert.equal(context.window.DojoWorld.strike(true),450);
context.innerWidth=390;context.innerHeight=844;tick(5);assert(outputCamera.position.z>7);
console.log('PASS: real Three.js scene construction ('+meshes+' meshes), five camera destinations, strike/counterstrike animation paths, reduced motion and mobile camera offset. GPU rendering is not tested.');

for(const [width,height] of [[1280,800],[390,844]]){
 context.innerWidth=width;context.innerHeight=height;events.resize();
 for(let chapter=1;chapter<5;chapter++){
  context.window.DojoWorld.setScene(chapter);tick(120);outputScene.updateMatrixWorld(true);outputCamera.updateMatrixWorld(true);
  for(const name of ['Abdul','Sensei']){
   const actor=outputScene.getObjectByName(name);const head=actor.localToWorld(new THREE.Vector3(0,1.98,0));
   const screen=head.clone().project(outputCamera);assert(Math.abs(screen.x)<.95&&Math.abs(screen.y)<.8,`Actor ${name} outside frame in chapter ${chapter} at ${width}px: ${screen.x}, ${screen.y}`);
   const meshes=[];outputScene.traverseVisible(n=>{if(n.isMesh)meshes.push(n)});
   const ray=new THREE.Raycaster(outputCamera.position,head.clone().sub(outputCamera.position).normalize(),0,head.distanceTo(outputCamera.position)+.3);
   const hit=ray.intersectObjects(meshes,false)[0];let obj=hit?.object;while(obj&&obj!==actor)obj=obj.parent;
   assert(obj,`Actor ${name} obstructed in chapter ${chapter} at ${width}px`);
  }
 }
}
console.log('PASS: both characters visible from all four story/duel cameras, desktop and mobile (geometry ray tests).');
