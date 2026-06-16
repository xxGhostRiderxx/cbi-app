/* =====================================
   CAREER BELIEFS INVENTORY (CBI)
   PART 1
===================================== */

let mode = "";
let currentQuestion = 0;

let answers = new Array(20).fill(null);

/* =====================================
   QUESTIONS
===================================== */

const questions = [

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
"I avoid applying for jobs unless fully qualified.",
"I am willing to experiment with new roles.",
"I believe my future career is under my control."

];

/* =====================================
   REVERSE SCORED ITEMS
===================================== */

const reverseItems = [
0,
2,
4,
6,
8,
12,
15,
17
];

/* =====================================
   LIKERT FEEDBACK
===================================== */

const likertFeedback = {

1: "Strongly Disagree",
2: "Disagree",
3: "Neutral",
4: "Agree",
5: "Strongly Agree"

};

/* =====================================
   MODE SELECTION
===================================== */

function setMode(selectedMode){

    mode = selectedMode;

    document.getElementById("modeSelect").style.display = "none";

    if(mode === "student"){

        document.getElementById("quizCard").style.display = "block";

        renderQuestion();

    }

    if(mode === "coach"){

        const passcode = prompt(
            "Enter Coach Access Code"
        );

        if(passcode !== "CBI2026"){

            alert("Access denied");

            location.reload();

            return;
        }

        document.getElementById("coachPanel").style.display = "block";

        document.getElementById(
            "coachPanel"
        ).innerHTML = `
            <h2>Coach Dashboard</h2>
            <p>
            Complete a student assessment first
            to generate coaching insights.
            </p>
        `;
    }
}

/* =====================================
   QUESTION RENDER
===================================== */

function renderQuestion(){

    const qText =
        document.getElementById("questionText");

    const progressText =
        document.getElementById("progressText");

    const progressBar =
        document.getElementById("progressBar");

    const buttonsContainer =
        document.getElementById("scaleButtons");

    qText.innerText =
        questions[currentQuestion];

    progressText.innerText =
        `Question ${currentQuestion + 1} of 20`;

    progressBar.style.width =
        ((currentQuestion + 1) / 20) * 100 + "%";

    buttonsContainer.innerHTML = "";

    for(let i = 1; i <= 5; i++){

        const btn =
            document.createElement("button");

        btn.className = "scale-btn";

        btn.innerText = i;

        if(answers[currentQuestion] === i){

            btn.classList.add("selected");
        }

        btn.onclick = () => {

            answers[currentQuestion] = i;

            document.getElementById(
                "selectedFeedback"
            ).innerText =
                `${i} = ${likertFeedback[i]}`;

            renderQuestion();
        };

        buttonsContainer.appendChild(btn);
    }

    if(answers[currentQuestion]){

        document.getElementById(
            "selectedFeedback"
        ).innerText =
            `${answers[currentQuestion]} = ${
                likertFeedback[
                    answers[currentQuestion]
                ]
            }`;

    }else{

        document.getElementById(
            "selectedFeedback"
        ).innerText = "";
    }
}

/* =====================================
   NAVIGATION
===================================== */

function nextQuestion(){

    if(answers[currentQuestion] === null){

        alert(
            "Please select a response before continuing."
        );

        return;
    }

    if(currentQuestion < 19){

        currentQuestion++;

        renderQuestion();

    }else{

        showResults();
    }
}

function prevQuestion(){

    if(currentQuestion > 0){

        currentQuestion--;

        renderQuestion();
    }
}
/* =====================================
   SCORING FUNCTIONS
===================================== */

function scoreItem(index){

    let value = answers[index];

    if(reverseItems.includes(index)){

        value = 6 - value;
    }

    return value;
}

/* =====================================
   CATEGORY CALCULATIONS
===================================== */

