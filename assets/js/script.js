const firstMessageToThePlayer = 'Memorize this problem';
const operators = ['&plus;', '&minus;', '&times;', '&divide;'];
const maxOperand = 1000;

// Start the game when the initial HTML document has been completely loaded
document.addEventListener("DOMContentLoaded", function() {
    startGame();
});

/**
 * Start a new game
 */
 function startGame() {
    document.getElementById("message-to-the-player").textContent = firstMessageToThePlayer;
    document.getElementById("random-problem").innerHTML = createRandomProblem();
 }

 /**
 * Create the random problem
 */
  function createRandomProblem() {
      let operand1 = Math.floor(Math.random() * maxOperand) + 1;
      let operator = Math.floor(Math.random() * 4);
      let operand2 = Math.floor(Math.random() * maxOperand) + 1;

      // For the subtraction and division, make sure operand1 is greather than operand2
      if (((operator === 1) || (operator === 3)) && (operand1 < operand2)) {
          [operand1, operand2] = [operand2, operand1];
          console.log('worked');
      }

      return `${operand1} ${operators[operator]} ${operand2}`;        
 }


