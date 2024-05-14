const startBtn = document.querySelector(".start");
const questionNum = document.getElementById("num-questions");
const categoryForm = document.getElementById("category");
const difficultyForm = document.getElementById("difficulty");
let quiz;
let allQuestions;

startBtn.addEventListener("click" ,async function(){
    let questionNumber = questionNum.value;
    let category = categoryForm.value;
    let difficulty = difficultyForm.value;

    quiz = new Quiz(questionNumber , category , difficulty);
    allQuestions = await quiz.getAllQuestions();

    let myquestion = new Question(0)
    console.log(myquestion);
    myquestion.displayquestion()
    document.querySelector(".start-screen").classList.replace("d-flex" , "d-none")
    console.log(allQuestions);

})

class Quiz {
    constructor(number , categ, difficult){
        this.questionNumber = number;
        this.category = categ;
        this.difficulty = difficult;
        this.score = 0
    }

    getAPI(){
        return `https://opentdb.com/api.php?amount=${this.questionNumber}&category=${this.category}&difficulty=${this.difficulty} `
    }

   async getAllQuestions(){
        var response = await fetch(this.getAPI());
        var data = await response.json();
        var final = data.results
        return(final)
    }

    displayScore(){
        let container =`
        <h1 class="heading text-white text-center">Quiz App</h1>
        <div class="score">
            <span class="score-text">Ypur Score:</span>
            <div>
                <span class="final-score">${this.score}</span>
                /
                <span class="total-score">${allQuestions.length}</span>
            </div>
        </div>
        <button class="Btn restart">Restart Quiz</button>
        `
        document.querySelector(".quiz").classList.add("d-none")
        document.querySelector(".start-screen").classList.add("d-none");
        document.querySelector(".end-screen").classList.replace("d-none" , "d-flex");
        document.querySelector(".end-screen").innerHTML = container
    }
}
class Question{
    constructor(index){
        this.index = index;
        this.category = allQuestions[index].category;
        this.difficulty = allQuestions[index].difficulty;
        this.correct_answer = allQuestions[index].correct_answer;
        this.incorrect_answers = allQuestions[index].incorrect_answers;
        this.question = allQuestions[index].question
        this.allAnswers = this.getAllAnswers()
        this.checked = false
    }

    getAllAnswers(){
        let arr = [this.correct_answer,...this.incorrect_answers]
        arr.sort()
        return arr
    }

    displayquestion(){
        let container = `
        <div class="question-wrapper w-75">
        <div class="number w-100 text-center">
            Question <span class="current">${this.index +1}</span>/<span class="total">${allQuestions.length}</span>
        </div>
        <div class="question w-100 text-center">${this.question}</div>
    </div>
    <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
    
    ${this.allAnswers.map((ele) => {
        return `<li>${ele}</li>`
    }).join(" ")}
    </ul>
        `
        document.querySelector(".content").innerHTML = container;
        document.querySelector(".quiz").classList.remove("d-none");
        
        let choices = document.querySelectorAll(".choices li")

        choices.forEach((ele) => {
            ele.addEventListener("click", () => {
                this.checkAnswer(ele)
            })
        })
    }
    checkAnswer(li){
        if(this.checked==false){
            this.checked = true;
            if(li.innerHTML == this.correct_answer){
                li.classList.add("correct")
                quiz.score++
            }
            else{
                li.classList.add("wrong")
            }
            this.nextQuestion()
        }
    }
    nextQuestion(){
        this.index++;
        if(this.index<allQuestions.length){
            setTimeout(()=>{
                let nextQuestion = new Question(this.index)
                nextQuestion.displayquestion()
            },2000)
        }
        else{
           quiz.displayScore()
           document.querySelector(".restart").addEventListener("click",function(){
            window.location.reload()
           }) 
        }
    }
}