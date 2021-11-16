// Constants
const firstInstructionToUser = 'Memorize the result of the following problem';
const roundInstructionToUser = 'Is the result of the following problem lower, same as or higher than the previous?';
const operators = ['&plus;', '&minus;', '&times;', '&divide;'];
const maxOperand = 10;
const numberOfRounds = 3;

// Global variables
let currentProblem;
let currentResult;
let previousProblem;
let previousResult;
let currentRoundNumber;
let initialTime;
let finalTime;
let score = 0;

// Wait for the initial HTML document to load, add the event listeners and start the game
document.addEventListener('DOMContentLoaded', function () {

    let buttons = [
        document.getElementById('btn-lower'),
        document.getElementById('btn-same'),
        document.getElementById('btn-higher'),
    ]; 

    for (let button of buttons) {
        button.addEventListener('click', function () {
            stopTiming();
            let userAnswer = button.id.substring(4);
            let answerIsCorrect = isAnswerCorrect(userAnswer);
            let infoToUser = `Your answer is ${answerIsCorrect?'Correct':'Incorrect'}.`;
            let pointsNow = 0;

            if (userAnswer === 'same') {
                userAnswer = 'same as';
            } else {
                userAnswer = userAnswer + ' than'
            }

            if (answerIsCorrect) {
                // The number of points earned in each round starts at 1 and is inversely proportional to the time taken to respond.
                pointsNow = Math.max(Math.round(10000/(finalTime - initialTime), 0), 1);
                score += pointsNow;
                document.getElementById('score').textContent = score;

                infoToUser += ` ${currentProblem} is ${userAnswer} ${previousProblem}.`;
                infoToUser += ` You answered in ${finalTime - initialTime} miliseconds.`;
            } else {
                infoToUser += ` ${currentProblem} is not ${userAnswer} ${previousProblem}.`
            }

            infoToUser += ` You scored ${pointsNow} point${pointsNow === 1 ? '':'s'} in this round.`;
            document.getElementById('information-to-the-user').innerHTML = infoToUser;
            document.getElementById('information-to-the-user').style.visibility = 'visible';
            
            document.getElementById('lower-same-higher-area').style.visibility = 'hidden';
            document.getElementById('instruction-to-the-user').style.visibility = 'hidden';
            document.getElementById('done').style.visibility = 'hidden';
            document.getElementById('random-problem').style.visibility = 'hidden';
            document.getElementById('ok').style.visibility = 'visible';
        })
    }

    document.getElementById('btn-done').addEventListener('click', function () {
        document.getElementById('done').style.visibility = 'hidden';
        currentRoundNumber++;
        startRound();
    });

    document.getElementById('btn-ok').addEventListener('click', function () {
        document.getElementById('ok').style.visibility = 'hidden';
        currentRoundNumber++;
        if (currentRoundNumber <= numberOfRounds) {
            startRound();
        }
        else {
            endGame();
        }
    });

    document.getElementById('btn-restart').addEventListener('click', function () {
        startGame();    
    });

    startGame();
});

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

    document.getElementById('lower-same-higher-area').style.visibility = 'hidden';
    document.getElementById('done').style.visibility = 'hidden';
    document.getElementById('ok').style.visibility = 'hidden';
    document.getElementById('restart').style.visibility = 'hidden';
    document.getElementById('random-problem').style.visibility = 'hidden';
    document.getElementById('information-to-the-user').style.visibility = 'hidden';
    document.getElementById('score-area').style.visibility = 'hidden';
    document.getElementById('round-area').style.visibility = 'hidden';

    document.getElementById('h1').innerHTML = 'Are you <em>Amazingly Fast</em> at solving math problems?';

    setTimeout(function() {
        document.getElementById('h1').innerHTML = 'Amazingly Fast';

        document.getElementById('instruction-to-the-user').textContent = firstInstructionToUser;
        document.getElementById('instruction-to-the-user').style.visibility = 'visible';
        document.getElementById('random-problem').innerHTML = createRandomProblem();
        document.getElementById('random-problem').style.visibility = 'visible';
        document.getElementById('done').style.visibility = 'visible';
     }, 2000);
    
}

/**
 * Start a round
 * 
 */
function startRound() {

    previousResult = currentResult;
    previousProblem = currentProblem;
    document.getElementById('lower-same-higher-area').style.visibility = 'hidden';
    document.getElementById('done').style.visibility = 'hidden';
    document.getElementById('ok').style.visibility = 'hidden';
    document.getElementById('random-problem').style.visibility = 'hidden';
    document.getElementById('information-to-the-user').style.visibility = 'hidden';

    document.getElementById('instruction-to-the-user').textContent = roundInstructionToUser;
    
    document.getElementById('score').textContent = score;
    document.getElementById('round').textContent = currentRoundNumber;
    document.getElementById('instruction-to-the-user').style.visibility = 'visible';
    document.getElementById('score-area').style.visibility = 'visible';
    document.getElementById('round-area').style.visibility = 'visible';

    setTimeout(function() {
       document.getElementById('random-problem').innerHTML = createRandomProblem();
       document.getElementById('random-problem').style.visibility = 'visible';
       document.getElementById('lower-same-higher-area').style.visibility = 'visible';
       startTiming();
    }, 2000);
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
    switch(answer) {
        case 'lower':
            return currentResult < previousResult;
        case 'higher':
            return currentResult > previousResult;
        default: // same
            return currentResult === previousResult;
    }
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
    currentProblem = `${operand1} ${operators[operator]} ${operand2}`

    // Set the current result value which is a global variable
    setCurrentResult(operand1, operator, operand2);

    // Return a string with the random problem
    return currentProblem;
}

/**
 * endGame()
 * 
 * 
 */
function endGame() {
    document.getElementById('information-to-the-user').textContent = 'Game Over';
    document.getElementById('information-to-the-user').style.visibility = 'visible';
    document.getElementById('restart').style.visibility = 'visible';
}