function calculateDimensions(){

    const dimensions = {

        adaptability:
        (
            scoreItem(1) +
            scoreItem(7) +
            scoreItem(9) +
            scoreItem(11)
        ) / 4,

        exploration:
        (
            scoreItem(5) +
            scoreItem(10) +
            scoreItem(13) +
            scoreItem(18)
        ) / 4,

        control:
        (
            scoreItem(14) +
            scoreItem(16) +
            scoreItem(19) +
            scoreItem(9)
        ) / 4,

        risk:
        (
            scoreItem(2) +
            scoreItem(4) +
            scoreItem(8) +
            scoreItem(15)
        ) / 4,

        beliefs:
        (
            scoreItem(0) +
            scoreItem(6) +
            scoreItem(12) +
            scoreItem(17)
        ) / 4

    };

    return dimensions;
}

/* =====================================
   OVERALL SCORE
===================================== */

function calculateOverallScore(){

    let total = 0;

    for(let i = 0; i < answers.length; i++){

        total += scoreItem(i);
    }

    return total / answers.length;
}

/* =====================================
   PROFILE TYPE
===================================== */

function determineProfile(score){

    if(score >= 4){

        return "Adaptive Career Navigator";
    }

    if(score >= 3){

        return "Developing Career Explorer";
    }

    return "Restricted Career Thinker";
}

/* =====================================
   OVERALL INTERPRETATION
===================================== */

function determineInterpretation(score){

    if(score >= 4){

        return `
        Highly adaptive career beliefs.
        Demonstrates confidence,
        flexibility, openness to
        opportunities, and strong
        career self-management.
        `;
    }

    if(score >= 3){

        return `
        Moderately adaptive beliefs.
        Shows positive career attitudes
        but may benefit from additional
        exploration and experimentation.
        `;
    }

    return `
    Potentially limiting career beliefs.
    May experience hesitation,
    avoidance, self-doubt, or
    reduced confidence when
    approaching career decisions.
    `;
}

/* =====================================
   PRIMARY DEVELOPMENT AREA
===================================== */

function findPrimaryDevelopmentArea(dimensions){

    let lowestKey = Object.keys(dimensions)[0];

    Object.keys(dimensions).forEach(key => {

        if(
            dimensions[key] <
            dimensions[lowestKey]
        ){

            lowestKey = key;
        }
    });

    return lowestKey;
}

/* =====================================
   FRIENDLY CATEGORY LABELS
===================================== */

function categoryLabel(key){

    const labels = {

        adaptability:
        "Adaptability",

        exploration:
        "Exploration",

        control:
        "Career Control",

        risk:
        "Risk Tolerance",

        beliefs:
        "Self-Limiting Beliefs"

    };

    return labels[key];
}

/* =====================================
   PLANNED HAPPENSTANCE INSIGHT
===================================== */

function happenstanceInsight(category){

    const insights = {

        adaptability:
        `
        Focus on flexibility and curiosity.
        Unexpected opportunities often
        reward those who adapt rather than
        those who seek certainty.
        `,

        exploration:
        `
        Exploration creates opportunity.
        Small experiments often lead to
        surprising discoveries about
        interests and strengths.
        `,

        control:
        `
        Career ownership grows through
        action. Progress often comes from
        creating opportunities rather than
        waiting for them.
        `,

        risk:
        `
        Planned happenstance encourages
        calculated risk-taking. Growth
        often occurs when stepping outside
        familiar routines.
        `,

        beliefs:
        `
        Challenging limiting beliefs can
        open new possibilities. Career
        success is influenced by learning,
        effort, and action—not fixed traits.
        `
    };

    return insights[category];
}

/* =====================================
   SHOW RESULTS
===================================== */

