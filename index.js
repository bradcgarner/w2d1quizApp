'use strict';

// this is where we will store ALL our data, no data saved in the DOM
const STORE = {
  displayStatus: 'start', // options are start, question, end
  currentQuestion: 0,
  totalCorrect: 0, 
  questions: [
    { q: 'Which selector do you use to select an element\'s id?', a: 2 , options: ['.', '$', '#', '~'], response: null, correct: 0},
    { q: 'What CSS style controls the size of a <p> element\'s font?', a: 1 , options: ['fontSize', 'font-size', 'text-size', 'textSize'], response: null, correct: 0}, 
    { q: 'Which selector do you use to select an element\'s class?', a: 2 , options: ['$', '#', '.', '&'], response: null, correct: 0},
    { q: 'Which of the options is not a valid pseudoclass?', a: 2 , options: ['a:link', 'p:hover', 'link:hover', 'a:visited'], response: null, correct: 0},
    { q: 'In the box model, a border is between the padding and which of the options?', a: 2 , options: ['height', 'content', 'margin', 'the next element'], response: null, correct: 0}
    // { q: 'a Q1', a: 1 , options: ['wrong', 'right', 'wrong', 'wrong'], response: null, correct: 0}, 
    // { q: 'a Q0', a: 2 , options: ['wrong', 'wrong', 'right', 'wrong'], response: null, correct: 0},
    // { q: 'a Q1', a: 1 , options: ['wrong', 'right', 'wrong', 'wrong'], response: null, correct: 0}, 
    // { q: 'a Q0', a: 2 , options: ['wrong', 'wrong', 'right', 'wrong'], response: null, correct: 0},
    // { q: 'a Q1', a: 1 , options: ['wrong', 'right', 'wrong', 'wrong'], response: null, correct: 0}, 
    // { q: 'a Q0', a: 2 , options: ['wrong', 'wrong', 'right', 'wrong'], response: null, correct: 0},
    // { q: 'a Q1', a: 1 , options: ['wrong', 'right', 'wrong', 'wrong'], response: null, correct: 0}
  ]
};

