# AI Math Workbench

An AI-assisted differentiated-learning web app. It adapts one mathematical topic or user-provided core problem into three difficulty levels: Foundation, Standard, and Advanced. Each level includes a task, a tailored hint, and a worked solution.

## Features

- Responsive HTML/CSS/JavaScript interface
- Gemini API integration through a serverless backend
- Three levels with different scaffolding and reasoning demands
- English/Russian content option
- Optional user-provided core task
- Reveal/hide hints and solutions; copy a level
- API key stored as a server-side environment variable, not in frontend code

## Tech stack

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Vercel Serverless Function (`api/generate.js`)
- AI: Gemini API (`gemini-3.8-flash`)

## Run locally

This project uses a serverless endpoint, so opening `index.html` directly with `file://` will not run AI generation. Deploy it to Vercel or run the Vercel development server.

1. Install Node.js (LTS) and Vercel CLI.
2. In this project folder, run:

   ```bash
   npm install -g vercel
   vercel dev
   ```

3. Create a `.env.local` file (do not commit it) containing:

   ```text
   GEMINI_API_KEY=your_real_key_here
   ```

4. Restart `vercel dev` and open the local URL printed in the terminal.

## Deploy and obtain a live URL

1. Create a public GitHub repository named `ai-math-workbench`.
2. Upload these project files to the repository. Never upload `.env.local` or your real API key.
3. Sign in to [Vercel](https://vercel.com/) and choose **Add New → Project**.
4. Import the GitHub repository.
5. In **Project Settings → Environment Variables**, add:
   - Name: `GEMINI_API_KEY`
   - Value: your Gemini API key
   - Environments: Production, Preview, Development as needed
6. Deploy. Open the generated `https://...vercel.app` URL to test the app.
7. If you change the environment variable after deployment, redeploy the project.

## AI prompt and differentiation

The backend prompt requests exactly three JSON objects. Foundation receives simplified context, guided steps, and a direct hint. Standard receives a curriculum-level problem and a strategic hint. Advanced receives a multi-step extension, proof, or application requiring deeper reasoning. All three remain connected to the selected concept, and the model is instructed to provide mathematically correct step-by-step solutions.

## Security notes

- Keep `GEMINI_API_KEY` only in Vercel Environment Variables or an untracked local environment file.
- Never place a real key in `index.html`, screenshots, source control, or public issue trackers.
- Rotate the key if it is accidentally exposed.
- AI output can be wrong; verify solutions before using them for assessment.
- Consider adding rate limiting if you publish the demo publicly.

## Submission checklist

- [ ] Live Vercel URL tested
- [ ] Public GitHub repository link
- [ ] One-page report (`REPORT.md`)
- [ ] Test one topic in both languages
- [ ] Verify all three levels, hints, and solutions