function showResults(){

    document.getElementById(
        "quizCard"
    ).style.display = "none";

    document.getElementById(
        "resultCard"
    ).style.display = "block";

    const dimensions =
        calculateDimensions();

    const overall =
        calculateOverallScore();

    const profile =
        determineProfile(overall);

    const interpretation =
        determineInterpretation(overall);

    const primary =
        findPrimaryDevelopmentArea(
            dimensions
        );

    /* =====================
       PROFILE
    ===================== */

    document.getElementById(
        "profileType"
    ).innerText = profile;

    document.getElementById(
        "primaryCategory"
    ).innerText =
        categoryLabel(primary);

    document.getElementById(
        "score_overall"
    ).innerText =
        overall.toFixed(2) + " / 5";

    document.getElementById(
        "score_interpretation"
    ).innerText =
        interpretation;

    document.getElementById(
        "happenstanceInsight"
    ).innerText =
        happenstanceInsight(primary);

    /* =====================
       DIMENSION SCORES
    ===================== */

    document.getElementById(
        "score_ada"
    ).innerText =
        dimensions.adaptability.toFixed(2);

    document.getElementById(
        "score_exp"
    ).innerText =
        dimensions.exploration.toFixed(2);

    document.getElementById(
        "score_con"
    ).innerText =
        dimensions.control.toFixed(2);

    document.getElementById(
        "score_ris"
    ).innerText =
        dimensions.risk.toFixed(2);

    document.getElementById(
        "score_sel"
    ).innerText =
        dimensions.beliefs.toFixed(2);

    /* =====================
       SAVE FOR RADAR
    ===================== */

    window.cbiResults = {

        dimensions,
        overall,
        profile,
        primary
    };

    /* =====================
       DRAW RADAR
    ===================== */

    drawRadar(dimensions);

    /* =====================
       UPDATE COACH MODE
    ===================== */

    updateCoachDashboard(
        dimensions,
        overall,
        profile,
        primary
    );
}

/* =====================================
   RADAR LABELS + COLORS
===================================== */

const radarLabels = [
    "Ada",
    "Exp",
    "Con",
    "Ris",
    "Sel"
];

/* =====================================
   RADAR DRAWING
===================================== */

function drawRadar(dimensions){

    const canvas =
        document.getElementById("radarChart");

    const ctx =
        canvas.getContext("2d");

    const cx = 175;
    const cy = 175;
    const radius = 120;

    const values = [
        dimensions.adaptability,
        dimensions.exploration,
        dimensions.control,
        dimensions.risk,
        dimensions.beliefs
    ];

    ctx.clearRect(0,0,350,350);

    /* =========================
       ZONES (GREEN / YELLOW / RED)
    ========================= */

    function drawZone(scale, color){

        ctx.beginPath();
        ctx.fillStyle = color;

        for(let i=0;i<5;i++){

            let angle =
                (Math.PI * 2 * i) / 5;

            let r = (scale / 5) * radius;

            let x = cx + Math.cos(angle) * r;
            let y = cy + Math.sin(angle) * r;

            i ? ctx.lineTo(x,y) : ctx.moveTo(x,y);
        }

        ctx.closePath();
        ctx.fill();
    }

    drawZone(2.5, "rgba(0,200,0,0.10)");
    drawZone(3.5, "rgba(255,200,0,0.10)");
    drawZone(5,   "rgba(255,0,0,0.05)");

    /* =========================
       AXES + LABELS
    ========================= */

    window.radarPoints = [];

    for(let i=0;i<5;i++){

        let angle =
            (Math.PI * 2 * i) / 5;

        let x = cx + Math.cos(angle) * radius;
        let y = cy + Math.sin(angle) * radius;

        /* axis line */
        ctx.beginPath();
        ctx.moveTo(cx,cy);
        ctx.lineTo(x,y);
        ctx.strokeStyle = "#cbd5e1";
        ctx.stroke();

        /* label position */
        let lx = cx + Math.cos(angle) * (radius + 25);
        let ly = cy + Math.sin(angle) * (radius + 25);

        ctx.fillStyle = "#1f2a44";
        ctx.font = "bold 13px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            radarLabels[i] +
            " (" + values[i].toFixed(1) + ")",
            lx,
            ly
        );

        /* store clickable points */
        window.radarPoints.push({
            label: radarLabels[i],
            value: values[i],
            angle: angle,
            x: lx,
            y: ly
        });
    }

    /* =========================
       RADAR SHAPE
    ========================= */

    ctx.beginPath();
    ctx.strokeStyle = "#2f6fed";
    ctx.fillStyle = "rgba(47,111,237,0.25)";
    ctx.lineWidth = 2;

    for(let i=0;i<5;i++){

        let angle =
            (Math.PI * 2 * i) / 5;

        let r =
            (values[i] / 5) * radius;

        let x = cx + Math.cos(angle) * r;
        let y = cy + Math.sin(angle) * r;

        i ? ctx.lineTo(x,y) : ctx.moveTo(x,y);
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    /* enable click detection */
    canvas.onclick = handleRadarClick;
}

