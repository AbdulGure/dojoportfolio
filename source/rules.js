/* Deterministic lesson rules. Player input is compared, never executed. */
(function(root){
 const lessons=[
  {id:'python',name:'Python',title:'Find your voice',location:'The dojo',speaker:'SENSEI',line:'A sword follows intention. Code does, too. First, tell the world you are ready.',explanation:'print() displays text. Put the word Ready inside quotation marks.',example:'print("Ready")',prompt:'Write a line that displays Ready.',hint:'Use print(), parentheses and quotes.',pattern:/^print\s*\(\s*(["'])Ready\1\s*\)\s*;?$/},
  {id:'javascript',name:'JavaScript',title:'Give your intent a name',location:'The lantern garden',speaker:'SENSEI',line:'You have a voice. Now give your strength a name. A variable holds a value until you need it.',explanation:'Use const to name a value that will not be reassigned. Set power to the number 10.',example:'const power = 10;',prompt:'Declare a constant named power with the number 10.',hint:'const, a name, =, then the number.',pattern:/^const\s+power\s*=\s*10\s*;?$/},
  {id:'sql',name:'SQL',title:'Read the battlefield',location:'The scroll archive',speaker:'SENSEI',line:'Strength is wasted without understanding. Ask the right question. Find what the world is hiding.',explanation:'SELECT chooses a column. FROM names the table. Read name from skills.',example:'SELECT name FROM skills;',prompt:'Select the name column from the skills table.',hint:'SELECT a column FROM a table.',pattern:/^SELECT\s+name\s+FROM\s+skills\s*;?$/i}
 ];
 function check(index,input){return lessons[index].pattern.test(String(input).trim())}
 function resolve(state,correct){
  if(state.health<=0||state.opponent<=0)return {...state};
  return {...state,health:Math.max(0,state.health-(correct?0:1)),opponent:Math.max(0,state.opponent-(correct?1:0)),round:state.round+1};
 }
 const api={lessons,check,resolve};root.DojoRules=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
