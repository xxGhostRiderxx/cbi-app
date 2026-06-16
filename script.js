let i=0;
let ans=new Array(20).fill(null);

const PASS="cbi2026";

const Q=[
"Success depends mostly on luck.",
"I can learn new skills quickly.",
"I avoid career decisions due to fear.",
"I actively explore opportunities.",
"Career paths must be predictable.",
"I take calculated risks.",
"I need approval before changing careers.",
"I adapt to change.",
"I feel blocked by uncertainty.",
"I believe I can overcome obstacles.",
"I would relocate for opportunity.",
"I learn from setbacks.",
"I compare myself negatively.",
"I explore careers actively.",
"I believe effort leads to success.",
"I stay in comfort zone.",
"I create opportunities.",
"I avoid applying unless perfect.",
"I try new roles.",
"I control my career direction."
];

const R=[0,2,4,6,8,12,15,17];
const D=["ada","exp","con","ris","sel"];

function setMode(m){

if(m==="coach"){
let p=prompt("Password:");
if(p!==PASS)return alert("Wrong password");
}

hideAll();

if(m==="student")start();
if(m==="coach")coach();
}

function hideAll(){
document.getElementById("quizCard").classList.add("hidden");
document.getElementById("resultCard").classList.add("hidden");
document.getElementById("coachCard").classList.add("hidden");
}

function start(){
i=0;
ans=new Array(20).fill(null);
document.getElementById("quizCard").classList.remove("hidden");
render();
}

/* ===================== */
/* FIXED LIKERT ENGINE */
/* ===================== */

function render(){

if(i>=Q.length){
showResults();
return;
}

document.getElementById("qText").innerText=Q[i];

/* progress */
document.getElementById("progressBar").style.width =
((i+1)/Q.length)*100+"%";

let box=document.getElementById("options");
box.innerHTML="";

let labels=[
"Strongly Disagree",
"Disagree",
"Neutral",
"Agree",
"Strongly Agree"
];

for(let v=1; v<=5; v++){

let b=document.createElement("button");

b.innerHTML=`<div><b>${v}</b> ${labels[v-1]}</div>`;

if(ans[i]===v)b.classList.add("selected");

b.onclick=()=>{
ans[i]=v;

/* safe auto advance */
setTimeout(()=>{
if(i<Q.length-1){
i++;
render();
}else{
showResults();
}
},120);
};

box.appendChild(b);
}
}

/* SCORING */
function s(x){
let v=ans[x];
if(R.includes(x))v=6-v;
return v;
}

function calc(){
return {
ada:(s(1)+s(7)+s(11)+s(19))/4,
exp:(s(3)+s(10)+s(13)+s(18))/4,
con:(s(14)+s(16)+s(19)+s(11))/4,
ris:(s(2)+s(5)+s(8)+s(15))/4,
sel:(s(0)+s(6)+s(12)+s(17))/4
};
}

/* RESULTS */
function showResults(){

hideAll();
document.getElementById("resultCard").classList.remove("hidden");

let d=calc();
window.data=d;

document.getElementById("profile").innerText=
(d.ada+d.exp+d.con+d.ris+d.sel)/5>=4
?"Confident Explorer"
:"Balanced / Developing Profile";

document.getElementById("selS").innerText=d.sel.toFixed(2);
document.getElementById("conS").innerText=d.con.toFixed(2);
document.getElementById("risS").innerText=d.ris.toFixed(2);
document.getElementById("expS").innerText=d.exp.toFixed(2);

document.getElementById("conf").innerText=
((d.con+d.ada)/2).toFixed(2);

document.getElementById("signal").innerText=
d.sel>4?"High Indecision":
d.exp<2.5?"Low Exploration":
d.ris>4?"High Risk":"Balanced";

let c=challenge(d);
document.getElementById("primary").innerText=c.name;
document.getElementById("meaning").innerText=c.meaning;
document.getElementById("feedback").innerText=c.feedback;

draw(d);
}

/* CHALLENGE */
function challenge(d){
let arr=[
{name:"Indecision",val:d.sel,meaning:"Difficulty choosing",feedback:"Run small experiments"},
{name:"Low Exploration",val:d.exp,meaning:"Limited exposure",feedback:"Explore options"},
{name:"Low Confidence",val:d.con,meaning:"Self doubt",feedback:"Build skills"},
{name:"Risk Avoidance",val:d.ris,meaning:"Fear of uncertainty",feedback:"Safe experiments"},
{name:"Perfectionism",val:d.ada,meaning:"Rigid thinking",feedback:"Flexibility training"}
];
arr.sort((a,b)=>b.val-a.val);
return arr[0];
}

/* RADAR */
function draw(d){

let c=document.getElementById("radar");
let ctx=c.getContext("2d");

ctx.clearRect(0,0,420,420);

let cx=210,cy=210,r=140;

for(let i=0;i<5;i++){
let a=(Math.PI*2*i)/5;
let x=cx+Math.cos(a)*r;
let y=cy+Math.sin(a)*r;

ctx.beginPath();
ctx.moveTo(cx,cy);
ctx.lineTo(x,y);
ctx.strokeStyle="#ddd";
ctx.stroke();

ctx.fillText(D[i].toUpperCase(),x,y);
}

ctx.beginPath();

for(let i=0;i<5;i++){
let a=(Math.PI*2*i)/5;
let v=d[D[i]];
let x=cx+Math.cos(a)*(v/5*r);
let y=cy+Math.sin(a)*(v/5*r);

i?ctx.lineTo(x,y):ctx.moveTo(x,y);
}

ctx.closePath();
ctx.fillStyle="rgba(124,58,237,0.3)";
ctx.fill();
ctx.stroke();
}

/* COACH */
function coach(){

if(!window.data)return alert("Complete assessment first");

let d=window.data;

document.getElementById("coachCard").classList.remove("hidden");

document.getElementById("coachCard").innerHTML=`
<h2>🧑‍🏫 Coach Dashboard</h2>

<h3>Key Insight</h3>
<p>${d.sel>4?"High indecision detected":"Stable decision pattern"}</p>

<h3>Action Plan</h3>
<ul>
<li>1 career experiment this week</li>
<li>1 reflection task</li>
<li>1 informational interview</li>
</ul>

<h3>Krumboltz Coaching Questions</h3>
<ul>
<li>What evidence supports your belief?</li>
<li>What small experiment can you run?</li>
<li>What if failure is part of learning?</li>
</ul>
`;
}