// Get the eye elements
const leftEye = document.querySelector('.left-eye');
const rightEye = document.querySelector('.right-eye');

function blink() {
    leftEye.style.animation = 'blink-animation 2s infinite';
    rightEye.style.animation = 'blink-animation 2s infinite';
}





// Get input and button elements
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const responseContainer = document.querySelector('.response-container');
const pricing = {
    '1235 something street, deer park, ny': 50,
    '1234 somethings street, deer park, wa': 20,
    '214 e c street, deer park, wa' : 30,
};
const maxMessages = 3; // Maximum number of messages to display

// Array to store messages
const messages = [];

// Define interactions and responses using an object
const interactions = {
    'hi': 'Hello!, how are you doing today, if you need help type help.',
    'hello': 'Hi there! If you need help type help',
    'how are you': "I'm just a robot, but I'm doing fine!",
    'math': 'Sure, what calculation would you like me to perform?',
    'al': 'Alright, please provide the algebraic equation you want me to solve.',
    'help': 'Hi, I am a very basic ai robot I can help you with math, if you want to do a simple math equation then type: math (your equation Ie, 2*5/7) or if you would like to do simple linear algebra with one var Ie, 5x +6 = 30 then do: al (your equation) I can also tell you about a lawn care bussiness just tell me you want your lawn mowed.',
    'good' : 'Im glad to hear that',
    'bad' : 'Im sorry hope it gets better',
    'i want my lawn mowed' : 'Im glad to hear that please contact the owner There phone number is, 509-844-1842 or ask again but inlcude your address',
    'can you mow my lawn' : 'No but im sure that tylers lawn care would, please contact them by there phone number, 509-844-1842',
    'ok' : 'If you have any more questions or need assistance in the future, do not hesitate to reach out. Have a great day!',
    'thanks' : 'Your welcome',
    'blink' : 'im blinking',
    // Add more interactions and responses here

};

// Modify the Get Response Function to handle algebraic equations
function getResponse(userInput) {
    const lowerInput = userInput.toLowerCase();
    for (const interaction in interactions) {
        if (lowerInput.includes(interaction)) {
            if (interaction === 'math') {
                const expression = userInput.replace(/math/i, '').trim();
                if (expression) {
                    return calculateExpression(expression);
                } else {
                    return "Please provide a valid expression to calculate.";
                }
            } else if (interaction === 'al') {
                const equation = userInput.replace(/al/i, '').trim();
                if (equation) {
                    return solveLinearEquation(equation);
                } else {
                    return "Please provide a valid algebraic equation to solve.";
                }
           } else if (lowerInput.includes('lawn mowed') && lowerInput.includes('address')) {
            const address = extractAddress(userInput);
            if (address && pricing.hasOwnProperty(address)) {
                const cost = pricing[address];
                return `Great! The cost to mow your lawn at ${address} is $${cost}, if you want further assistance call 509-844-1842`;
            } else {
                return "I'm sorry, we don't have pricing information for that address, if you would like to add your address please call 509-844-1842";
            }
        } else if (lowerInput.includes('lawn mowed') && !lowerInput.includes('address'))  {

            return 'Im glad to hear that please contact the owner There phone number is, 509-844-1842 or ask again but inlcude your address.'
        }
        
        
        
        else {
            return interactions[interaction];
        }
    }
}

return "I'm sorry, I don't understand.";
}





// Function to handle user input and generate robot response
function handleUserInput() {
    const userText = userInput.value;
    if (userText.trim() !== '') {
        const userMessage = document.createElement('div');
        userMessage.classList.add('user-message');
        userMessage.textContent = `You: ${userText}`;

        const thinkingMessage = document.createElement('div');
        thinkingMessage.classList.add('robot-response', 'thinking');
        thinkingMessage.innerHTML = '<div class="loading">...</div>';
        responseContainer.appendChild(thinkingMessage);

        setTimeout(() => {
            const responseText = getResponse(userText);

            // Remove the thinking animation
            responseContainer.removeChild(thinkingMessage);

            const robotResponse = document.createElement('div');
            robotResponse.classList.add('robot-response');
            robotResponse.textContent = `${responseText}`;
            responseContainer.appendChild(robotResponse);

            // Check if the total number of messages exceeds the limit
            if (responseContainer.children.length > maxMessages * 0.5) {
                // Remove the oldest user message and its corresponding robot response
                responseContainer.removeChild(responseContainer.firstChild); // Remove user message
               
            }

            // Scroll to the latest response
            responseContainer.scrollTop = responseContainer.scrollHeight;
        }, 1325);

        userInput.value = '';
        userInput.focus();
    }
}


function extractAddress(input) {
    // Find the index of the phrase "my address is"
    const startIndex = input.indexOf("my address is");

    if (startIndex !== -1) {
        // Get the substring starting from "my address is"
        const addressSubstring = input.substring(startIndex + "my address is".length).trim();

        // Remove any leading or trailing punctuation
        const cleanedAddress = addressSubstring.replace(/^[,.\s]+|[,.\s]+$/g, '');

        return cleanedAddress;
    } else {
        return null; // Phrase not found
    }
}




function calculateExpression(expression) {
    try {
        return eval(expression);
    } catch (error) {
        return "Sorry, I couldn't evaluate that expression.";
    }
}

function solveLinearEquation(equation) {
    // Parse the equation to extract coefficients and constants
    const parts = equation.split('=');
    if (parts.length !== 2) {
        return "Invalid equation format. Please use 'ax + b = c' format.";
    }

    const leftSide = parts[0].trim();
    const rightSide = parts[1].trim();

    const leftCoefficients = parseCoefficients(leftSide);
    const rightConstant = parseFloat(rightSide);

    if (!leftCoefficients || isNaN(rightConstant)) {
        return "Invalid equation format. Please use 'ax + b = c' format.";
    }

    const coefficientX = leftCoefficients.coefficientX;
    const constantTerm = leftCoefficients.constantTerm;

    if (coefficientX === 0) {
        return "This is not a linear equation with one variable.";
    }

    // Solve for x
    const solution = (rightConstant - constantTerm) / coefficientX;
    return `The solution is x = ${solution}`;
}

function parseCoefficients(side) {
    const terms = side.split('+');
    let coefficientX = 0;
    let constantTerm = 0;

    for (const term of terms) {
        const trimmedTerm = term.trim();
        if (trimmedTerm.endsWith('x')) {
            const coefficient = parseFloat(trimmedTerm);
            if (!isNaN(coefficient)) {
                coefficientX += coefficient;
            } else {
                return null;
            }
        } else {
            const constant = parseFloat(trimmedTerm);
            if (!isNaN(constant)) {
                constantTerm += constant;
            } else {
                return null;
            }
        }
    }

    return { coefficientX, constantTerm };
}



submitBtn.addEventListener('click', handleUserInput);
