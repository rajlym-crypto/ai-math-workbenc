# AI Math Workbench — Individual Assignment Report

## Purpose

AI Math Workbench is a responsive educational web application that uses a large language model to adapt a mathematical concept into three difficulty levels. It demonstrates differentiated instruction: learners study the same core concept, but the amount of guidance and reasoning required changes with their level.

## Topic and user interaction

The user selects quadratic equations, the Pythagorean theorem, or derivatives. They can optionally provide a specific core task and choose English or Russian. After selecting **Generate 3 levels**, the application requests structured content from Gemini. The learner switches between Foundation, Standard, and Advanced tabs and can reveal a tailored hint or a worked solution.

## AI integration and prompt design

The backend sends a prompt to the Gemini API and requests a JSON response with three objects: `level1`, `level2`, and `level3`. Each object must contain `problem`, `hint`, and `solution`. The prompt asks the model to keep all versions connected to the same mathematical concept and to check mathematical correctness.

- **Foundation:** simpler context or numbers, guided steps, and a direct hint. This reduces cognitive load and supports learners who need scaffolding.
- **Standard:** grade-level independent problem solving with a strategic hint that does not reveal the complete answer.
- **Advanced:** a multi-step extension, proof, or realistic application that requires deeper reasoning.

The frontend validates the response structure before displaying it. Hints and solutions are hidden initially to encourage learners to attempt the problem before viewing support.

## Technology and responsible use

The interface uses HTML, CSS, and vanilla JavaScript. A Vercel serverless function calls the Gemini API. The API key is stored as a Vercel environment variable rather than in browser code, reducing the risk of exposing credentials in the public repository. The application displays errors when the API request fails.

AI-generated mathematical content can still contain mistakes. Therefore, generated solutions should be checked by a teacher or learner before being used for grading or formal assessment.

## Evaluation plan

Test each topic, both language settings, and all three levels. Check that Foundation is more scaffolded than Standard, Advanced requires more reasoning, and every hint and solution corresponds to its problem. Also test missing API configuration and invalid API-key errors.

**Live website:** Add the deployed Vercel URL after publishing.  
**Source code:** Add the public GitHub repository URL after publishing.
