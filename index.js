'use strict';

// this is where we will store ALL our data, no data saved in the DOM
const STORE = {
// need at least 5 questions
  displayStatus: 'start', // options are start, question, end
  currentQuestion: 0,
  questions: [
    { q: 'a Q', a: 3 , options: ['wrong', 'wrong', 'right', 'wrong'], response: null},
    { q: 'a Q', a: 2 , options: ['wrong', 'right', 'wrong', 'wrong'], response: null}, 
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
  // buttons
  startButton: $('.fa-play-circle'),
  // add restart button
  // add submit button
  // add next button
};

function submitAnswer() {
  // read index # of selected answer from radio, submit to STORE as answer
  // render
}

// select the next Q&A pair, render those (i.e. take data from store and push to HTML)
// status of Q&A pair may be ready-to-answer, or already answered and ready to click next
function renderQandA() {
  // read from the store to see where we are, e.g. 10 Qs, 0 answered, so we start on question 0 (index #)
  // get Q by index # and html.text() to write question
  EL.question.text(STORE.questions[STORE.currentQuestion]);
  // same thing with answers
  // include the index # on the actual radio input for answers

}

function renderAnswers() {
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

function applyEventListeners() {
  handleStartButton(); 
  // re-start button (only 1 of those)
  // submit button (read current Q# from STORE, submit answer from DOM)
  // next button
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