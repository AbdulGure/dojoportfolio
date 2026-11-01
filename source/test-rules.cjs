const assert=require('node:assert/strict');const {check,resolve}=require('./rules.js');
for(const [i,line] of [[0,'print("Ready")'],[0," print ( 'Ready' ) "],[1,'const power=10'],[1,'const power = 10;'],[2,'select name from skills'],[2,' SELECT  name FROM skills; ']])assert(check(i,line),line);
for(const [i,line] of [[0,'print(Ready)'],[0,'print("ready")'],[0,'print("Ready\')'],[0,'print("Ready"); steal()'],[1,'let power = 10;'],[1,'const power = "10";'],[2,'SELECT * FROM skills;'],[2,'SELECT name FROM skills; DELETE FROM skills;']])assert(!check(i,line),line);
let state={health:3,opponent:3,round:0};state=resolve(state,true);assert.deepEqual(state,{health:3,opponent:2,round:1});state=resolve(state,false);assert.deepEqual(state,{health:2,opponent:2,round:2});state=resolve(state,false);state=resolve(state,false);assert.equal(state.health,0);assert.deepEqual(resolve(state,true),state);
state={health:3,opponent:3,round:0};for(let i=0;i<3;i++)state=resolve(state,true);assert.equal(state.opponent,0);assert.deepEqual(resolve(state,false),state);
console.log('PASS: lesson answer variants, wrong answers, no appended code, hit/miss health, win/loss and terminal states.');
