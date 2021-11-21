/*********************************************************************************************************************
  Amazingly Fast Game

  Overview
  --------

  There are 10 rounds. 
  
  Before the first round, a random math problem is presented to the user and the user is asked to memorize it.
  
  Each round another random math problem is presented and the user is asked to answer if the result of this problem 
  is lower, same as or higher than the result of the previous problem.

  Each incorrect answer scores 0 points.

  Each correct answer scores from 10 to 1000 points, depending on how faster it is given.
  
  10 point means the user tooks about 10 seconds or more to answer.

  1000 points means the answer was given in 100 miliseconds or less.

  Here is the formula to calculate the number of points each round, for a correct answer, with timeToAnswer given 
  in miliseconds: Math.max(Math.round(100000 / (Math.max(timeToAnswer, 100)), 0), 10).


  Developer Credit Notes
  ----------------------
  
  I have asked my friends in a WhatsApp group and one of them, named Chris Fawcett, came up with a suggestion.
  I took and adapted that suggestion to create the game. Thanks to Chris Fawcett for coming up with that first
  idea which I could turn into the Amazingly Fast math game.

  Some callback functions in this code are based on what I have learned with the Code Institute's Love Maths game.
  Thanks to the Code Institute and to my mentor Chris Quinn for the excellent training and the valuable advices 
  given along the mentor sessions.


  History
  -------

  Developer         Date         Comments
  ----------------  -----------  -------------------------------------------------------------------------------------
  Marcos Dias       21-NOV-2021  Initial creation

 *********************************************************************************************************************/


/*** Used by Jshint only *********************************************************************************************/
// jshint esversion: 6


/*** Global Variables ************************************************************************************************/

// This is the message that appears in the starting screen as a way to introduce the game
const startScreenMessage = 'Are you <em>Amazingly Fast</em> at solving math problems?';

// Instruction presented to the user before the first round.
const firstInstructionToUser = 'Memorize the result of the following problem';

// Instruction presented to the user in the beginning of each round.
const roundInstructionToUser = 'Is the following lower, same as or higher than the previous?';

// Array with the four operators (addition, subtraction, multiplication and division) used along the game.
const operators = ['&plus;', '&minus;', '&times;', '&divide;'];

// Maximum value for each operand. The minimum value is 1.
const maxOperand = 10;

// Number of rounds in the game
const numberOfRounds = 10;

// String with the current problem. This value changes randomly each round.
let currentProblem;

// Number with the result of currentProblem.
let currentResult;

// String with the previous problem. This value is copied from currentProblem each round.
let previousProblem;

// Number with the result of previousProblem. This value is copied from currentResult each round.
let previousResult;

// Number of the current round.
let currentRoundNumber;

// Initial time used to calculate the time to answer.
let initialTime;

// Final time used to calculate the time to answer.
let finalTime;

// Score of the game.
let score = 0;

// Wait for the initial HTML document to load, add the event listeners and start the game
document.addEventListener('DOMContentLoaded', function () {

    // Add listener for the btnYesClick callback function
    document.getElementById('btn-yes').addEventListener('click', function () {
        btnYesClick();
    });

    // Add listeners for the btnLowerSameHigherClick callback function
    document.getElementById('btn-lower').addEventListener('click', function () {
        btnLowerSameHigherClick('lower');
    });
    document.getElementById('btn-same').addEventListener('click', function () {
        btnLowerSameHigherClick('same');
    });
    document.getElementById('btn-higher').addEventListener('click', function () {
        btnLowerSameHigherClick('higher');
    });

    // Add listeners for the btnOkOrDoneClick callback function
    document.getElementById('btn-done').addEventListener('click', function () {
        btnOkOrDoneClick('container-done');
    });
    document.getElementById('btn-ok').addEventListener('click', function () {
        btnOkOrDoneClick('container-ok');
    });

    // Add listener for the playAgainClick callback function
    document.getElementById('btn-play-again').addEventListener('click', function () {
        playAgainClick();
    });

    // Start the Game
    startGame();
});

/*** Callback Functions **********************************************************************************************/

/**
 * Here the first instruction and the first random problem is presented to the user, before round 1.
 */
