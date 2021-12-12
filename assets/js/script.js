const questions = [
    {
        question:
            'The condition in an if / else statement is enclosed within __________.',
        answer1: 'quotes',
        answer2: 'curly brackets',
        answer3: 'parenthes',
        answer4: 'square brackets',
        correct: '2',
    },
    {
        question:
            'A very useful tool used during development and debugging for printing content to the debugger is:',
        answer1: 'JavaScript',
        answer2: 'terminal / bash',
        answer3: 'for loops',
        answer4: 'console.log',
        correct: '4',
    },
    {
        question: 'Commonly used data types DO NOT include:',
        answer1: 'strings',
        answer2: 'booleans',
        answer3: 'alerts',
        answer4: 'numbers',
        correct: '3',
    },
    {
        question: 'Arrays in JavaScript can be used to store __________.',
        answer1: 'numbers and string',
        answer2: 'other arrays',
        answer3: 'booleans',
        answer4: 'all of the above',
        correct: '4',
    },
];

const welcomeSection = document.querySelector('#welcome_section');
const questionSection = document.querySelector('#question_section');
const dashboardSection = document.querySelector('#scoreboard_section');
const startQuizButton = document.querySelector('#start_quiz');
const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const scoreText = document.querySelector('#score');
const timerText = document.querySelector('#timer');

let timerfun;
let countDown = 500;
timerText.innerText = countDown;

// add event listeners
startQuizButton.addEventListener('click', function () {
    timerfun = setInterval(() => {
        if (countDown >= 1) {
            timerText.innerText = countDown - 1;
        }
        if (countDown === 0) {
            getNewQuestion();
        }
        countDown--;
    }, 1000);
    welcomeSection.classList.add('hide');
    questionSection.classList.remove('hide');
});

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

const SCORE_POINTS = 100;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
};

getNewQuestion = () => {
    if (availableQuestions.length === 0 || countDown <= 0) {
        localStorage.setItem('mostRecentScore', score);
        clearInterval(timerfun);
        scoreText.innerText = score;
        dashboardSection.classList.remove('hide');
        questionSection.classList.add('hide');

        return;
    }
    const questionsIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionsIndex];
    question.innerText = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['answer' + number];
    });

    availableQuestions.splice(questionsIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        let classToApply =
            selectedAnswer === currentQuestion.correct ? 'correct' : 'incorrect';
        if (classToApply === 'correct') {
            incrementScore(SCORE_POINTS);
        }
        if (classToApply === 'incorrect') {
            countDown -= 10;
        }
        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 100);
    });
});

incrementScore = (num) => {
    score += num;
};

startGame();

// Save score
const username = document.querySelector('#username');
const saveScoreBtn = document.querySelector('#saveScoreBtn');

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

saveScoreBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const score = {
        score: scoreText.innerText,
        name: username.value,
    };

    highScores.push(score);
    localStorage.setItem('highscores', JSON.stringify(highScores));

    welcomeSection.classList.remove('hide');
    questionSection.classList.add('hide');
    dashboardSection.classList.add('hide');
    countDown = 500;
    timerText.innerText = countDown;
    startGame();

    console.log(highScores);
});