/* =====================================
   CLICK INTERACTION
===================================== */

function handleRadarClick(event){

    const rect =
        document.getElementById("radarChart")
        .getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const explanations = {

        Ada: {
            title: "Adaptability",
            text:
            "Ability to adjust, learn, and respond to change.",
            advice:
            "Increase exposure to new environments and unexpected opportunities."
        },

        Exp: {
            title: "Exploration",
            text:
            "Willingness to try new career paths and experiences.",
            advice:
            "Run small career experiments (internships, job shadowing, conversations)."
        },

        Con: {
            title: "Career Control",
            text:
            "Sense of ownership over career direction.",
            advice:
            "Focus on proactive steps rather than waiting for perfect conditions."
        },

        Ris: {
            title: "Risk Tolerance",
            text:
            "Comfort with uncertainty and change.",
            advice:
            "Practice small calculated risks to build confidence."
        },

        Sel: {
            title: "Self-Limiting Beliefs",
            text:
            "Beliefs that restrict career growth or possibilities.",
            advice:
            "Challenge assumptions and replace them with evidence-based thinking."
        }
    };

    /* find closest label */
    for(let p of window.radarPoints){

        let dx = x - p.x;
        let dy = y - p.y;

        let distance =
            Math.sqrt(dx*dx + dy*dy);

        if(distance < 30){

            let e = explanations[p.label];

            document.getElementById(
                "modalTitle"
            ).innerText = e.title;

            document.getElementById(
                "modalScore"
            ).innerText =
                "Score: " + p.value.toFixed(2);

            document.getElementById(
                "modalText"
            ).innerText =
                e.text + "\n\n👉 " + e.advice;

            document.getElementById(
                "radarModal"
            ).style.display = "flex";

            return;
        }
    }
}

/* =====================================
   CLOSE MODAL
===================================== */

function closeModal(){

    document.getElementById(
        "radarModal"
    ).style.display = "none";
}

/* =====================================
   COACH DASHBOARD
===================================== */

function updateCoachDashboard(
    d,
    overall,
    profile,
    primary
){

    let container =
        document.getElementById("coachBars");

    container.innerHTML = "";

    const items = [
        ["Adaptability", d.adaptability],
        ["Exploration", d.exploration],
        ["Control", d.control],
        ["Risk", d.risk],
        ["Beliefs", d.beliefs]
    ];

    for(let item of items){

        container.innerHTML += `
        <div class="bar-item">

            <div class="bar-label">
                <span>${item[0]}</span>
                <span>${item[1].toFixed(2)}</span>
            </div>

            <div class="bar-track">
                <div class="bar-fill"
                     style="width:${(item[1]/5)*100}%">
                </div>
            </div>

        </div>`;
    }

    document.getElementById("coach_insight").innerHTML =
    `
    <strong>Profile:</strong> ${profile}<br><br>
    <strong>Primary Development Area:</strong> ${primary}<br><br>
    Focus coaching on strengthening the lowest dimension.
    `;

    document.getElementById("coach_happenstance").innerHTML =
    `
    Planned Happenstance Principle:<br><br>
    Encourage curiosity, persistence, flexibility,
    optimism, and willingness to take action in
    uncertain situations.
    `;
}

/* =====================================
   SIMPLE ADVICE ENGINE
===================================== */

function generateAdvice(){

    const d = window.cbiResults?.dimensions;

    if(!d) return;

    let weakest =
        Object.keys(d)
        .reduce((a,b)=> d[a] < d[b] ? a : b);

    const adviceMap = {

        adaptability:
        "Try changing one routine this week to build flexibility.",

        exploration:
        "Speak to someone in a career you know little about.",

        control:
        "Set one small career goal and act on it today.",

        risk:
        "Do one action outside your comfort zone.",

        beliefs:
        "Write down one belief and challenge it with evidence."
    };

    document.getElementById("aiAdvice").innerHTML =
        "👉 " + adviceMap[weakest];
}

/* =====================================
   PDF EXPORT
===================================== */

function exportPDF(){

    window.print();
}