function btnYesClick() {
    // Hide unnecessary element
    document.getElementById('container-yes').style.display = 'none';

    // Fill the message to the user and the random problem
    document.getElementById('message-to-user').textContent = firstInstructionToUser;
    document.getElementById('random-problem').innerHTML = createRandomProblem();

    // Show required elements
    document.getElementById('container-message-to-user').style.display = 'block';
    document.getElementById('container-random-problem').style.display = 'block';
    document.getElementById('container-done').style.display = 'block';
}

/**
 * The user just answered so it is time to stop timing and process that answer.
 */
function btnLowerSameHigherClick(userAnswer) {
    stopTiming();
    processUserAnswer(userAnswer);
}

/**
 * Let's hide that OK or Done button and start a round.
 */
function btnOkOrDoneClick(okOrDone) {
    document.getElementById(okOrDone).style.display = 'none';
    startRound();
}

/**
 * Let's refresh this page to start a new game
 */
 function playAgainClick() {
    location.reload();
}

/*** Other Functions *************************************************************************************************/

/**
 * Start a new game
 *
 * * The first instruction is presented to the user
 * * A random problem is presented to the user
 * * Nothing else happens until the user presses the btn-done
 * * When the user presses btn-done, its call back method will start the first round
 */
function startGame() {
    currentRoundNumber = 0;
    currentProblem = undefined;
    currentResult = undefined;
    previousProblem = undefined;
    previousResult = undefined;
    score = 0;

    document.getElementById('container-lower-same-higher').style.display = 'none';
    document.getElementById('container-done').style.display = 'none';
    document.getElementById('container-ok').style.display = 'none';
    document.getElementById('container-play-again').style.display = 'none';
    document.getElementById('container-random-problem').style.display = 'none';
    document.getElementById('container-message-to-user').style.display = 'none';
    document.getElementById('container-score').style.display = 'none';
    document.getElementById('container-round').style.display = 'none';

    document.getElementById('message-to-user').innerHTML = startScreenMessage;
    document.getElementById('container-message-to-user').style.display = 'block';
}

/**
 * Set the current result
 * 
 * Receives the current operands and the operator an then calculates 
 * the current result, saving it in a global variable
 * 
 * @param {number} operand1 - first operand
 * @param {number} operator - operator (0=plus, 1=minus, 2=times, 3=divide)
 * @param {number} operand2 - second operand
 */
 function setCurrentResult(operand1, operator, operand2) {
    switch (operator) {
        case 0:
            currentResult = operand1 + operand2;
            break;
        case 1:
            currentResult = operand1 - operand2;
            break;
        case 2:
            currentResult = operand1 * operand2;
            break;
        default:
            currentResult = operand1 / operand2;
    }
}

/**
 * Create a random problem
 * 
 * 1) Set local variables for the operands and operator
 * 2) Make sure operand1 > operand2 for the subtraction and division
 * 3) Set the current problem value which is a global variable
 * 4) Set the current result value which is a global variable
 * 5) Return a string with the random problem
 */
function createRandomProblem() {

    // Set local variables for the operands and operator
    let operand1 = Math.floor(Math.random() * maxOperand) + 1;
    let operator = Math.floor(Math.random() * 4);
    let operand2 = Math.floor(Math.random() * maxOperand) + 1;

    // For the subtraction and division, make sure operand1 is greather than operand2
    if (((operator === 1) || (operator === 3)) && (operand1 < operand2)) {
        [operand1, operand2] = [operand2, operand1];
    }

    // Set the current problem value which is a global variable
    currentProblem = `${operand1} ${operators[operator]} ${operand2}`;

    // Set the current result value which is a global variable
    setCurrentResult(operand1, operator, operand2);

    // Return a string with the random problem
    return currentProblem;
}

/**
 * Start a round
 * 
 */
