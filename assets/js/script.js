const firstInstructionToUser = 'Memorize the result of the following problem';
const roundInstructionToUser = 'Is the result of the following problem lower, same as or higher than the previous?';
const operators = ['&plus;', '&minus;', '&times;', '&divide;'];
const maxOperand = 10;
const lastRoundNumber = 3;
let currentResult;
let previousResult;
let currentRoundNumber = 0;

// Wait for the initial HTML document to load, add the event listeners and start the game
document.addEventListener('DOMContentLoaded', function () {
    let buttons = [
        document.getElementById('btn-done'),
        document.getElementById('btn-lower'),
        document.getElementById('btn-same'),
        document.getElementById('btn-higher'),
    ]; 

    for (let button of buttons) {
        button.addEventListener('click', function () {
            document.getElementById('instruction-to-the-user').textContent = 'Okay you pressed a button but for now I am stupid';
            document.getElementById('lower-same-higher-area').style.visibility = 'hidden';
            document.getElementById('btn-done').style.visibility = 'hidden';
            document.getElementById('random-problem').style.visibility = 'hidden';

            setTimeout(function() {
                currentRoundNumber++;
                if (currentRoundNumber < lastRoundNumber) {
                    startRound(currentRoundNumber);
                }
                else {
                    endGame();
                }
            }, 2000);
        })
    }

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
    document.getElementById('lower-same-higher-area').style.visibility = 'hidden';
    document.getElementById('btn-done').style.visibility = 'hidden';
    document.getElementById('random-problem').style.visibility = 'hidden';

    document.getElementById('instruction-to-the-user').textContent = firstInstructionToUser;

    setTimeout(function() {
        document.getElementById('random-problem').innerHTML = createRandomProblem();
        document.getElementById('random-problem').style.visibility = 'visible';
        document.getElementById('btn-done').style.visibility = 'visible';
    }, 2000);
}

/**
 * Start a round
 * 
 */
function startRound(roundNumber) {

    previousResult = currentResult;
    document.getElementById('lower-same-higher-area').style.visibility = 'hidden';
    document.getElementById('btn-done').style.visibility = 'hidden';
    document.getElementById('random-problem').style.visibility = 'hidden';

    document.getElementById('instruction-to-the-user').textContent = roundInstructionToUser;
    
    setTimeout(function() {
       document.getElementById('random-problem').innerHTML = createRandomProblem();
       document.getElementById('random-problem').style.visibility = 'visible';
       document.getElementById('lower-same-higher-area').style.visibility = 'visible';
    }, 2000);
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
 * 3) Set the current result value which is a global variable
 * 4) Return a string with the random problem
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

    // Set the current result value which is a global variable    
    setCurrentResult(operand1, operator, operand2);

    console.log('previousResult=' + previousResult);
    console.log('currentResult=' + currentResult);
    console.log('currentRoundNumber=' + currentRoundNumber);

    // Return a string with the random problem
    return `${operand1} ${operators[operator]} ${operand2}`;
}

/**
 * endGame()
 * 
 * 
 */
function endGame() {
    document.getElementById('instruction-to-the-user').textContent = 'Game Over';
    currentResult = undefined;
    previousResult = undefined;
}