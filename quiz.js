
let questions = [
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Venus", "Jupiter"],
        answer: "Mars"
    },
    {
        question: "Which planet has famous rings?",
        options: ["Mercury", "Earth", "Saturn", "Mars"],
        answer: "Saturn"
    },
    {
        question: "Which is Earth's natural satellite?",
        options: ["Sun", "Moon", "Mars", "Venus"],
        answer: "Moon"
    },
    {
        question: "Which gas do humans need to breathe?",
        options: ["Carbon dioxide", "Nitrogen", "Oxygen", "Helium"],
        answer: "Oxygen"
    },
    {
        question: "Which planet is the largest in our solar system?",
        options: ["Earth", "Jupiter", "Saturn", "Neptune"],
        answer: "Jupiter"
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

function showQuestion() {

    answered = false;

    let q = questions[currentQuestion];

    document.getElementById("question").textContent =
        q.question;

    document.getElementById("result").textContent = "";

    let optionsBox = document.getElementById("options");

    optionsBox.innerHTML = "";

    for (let option of q.options) {

        let button = document.createElement("button");

        button.textContent = option;

        button.onclick = function() {
            checkAnswer(option);
        };

        optionsBox.appendChild(button);

    }

    document.getElementById("next").disabled = true;

}

function checkAnswer(selected) {

    if (answered) return;

    answered = true;

    let correctAnswer = questions[currentQuestion].answer;

    if (selected === correctAnswer) {

        score += 10;

        document.getElementById("result").textContent =
            "Correct! Great job! 🎉";

    } else {

        document.getElementById("result").textContent =
            "Not quite! Correct answer: " + correctAnswer;

    }

    document.getElementById("score").textContent =
        "Score: " + score;

    document.getElementById("next").disabled = false;

}

function nextQuestion() {

    if (!answered) return;

    currentQuestion++;

    if (currentQuestion >= questions.length) {

        document.getElementById("question").textContent =
            "Quiz Completed! 🚀";

        document.getElementById("options").innerHTML = "";

        document.getElementById("result").textContent =
            "Your final score: " + score + " / 50";

        document.getElementById("next").style.display = "none";

        return;

    }

    showQuestion();

}

showQuestion();