const EL = { // ID all DOM element event listeners here, not jQ littered everywhere...  
  // 3 main sections that we'll populate/render
  start: $('.js-start'), 
  questions: $('.js-questions'), 
  end: $('.js-end'),
  // other within sections
  question: $('.js-question'),
  options: $('.js-options'), 
  response: $('.js-form-response'),
  trophyContainer: $('.js-trophy-container'), 
  finalScore: $('.js-final-score'), 
  answers: $('.js-answers'),
  statusBar: $('.js-status-bar-container'),
  // buttons
  startButton: $('.js-start-button'),
  restartButton: $('.js-restart-button'),
  submitButton: $('.js-submit-button'),
  nextButton: $('.js-next-button'),
  answersButton: $('.js-answers-button'),
  correct: $('.js-correct')  
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~ SUBMIT (USER INPUT TO STORE) ~~~~~~~~~~~~~~~~~~~~~~

function submitAnswer(questionIndex) {
  // read index # of selected answer from radio, submit to STORE as answer
  STORE.questions[STORE.currentQuestion].response = questionIndex;
  STORE.questions[STORE.currentQuestion].correct = (questionIndex === STORE.questions[STORE.currentQuestion].a) ? 1 : 0; 
  if (STORE.currentQuestion === (STORE.questions.length -1)){
    console.log("IT RAN"); 
     EL.nextButton.text("Finish");  
  }
  else {
    EL.nextButton.text("Next");
  }
  render(); 
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~ RENDERERS (OUT OF STORE TO EL) ~~~~~~~~~~~~~~~~~~~~~~

// select the next Q&A pair, render those (i.e. take data from store and push to HTML)
// status of Q&A pair may be ready-to-answer, or already answered and ready to click next
function renderQandA() {
  EL.question.text(STORE.questions[STORE.currentQuestion].q); // populates the h3 with the question 
  let allOptions = ''; 
  for(let i = 0; i < STORE.questions[STORE.currentQuestion].options.length; i++ ){
    let liStart = '';
    let liEnd = '';
    let liClass = ''; 
    if (STORE.questions[STORE.currentQuestion].response === null){
      liStart = `<input type="radio" name="js-radio" id="${i}" value=${i} role="radio" aria-checked="false"><label for="${i}">`;
      liEnd = '</label></input>';
      EL.options.removeClass("left-spacing"); 
    } else { 
      liClass = (STORE.questions[STORE.currentQuestion].a === i) ? 'class="correct"' : 'class="incorrect"';
      EL.options.addClass("left-spacing"); 
    }
    allOptions += `
        <li data-index='${i}' ${liClass}>
          ${liStart}${STORE.questions[STORE.currentQuestion].options[i]}${liEnd}
        </li>
    `; 
  }
  EL.options.html(allOptions); 
  // same thing with answers
  // include the index # on the actual radio input for answers
}

function renderStatusBar() {
  let html = '<div class="js-status-line-constant"></div>';
  let divWidth = 100 / STORE.questions.length; 
  // loop thru all questions
  for (let i=0; i<STORE.questions.length; i++) {
    let done = (STORE.questions[i].response === null) ? '' : 'doneIcon';
    let correct = (STORE.questions[i].correct === 1) ? 'correctIcon' : 'incorrectIcon';
    let current = (STORE.currentQuestion === i) ? 'currentIcon' : '';
    let icon = '<i class="fa" aria-hidden="true"></i>';
    if (correct === 'correctIcon') { 
      icon = '<i class="fa fa-check" aria-hidden="true"></i>';
    } else if (correct === 'incorrectIcon' && done === 'doneIcon') {
      icon =     '<i class="fa fa-times" aria-hidden="true"></i>';
    }
    if ( current !== '') {
      icon += '<div class="js-status-line"></div>';
    }
    // create one div with one dot
    html += `<div class="statusBarIcon-container" style="width:${divWidth}%;">
      <div class="statusBarIcon ${done} ${correct} ${current}">${icon}</div> 
    </div>`;
    // remember to put ${icon} back before </div> at end of line 99
  }
  EL.statusBar.html(html);

}

function renderEnd() {
  STORE.totalCorrect = 0; 
  for(let i = 0; i < STORE.questions.length; i++){
    STORE.totalCorrect += STORE.questions[i].correct; 
  } 
  const ratio = (STORE.totalCorrect)/(STORE.questions.length); 
  const finalScore = (ratio > 0.8) ? `Congratulations! You got ${STORE.totalCorrect} out of ${STORE.questions.length} correct!`: `You got ${STORE.totalCorrect} out of ${STORE.questions.length} correct. Keep studying!`;
  EL.finalScore.text(finalScore); 
  if (ratio === 1){
    EL.trophyContainer.html(`
      <img src="./trophy.png" alt="Trophy" class="trophy">
    `);
    EL.correct.addClass("hidden"); 
  }
  else {
    EL.correct.removeClass("hidden"); 
  }
}

function render1AnswerHtml(questionObj, counter){
  let correct = questionObj.correct === 1 ? '<i class="fa fa-check end-check" aria-hidden="true"></i>' : '<i class="fa fa-times end-times" aria-hidden="true"></i>' ;
  let html = `<h3 class='finalAnswers left'>${counter}. ${questionObj.q}</h3><div class="left"><ul class="left">`;
  for (let i=0; i<questionObj.options.length; i++) {
    let corrClass = (questionObj.a === i) ? 'correct' : 'incorrect' ;
    let myClass = (questionObj.response === i) ? 'mySelection' : '' ;
    let liClass = `class="${corrClass} ${myClass}"`;
    html += `
      <li data-index='${i}' ${liClass}>${questionObj.options[i]}</li>`;
  }
  html += `</ul>${correct}</div><BR>`;
  return html;
}

// populate HTML with all/select Q&A.  whichQs === all or incorrect, passed from button.
function renderAnswers(whichQs) {
  let answersHTML = '';
  for (let i=0; i<STORE.questions.length; i++) {
    if ( ( whichQs === 'incorrect' && STORE.questions[i].correct === 0 ) || whichQs === 'all') {
      answersHTML += render1AnswerHtml(STORE.questions[i], i + 1);   
    }
  }
  EL.answers.html(answersHTML);
}

// read from the store to see where we are
function render() {
  if (STORE.displayStatus === 'start') {
    EL.end.addClass('hidden');
    EL.questions.addClass('hidden'); 
    EL.start.removeClass('hidden');
    // if customization needed, insert here
  } else if (STORE.displayStatus === 'questions') {
    renderQandA();
    renderStatusBar();
    EL.start.addClass('hidden');
    EL.end.addClass('hidden');
    EL.questions.removeClass('hidden');
    if (STORE.questions[STORE.currentQuestion].response === null){ // if there is no response
      EL.nextButton.addClass('hidden'); 
      EL.submitButton.removeClass('hidden'); 
      EL.response.text(''); 
    } else {         // if there IS a response
      EL.nextButton.removeClass('hidden'); 
      EL.submitButton.addClass('hidden'); 
      if (STORE.questions[STORE.currentQuestion].response === STORE.questions[STORE.currentQuestion].a){
        EL.response.text('You got that one correct!'); // enhance this: change text to html & maniupulate classes
        EL.response.addClass('correct'); 
        EL.response.removeClass('incorrect'); 
      } else {
        EL.response.text('You did not get that question correct'); 
        EL.response.addClass('incorrect'); 
        EL.response.removeClass('correct'); 
      }
      // replace the radio buttons with a normal li
      // manipulate classes to graphically indicate right & wrong answers
    }
  } else if (STORE.displayStatus === 'end') {
    renderEnd();
    EL.start.addClass('hidden');
    EL.questions.addClass('hidden'); 
    EL.end.removeClass('hidden');
  } else {
    // do something, maybe reset store and got to start???
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~ EVENT LISTENER HANDLERS ~~~~~~~~~~~~~~~~~~~~~~

function handleStartButton(){
  EL.startButton.on('click', function(event){
    STORE.displayStatus = 'questions';
    render(); 
  });
}

function handleSubmitButton() {
  EL.submitButton.on('click', function(event){
    event.preventDefault()
    STORE.displayStatus = 'questions';
    const questionIndex = parseInt($('input[name="js-radio"]:checked').val(), 10);  
     if(isNaN(questionIndex)){
       alert("Please select an answer to the question before submitting"); 
     }
     else {    
      submitAnswer(questionIndex);
     }
  });
}

function handleRestartButton(){
  EL.restartButton.on('click', function(event){
    STORE.displayStatus = 'start';
    STORE.currentQuestion = 0;
    STORE.totalCorrect = 0;  
    for(let i = 0; i < STORE.questions.length; i++){
      STORE.questions[i].response = null;
      STORE.questions[i].correct = 0;  
    }
    render(); 
  });
}

function handleNextButton() {
  EL.nextButton.on('click', function(event){
    if ( STORE.currentQuestion < STORE.questions.length - 1 ) {
      STORE.displayStatus = 'questions';      
      STORE.currentQuestion ++;
    } else {
      STORE.displayStatus = 'end';      
    }
    render(); 
  });
}

function handleAnswersButton() {
  EL.answersButton.on('click', function(event){
    let whichQs = $(this).hasClass('all') ? 'all' : 'incorrect';
    renderAnswers(whichQs); 
  });
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~ DOCUMENT READY FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~

function applyEventListeners() {
  handleStartButton(); 
  handleSubmitButton();
  handleRestartButton();
  handleNextButton();
  handleAnswersButton();
}

$(render);
$(applyEventListeners);