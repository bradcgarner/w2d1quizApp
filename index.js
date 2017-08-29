'use strict';

// this is where we will store ALL our data, no data saved in the DOM
const STORE = {
// need at least 5 questions
  displayStatus: 'start', // options are start, question, end
  currentQuestion: 0,
  totalCorrect: 0, 
  questions: [
    { q: 'a Q0', a: 2 , options: ['wrong', 'wrong', 'right', 'wrong'], response: null, correct: 0},
    { q: 'a Q1', a: 1 , options: ['wrong', 'right', 'wrong', 'wrong'], response: null, correct: 0}, 
  ]
};

// just list them all here, not jQ littered everywhere...
const EL = {
  // 3 main sections that we'll populate/render
  start: $('.js-start'), 
  questions: $('.js-questions'), 
  end: $('.js-end'),
  // other within sections
  question: $('.js-question'),
  options: $('.js-options'), 
  response: $('.js-form-response'),
  finalScore: $('.js-final-score'),
  trophyContainer: $('.js-trophy-container'), 
  // buttons
  startButton: $('.fa-play-circle'),
  restartButton: $('.js-restart-button'),
  submitButton: $('.js-submit-button'),
  nextButton: $('.js-next-button'),
};

function submitAnswer(questionIndex) {
  // read index # of selected answer from radio, submit to STORE as answer
  STORE.questions[STORE.currentQuestion].response = questionIndex;
  STORE.questions[STORE.currentQuestion].correct = (questionIndex === STORE.questions[STORE.currentQuestion].a) ? 1 : 0; 
  render(); 
}

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
      console.log(STORE.questions[STORE.currentQuestion].response); 
      liStart = `<input type="radio" name="js-radio" value=${i}>`;
      liEnd = `</input>`;
    } else { 
      liClass = (STORE.questions[STORE.currentQuestion].a === i) ? "class='correct'" : "class='incorrect'";
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

function renderAnswers() {
  STORE.totalCorrect = 0; 
  for(let i = 0; i < STORE.questions.length; i++){
    STORE.totalCorrect += STORE.questions[i].correct; 
  } 
  const ratio = (STORE.totalCorrect)/(STORE.questions.length); 
  console.log(ratio);
  const finalScore = (ratio > 0.8) ? `Congratulations! You got ${STORE.totalCorrect} out of ${STORE.questions.length} correct!`: `You got ${STORE.totalCorrect} out of ${STORE.questions.length} correct. Keep studying!`;
  EL.finalScore.text(finalScore); 
  if (ratio === 1){
    EL.trophyContainer.html(`
      <img src="./trophy.png" alt="Trophy" class="trophy">
    `);
  }

  // populate HTML with all the Q&A
  // we might hide this, and then just let the user decide to show
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
    EL.start.addClass('hidden');
    EL.end.addClass('hidden');
    EL.questions.removeClass('hidden');
    if (STORE.questions[STORE.currentQuestion].response === null){ // if there is no response
      EL.nextButton.addClass('hidden'); 
      EL.submitButton.removeClass('hidden'); 
      EL.response.text(""); 
    } else {         // if there IS a response
      EL.nextButton.removeClass('hidden'); 
      EL.submitButton.addClass('hidden'); 
      if (STORE.questions[STORE.currentQuestion].response === STORE.questions[STORE.currentQuestion].a){
        EL.response.text("You got that one correct!"); // enhance this: change text to html & maniupulate classes
      } else {
        EL.response.text("You did not get that question correct"); 
      }
      // replace the radio buttons with a normal li
      // manipulate classes to graphically indicate right & wrong answers
    }
  } else if (STORE.displayStatus === 'end') {
    renderAnswers();
    EL.start.addClass('hidden');
    EL.questions.addClass('hidden'); 
    EL.end.removeClass('hidden');
  } else {
    // do something, maybe reset store and got to start???
  }
}


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
    submitAnswer(questionIndex);
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

function applyEventListeners() {
  handleStartButton(); 
  handleSubmitButton();
  handleRestartButton();
  handleNextButton();
}

$(render);
$(applyEventListeners);


/*
div for start screen
general intro information
button to start quiz

div for question screen
status bar (indicate total # of Qs, # completed, # correct, # incorrect)
    to start, just show data (numbers)... graphics later...
    not active - user cannot skip around
show only 1 question at a time them
div for question (re-render with js)  .text()
div for multiple choice (js)
   required
   handle as a form
   ARIA: must be able to enter / navigate with keyboard
Buttons:
   submit button:
      shows the correct answer / compares with the user's answer
      show the next button
   next button: 
      hidden if question not submitted
      goes to next question, or end screen if last question
   re-start button: 
      clear store (none answered, etc., start over)
      on render go back to start screen

div for end screen (show completed quiz)
final score (total # of Qs, # completed, # correct, # incorrect)
button to show or hide list of all questions with answers
   or only the incorrect questions & answers
finish button (same as question screen's re-start button)*/