function startRound() {

    currentRoundNumber++;
    if (currentRoundNumber > numberOfRounds) {
        endGame();
        return;
    }

    previousResult = currentResult;
    previousProblem = currentProblem;
    document.getElementById('container-lower-same-higher').style.display = 'none';
    document.getElementById('container-done').style.display = 'none';
    document.getElementById('container-ok').style.display = 'none';
    document.getElementById('container-message-to-user').style.display = 'none';

    document.getElementById('message-to-user').textContent = roundInstructionToUser;
    document.getElementById('random-problem').textContent = '?';

    document.getElementById('btn-lower').disabled = true;
    document.getElementById('btn-same').disabled = true;
    document.getElementById('btn-higher').disabled = true;

    document.getElementById('score').textContent = score;
    document.getElementById('round').innerHTML = `${currentRoundNumber} of ${numberOfRounds}`;
    document.getElementById('container-message-to-user').style.display = 'block';
    document.getElementById('container-random-problem').style.display = 'block';   
    document.getElementById('container-lower-same-higher').style.display = 'block'; 
    document.getElementById('container-score').style.display = 'block';
    document.getElementById('container-round').style.display = 'block';

    setTimeout(function () {
        document.getElementById('random-problem').innerHTML = createRandomProblem();
        document.getElementById('btn-lower').disabled = false;
        document.getElementById('btn-same').disabled = false;
        document.getElementById('btn-higher').disabled = false;
        startTiming();
    }, 3000);
}

/**
 * Start counting the time an answer takes to be answered
 * 
 */
function startTiming() {
    initialTime = new Date().getTime();
}

/**
 * Stop counting the time an answer takes to be answered
 * 
 */
function stopTiming() {
    finalTime = new Date().getTime();
}

/**
 * Check if the answer is correct
 * 
 */
function isAnswerCorrect(answer) {
    switch (answer) {
        case 'lower':
            return currentResult < previousResult;
        case 'higher':
            return currentResult > previousResult;
        default: // same
            return currentResult === previousResult;
    }
}

function processUserAnswer(userAnswer) {
    // Total time in miliseconds the user took to answer
    let timeToAnswer = finalTime - initialTime; 

    let answerIsCorrect = isAnswerCorrect(userAnswer);

    // True if the user answered correctly in 100 miliseconds or less
    let amazinglyFast = answerIsCorrect && (timeToAnswer <= 100); 
    
    let infoToUser = `${amazinglyFast?'<em><strong><mark>Great!</mark></strong></em>': answerIsCorrect?'<em><strong><mark>Yes!</mark></strong></em>':'<em>Next time will be better</em>'}.<br><br>`;
    let pointsNow = 0;

    if (userAnswer === 'same') {
        userAnswer = 'same as';
    } else {
        userAnswer = userAnswer + ' than';
    }

    if (answerIsCorrect) {
        // The number of points earned in each round is inversely proportional to 
        // the time taken to respond and it ranges from 10 to 1000 points
        pointsNow = Math.max(Math.round(100000 / (Math.max(timeToAnswer, 100)), 0), 10);
        score += pointsNow;
        document.getElementById('score').textContent = score;

        let textTime = timeToAnswer>10000?'more than 10 seconds':`${timeToAnswer} miliseconds`;

        infoToUser += ` ${currentProblem} is ${userAnswer} ${previousProblem}.<br><br>`;
        infoToUser += `You answered ${amazinglyFast?'<em><strong><mark>Amazingly Fast</mark></strong></em>':''} in ${textTime}${amazinglyFast?'!!!':'.'}<br><br>`;
    } else {
        infoToUser += ` ${currentProblem} is not ${userAnswer} ${previousProblem}.<br><br>`;
    }

    infoToUser += ` You scored ${pointsNow} point${pointsNow === 1 ? '':'s'} in this round. ${amazinglyFast?'<br><br>Well done &#128077 &#128077 &#128077':pointsNow>0?'<br><br>Nice &#128077':''}`;
    document.getElementById('message-to-user').innerHTML = infoToUser;
    document.getElementById('message-to-user').style.display = 'block';

    document.getElementById('container-lower-same-higher').style.display = 'none';
    document.getElementById('container-done').style.display = 'none';
    document.getElementById('container-random-problem').style.display = 'none';
    document.getElementById('container-ok').style.display = 'block';
}

/**
 * endGame()
 * 
 * 
 */
function endGame() {
    document.getElementById('message-to-user').textContent = 'Game Over';
    document.getElementById('container-message-to-user').style.display = 'block';
    document.getElementById('container-play-again').style.display = 'block';

    setInterval(function() {
        let scoreContainer = document.getElementById('container-score');

        scoreContainer.style.color = scoreContainer.style.color === 'blue' ? 'orange': 'blue';
        scoreContainer.style.borderColor = scoreContainer.style.color;
    }, 100);
}

