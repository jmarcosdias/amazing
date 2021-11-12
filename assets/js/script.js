const firstInstructionToTheUser = 'Memorize this problem';
const operators = ['&plus;', '&minus;', '&times;', '&divide;'];
const maxOperand = 1000;

// Wait for the initial HTML document to load and then start the game
document.addEventListener("DOMContentLoaded", function() {
    startGame();
});

/**
 * Start a new game
 *
 * 1) The first instruction is presented to the user
 * 2) A random problem is presented to the user
 *
 * not yet implemented:
 * At this point nothing happens until the user presses the btn-done 
 * so that the first round will start.
 */
 function startGame() {
    document.getElementById("instruction-to-the-user").textContent = firstInstructionToTheUser;
    document.getElementById("random-problem").innerHTML = createRandomProblem();
 }

 /**
 * Create a random problem
 * 
 * 1) Set local variables for the operands and operator
 * 2) Make sure operand1 > operand2 for the subtraction and division
 * 3) Return a string with the random problem
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
      
      // Return a string with the random problem
      return `${operand1} ${operators[operator]} ${operand2}`;        
 }


