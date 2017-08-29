'use strict';

// this is where we will store ALL our data, no data saved in the DOM
const STORE = {
  displayStatus: 'start', // options are start, question, end
  currentQuestion: 0,
  questions: [
    { q: 'a Q', a: 3 , options: ['wrong', 'wrong', 'right', 'wrong'], response: null},
    { q: 'a Q', a: 2 , options: ['wrong', 'right', 'wrong', 'wrong'], response: null}, 
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
  answers: $('.js-answers'),
  // buttons
  startButton: $('.fa-play-circle'),
  restartButton: $('.js-restart-button'),
  submitButton: $('.js-submit-button'),
  nextButton: $('.js-next-button'),
  answersButton: $('.js-answers-button'),  
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~ SUBMIT (USER INPUT TO STORE) ~~~~~~~~~~~~~~~~~~~~~~

function submitAnswer(questionIndex) {
  // read index # of selected answer from radio, submit to STORE as answer
  STORE.questions[STORE.currentQuestion].response = questionIndex; 
  // render 
  render(); 
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~ RENDERERS (OUT OF STORE TO EL) ~~~~~~~~~~~~~~~~~~~~~~

// select the next Q&A pair, render those (i.e. take data from store and push to HTML)
// status of Q&A pair may be ready-to-answer, or already answered and ready to click next
function renderQandA() {
  EL.question.text(STORE.questions[STORE.currentQuestion].q); // populates the h3 with the question 
  let allOptions = ''; 
  for(let i = 0; i < STORE.questions[STORE.currentQuestion].options.length; i++ ){
    allOptions += `
        <li data-index='${i}'>
          <input type="radio" name="js-radio" value=${i}>${STORE.questions[STORE.currentQuestion].options[i]}</input>
        </li>
    `; 
  }
  EL.options.html(allOptions);
}

function render1AnswerHtml(questionObj){
  let liClass = questionObj.correct === 1 ? ' class="correct"' : ' class="incorrect"' ;
  let html = `<h3 class='finalAnswers'>${questionObj.q}</h3><ul>`;
    for (let i=1; x<questionObj.options.length; i++) {
      html += `
      <li data-index='${i}' ${liClass}>${questionObj.options[i]}</li>`
    }
  html += '</ul><BR>';
  return html;
}

function renderAnswers(whichQs) {
  let answersHTML = '';
  for (let i=1; i<=STORE.questions.length; i++) {
    switch(true) {
    case  whichQs === 'incorrect' && STORE.questions[i].correct === 0:
    case whichQs === 'all':
      answersHTML += render1AnswerHtml(STORE.questions[i]); 
      break;
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
    EL.start.addClass('hidden');
    EL.end.addClass('hidden');
    EL.questions.removeClass('hidden');
    if (!STORE.questions[STORE.currentQuestion].response){
      EL.nextButton.addClass('hidden'); 
      EL.submitButton.removeClass('hidden'); 
      EL.response.text(''); 
    } else {
      EL.nextButton.removeClass('hidden'); 
      EL.submitButton.addClass('hidden'); 
      if (STORE.questions[STORE.currentQuestion].response === STORE.questions[STORE.currentQuestion].a){
        EL.response.text('You got that one correct!'); 
      } else {
        EL.response.text('You did not get that question correct'); 
      }
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
    submitAnswer(questionIndex);
  });
}

function handleRestartButton(){
  EL.restartButton.on('click', function(event){
    STORE.displayStatus = 'start';
    STORE.currentQuestion = 0; 
    for(let i = 0; i < STORE.questions.length; i++){
      STORE.questions[i].response = null; 
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