const baseURL = "https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple";
const containerEl = document.querySelector(".container");
const formC = document.querySelector("#quiz_form");
const questC = document.querySelector(".quest");
const optionC = document.querySelector(".all_option");
const buttonC = document.querySelector(".buttons");
const scoreC = document.querySelector(".score_board .score_num");
const answerC = document.querySelector(".score_board .answer_num");

let question,answer;
let options = [];
let score = 0;
let answeredQ = 0;

window.addEventListener("DOMContentLoaded", quizApp)

async function quizApp(){
    addLoading();
    updateScoreBoard();
    const data = await fetchQuiz();
    question = data[0].question;
    options = [];
    answer = data[0].correct_answer;
    data[0].incorrect_answers.map(option => options.push(option));
    var n = Math.floor(Math.random()* options.length + 1);
    options.splice(n, 0, answer);
    
    
    //Generating HTML for question
    generateHTML(question, options);
    
}

formC.addEventListener('submit', (e)=>{
    e.preventDefault();

    if(e.target.quiz.value)
    {
        checkQuiz(e.target.quiz.value);
        e.target.querySelector("button").style.display = "none";
        createButtons();
    }
    else
    {
        return
    }
})

async function fetchQuiz(){
    const response = await fetch(baseURL);
    const data = await response.json();

    //console.log(data.results);
    return data.results;
}

function generateHTML(question, options){
    removeaddLoading();
    
    questC.innerHTML = question;
    optionC.innerHTML = '';
    options.map( (option, index)=>{
        const item = document.createElement('div');
        item.classList.add('option');
        item.innerHTML= `
        <input type="radio" id="option${index+1}" value="${option}" name="quiz">
        <label for="option${index+1}">${option}</label>
        `
        optionC.appendChild(item);
    })

}

function checkQuiz(selected){
    answeredQ++;
    
    if(selected === answer){
        score++;
    }
    
    updateScoreBoard();
    formC.quiz.forEach(input => {
        if(input.value === answer){
            input.parentElement.classList.add("correct");
        }
        else{
            input.parentElement.classList.add("incorrect"); 
        }
    });
}

function updateScoreBoard(){
    
    scoreC.innerHTML = score;
    answerC.innerHTML = answeredQ;
}

function createButtons(){

    const finishBtn = document.createElement("button");
    finishBtn.innerText = "Finish";
    finishBtn.setAttribute("type", "button");
    finishBtn.classList.add("finish-btn");
    buttonC.appendChild(finishBtn);

    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Next";
    nextBtn.setAttribute("type", "button");
    nextBtn.classList.add("next-btn");
    buttonC.appendChild(nextBtn);

    finishBtn.addEventListener("click", finishQuiz);
    nextBtn.addEventListener("click", nextQuiz);
}

function nextQuiz(){
    const finishBtn = document.querySelector(".finish-btn");
    const nextBtn = document.querySelector(".next-btn");

    buttonC.removeChild(finishBtn);
    buttonC.removeChild(nextBtn);
    buttonC.querySelector("button[type='submit']").style.display = "block";
    quizApp();
}

function finishQuiz(){
    const finishBtn = document.querySelector(".finish-btn");
    const nextBtn = document.querySelector(".next-btn");

    buttonC.removeChild(finishBtn);
    buttonC.removeChild(nextBtn);
    buttonC.querySelector("button[type='submit']").style.display = "block";
    
    const overlay = document.createElement("div");
    overlay.classList.add("result-overlay");

    overlay.innerHTML = `
    <p class="qresult"><u>Quiz Result</u></p>
    <table>
  
  <tr>
    <td>Attempt</td>
    <td>${answeredQ}</td>
  </tr>
  <tr>
    <td>Correct</td>
    <td>${score}</td>
  </tr>
  <tr>
    <td>Total Score</td>
    <td>${score}/${answeredQ}</td>
  </tr>
</table>
<button>Play Again</button>
    `

    containerEl.appendChild(overlay);
    overlay.querySelector("button").addEventListener("click", ()=>{
        containerEl.removeChild(overlay);
        playAgain();
    })
}

function playAgain(){
    score = 0;
    answeredQ = 0;
    quizApp();
}

function addLoading(){
    const load = document.createElement("div");
    load.classList.add("load");
    containerEl.appendChild(load);
}

function removeaddLoading(){
    const load = document.querySelector(".load");
    containerEl.removeChild(load);
}