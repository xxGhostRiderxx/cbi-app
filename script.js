function startAssessment(){
document.getElementById("landing").classList.add("hidden");
document.getElementById("quizCard").classList.remove("hidden");
start();
}
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

/* ONLY USAGE COUNT (NO STUDENT STORAGE) */
let CBI_USAGE_COUNT =
parseInt(localStorage.getItem("cbi_usage_count") || "0");

/* START FIX */
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

/* LIKERT (UNCHANGED STYLE) */
function render(){

if(i>=Q.length){
showResults();
return;
}

document.getElementById("qText").innerText=Q[i];

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

b.onclick=()=>{
ans[i]=v;
setTimeout(()=>{ i++; render(); },120);
};

box.appendChild(b);
}
}

/* SCORING */
function s(x){
let v=ans[x]||3;
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

/* SAVE ONLY COUNT */
function saveProfile(){
CBI_USAGE_COUNT++;
localStorage.setItem("cbi_usage_count",CBI_USAGE_COUNT);
}

/* RESULTS */
function showResults(){

let d=calc();
window.data=d;

saveProfile();

document.getElementById("resultCard").classList.remove("hidden");
document.getElementById("quizCard").classList.add("hidden");

document.getElementById("selS").innerText=d.sel.toFixed(2);
document.getElementById("expS").innerText=d.exp.toFixed(2);
document.getElementById("conS").innerText=d.con.toFixed(2);
document.getElementById("risS").innerText=d.ris.toFixed(2);
document.getElementById("adaS").innerText=d.ada.toFixed(2);

document.getElementById("signal").innerText=getSignal(d);
document.getElementById("primary").innerText=getTop(d);
document.getElementById("feedback").innerText=getIntervention(d);

draw(d);
}

/* HELPERS */
function getSignal(d){
if(d.sel>4)return "High Indecision";
if(d.exp<2.5)return "Low Exploration";
if(d.con<2.5)return "Low Confidence";
if(d.ris>4)return "High Risk";
return "Balanced";
}

function getTop(d){
let arr=[
["Indecision",d.sel],
["Exploration",d.exp],
["Confidence",d.con],
["Risk",d.ris],
["Agency",d.ada]
];
arr.sort((a,b)=>b[1]-a[1]);
return arr[0][0];
}

function getIntervention(d){
if(d.sel>4)return "Decision tree + values sorting";
if(d.con<2.5)return "Mastery experiences";
if(d.exp<2.5)return "Career sampling plan";
if(d.ris>4)return "Reframing + exposure tasks";
return "Balanced development";
}

/* =========================
RADAR (5 COLORS VERSION)
========================= */
function draw(d){

let c=document.getElementById("radar");
let ctx=c.getContext("2d");

ctx.clearRect(0,0,400,400);

let cx=200,cy=200,r=120;

let keys=["sel","exp","con","ris","ada"];
let labels=["Indecision","Exploration","Confidence","Risk","Agency"];

let colors=["#ef4444","#f59e0b","#22c55e","#3b82f6","#a855f7"];

for(let j=0;j<5;j++){
let a=(Math.PI*2*j)/5;
let x=cx+Math.cos(a)*r;
let y=cy+Math.sin(a)*r;

ctx.beginPath();
ctx.moveTo(cx,cy);
ctx.lineTo(x,y);
ctx.strokeStyle="#ddd";
ctx.stroke();

ctx.fillStyle="#111";
ctx.fillText(labels[j],x,y);
}

/* shape */
ctx.beginPath();

for(let j=0;j<5;j++){
let a=(Math.PI*2*j)/5;
let v=d[keys[j]];
let x=cx+Math.cos(a)*(v/5*r);
let y=cy+Math.sin(a)*(v/5*r);

if(j===0)ctx.moveTo(x,y);
else ctx.lineTo(x,y);

/* point colors */
ctx.fillStyle=colors[j];
ctx.beginPath();
ctx.arc(x,y,5,0,Math.PI*2);
ctx.fill();
}

ctx.closePath();
ctx.strokeStyle="#111";
ctx.fillStyle="rgba(79,70,229,0.2)";
ctx.fill();
ctx.stroke();
}

/* =========================
PDF EXPORT (WITH RADAR IMAGE)
========================= */
function exportPDF(){

if(!window.data){
alert("Complete assessment first.");
return;
}

const { jsPDF } = window.jspdf;
let doc=new jsPDF();

let d=window.data;

doc.text("Krumboltz Career Beliefs Inventory",10,10);

doc.text("Indecision: "+d.sel.toFixed(2),10,30);
doc.text("Exploration: "+d.exp.toFixed(2),10,40);
doc.text("Confidence: "+d.con.toFixed(2),10,50);
doc.text("Risk: "+d.ris.toFixed(2),10,60);
doc.text("Agency: "+d.ada.toFixed(2),10,70);

doc.text("Signal: "+getSignal(d),10,90);
doc.text("Challenge: "+getTop(d),10,100);
doc.text("Intervention: "+getIntervention(d),10,110);

/* radar image */
let canvas=document.getElementById("radar");
let img=canvas.toDataURL("image/png");

doc.addImage(img,"PNG",30,120,150,150);

doc.save("CBI_Report.pdf");
}

/* COACH MODE (FULL INSTITUTIONAL REPORT) */
function coach(){

if(!window.data)return alert("Complete assessment first");

let html=`
<h2>🧑‍🏫 Coach Intelligence Report</h2>

<hr>

<h3>1. Belief Profile Snapshot</h3>
<ul>
<li>I must be 100% sure before acting</li>
<li>Mistakes lead to failure</li>
<li>Opportunities are limited</li>
</ul>

<h3>2. Belief → Behavior Map</h3>
<table border="1" width="100%">
<tr><th>Belief</th><th>Behavior</th><th>Risk</th></tr>
<tr><td>Need certainty</td><td>Avoids action</td><td>Low exploration</td></tr>
<tr><td>Fear of failure</td><td>Avoids experiments</td><td>Stagnation</td></tr>
<tr><td>Low agency</td><td>Passive planning</td><td>Dependence</td></tr>
<tr><td>Growth mindset</td><td>Active exploration</td><td>Positive</td></tr>
</table>

<h3>3. Intervention Plan</h3>
<ul>
<li>Micro career experiment</li>
<li>Informational interview</li>
<li>Reflection journal</li>
<li>Exposure task</li>
</ul>

<h3>4. Coaching Questions</h3>
<ul>
<li>What evidence supports your belief?</li>
<li>What happens if it's wrong?</li>
<li>What small experiment can you try?</li>
<li>When did uncertainty help you grow?</li>
</ul>

<h3>5. Risk Flags</h3>
<ul>
<li>Indecision pattern detected</li>
<li>Low exploration behavior</li>
<li>External validation dependence</li>
</ul>

<h3>6. Coaching Pathway</h3>
<ol>
<li>Awareness</li>
<li>Challenge</li>
<li>Experiment</li>
<li>Reflect</li>
<li>Rebuild belief system</li>
</ol>

<hr>

<h3>7. Institutional Usage</h3>
<p>Total Assessments: ${CBI_USAGE_COUNT}</p>
`;

document.getElementById("coachCard").innerHTML=html;
document.getElementById("coachCard").classList.remove("hidden");
}
function generateAdvice(){

let d = window.data;

let insights = "";
let advice = [];

if(d.sel > 4){
insights = "You show high career indecision, meaning you may be overthinking decisions instead of testing them in real life.";
advice = [
"Break decisions into small experiments (internships, shadowing)",
"Set a 7-day action rule instead of waiting for certainty",
"Talk to 2 people in different careers this week"
];
}

else if(d.exp < 2.5){
insights = "Your exploration level is low, meaning you may not have enough exposure to different career options yet.";
advice = [
"Explore 3 new career videos or job profiles today",
"Join one informational interview this week",
"Try a short online course in a new field"
];
}

else if(d.con < 2.5){
insights = "Your confidence level is low, suggesting self-doubt may be limiting your career actions.";
advice = [
"Focus on skill-building in one small area daily",
"Track small wins instead of perfection",
"Try beginner-level tasks instead of advanced goals"
];
}

else if(d.ris > 4){
insights = "You may avoid uncertainty, which can limit unexpected opportunities.";
advice = [
"Practice low-risk experiments (short trials)",
"Reframe failure as learning feedback",
"Try something unfamiliar once this week"
];
}

else{
insights = "Your profile shows balanced career thinking with healthy flexibility.";
advice = [
"Continue exploring multiple paths",
"Build consistency in skill development",
"Engage in real-world exposure opportunities"
];
}

document.getElementById("insightText").innerText = insights;

let list = document.getElementById("adviceList");
list.innerHTML = "";

advice.forEach(a=>{
let li = document.createElement("li");
li.innerText = a;
list.appendChild(li);
});
}