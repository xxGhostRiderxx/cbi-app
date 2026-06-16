let mode="";
let index=0;
let answers=new Array(20).fill(null);

const q=[
"Success depends mostly on luck.",
"I can develop skills needed for a new career.",
"I avoid career decisions because I might fail.",
"Learning new skills improves my opportunities.",
"Career paths should always be predictable.",
"I am willing to take calculated career risks.",
"I need approval from others before changing careers.",
"I can adapt to changing job markets.",
"Uncertainty prevents me from making career plans.",
"I believe I can overcome career obstacles.",
"I would relocate for a good opportunity.",
"I can learn from career setbacks.",
"I compare myself negatively to others.",
"I am open to exploring different occupations.",
"I believe effort influences career success.",
"I prefer staying in my comfort zone.",
"I can create opportunities through networking.",
"I avoid applying unless fully qualified.",
"I am willing to experiment.",
"I believe my career is under my control."
];

const reverse=[0,2,4,6,8,12,15,17];

function setMode(m){
mode=m;
document.getElementById("modeSelect").style.display="none";

if(m==="student"){
document.getElementById("quizCard").style.display="block";
render();
}

if(m==="coach"){
let data=localStorage.getItem("cbi");
if(!data){
alert("No data");
return;
}
window.cbi=JSON.parse(data);
document.getElementById("coachPanel").style.display="block";
document.getElementById("coachPanel").innerHTML=JSON.stringify(window.cbi,null,2);
}
}

function render(){
document.getElementById("questionText").innerText=q[index];
document.getElementById("progressText")=`Q ${index+1}/20`;

let div=document.getElementById("options");
div.innerHTML="";

for(let i=1;i<=5;i++){
let b=document.createElement("button");
b.innerText=i;
b.onclick=()=>{
answers[index]=i;
};
div.appendChild(b);
}
}

function next(){
if(answers[index]==null)return;
index++;
if(index<20)render();
else results();
}

function prev(){
if(index>0){index--;render();}
}

function score(i){
let v=answers[i];
if(reverse.includes(i))v=6-v;
return v;
}

function results(){

document.getElementById("quizCard").style.display="none";
document.getElementById("resultCard").style.display="block";

let dims={
ada:(score(1)+score(7)+score(9)+score(11))/4,
exp:(score(5)+score(10)+score(13)+score(18))/4,
con:(score(14)+score(16)+score(19)+score(9))/4,
ris:(score(2)+score(4)+score(8)+score(15))/4,
sel:(score(0)+score(6)+score(12)+score(17))/4
};

window.cbi={dims};

localStorage.setItem("cbi",JSON.stringify(window.cbi));

draw(dims);
}

function draw(d){
let c=document.getElementById("radarChart");
let ctx=c.getContext("2d");

let center=150;
let r=100;

ctx.clearRect(0,0,300,300);

let keys=["ada","exp","con","ris","sel"];

ctx.beginPath();
for(let i=0;i<5;i++){
let a=(Math.PI*2*i)/5;
let x=center+Math.cos(a)*(d[keys[i]]/5*r);
let y=center+Math.sin(a)*(d[keys[i]]/5*r);
i?ctx.lineTo(x,y):ctx.moveTo(x,y);
}
ctx.closePath();
ctx.stroke();
}

function goToCoach(){
setMode("coach");
}

function generateAdvice(){
document.getElementById("adviceBox").innerText=
"Focus on small experiments and career exploration.";
}

function exportPDF(){
window.print();
}

function closeModal(){
document.getElementById("modal").style.display="none";
}