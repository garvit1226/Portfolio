# Garbhit Maheshwari — Portfolio

A single-page, light-theme portfolio. Plain HTML/CSS/JS — no build tools,
no dependencies to install, works by just opening a file in a browser.

## 1. Run it locally

**Easiest way:** double-click `index.html` and it opens in your browser.

**Better way (so relative paths and any future fetch calls behave exactly
like they would online):** serve it with a tiny local server.

- If you have Python installed:
  ```
  cd portfolio
  python -m http.server 8000
  ```
  then open `http://localhost:8000` in your browser.

- If you use VS Code: install the "Live Server" extension, right-click
  `index.html`, and choose "Open with Live Server."

## 2. Add your photo

Save a square photo (at least 500×500px) as:

```
assets/photo.jpg
```

That's it — the site automatically detects it. Until you add it, a
placeholder with your initials shows instead.

## 3. Fill in the placeholders

Everything you need to personalize is marked with an HTML comment starting
`<!-- FILL:` inside `index.html`. Search the file for `FILL` to jump between
them. Here's the full list:

| Where | What to put there |
|---|---|
| Hero photo | `assets/photo.jpg` (see step 2) |
| About section | 2–4 sentences in your own voice — what drew you to ML, what you're looking for |
| PCOS Disease Detection → GitHub repo link | Your repo URL, e.g. `https://github.com/yourusername/pcos-detection` |
| PCOS Disease Detection → Live demo link | Your deployed app URL |
| Loan Approval Predictor → GitHub repo link | Your repo URL |
| Loan Approval Predictor → Live demo link | Your Render (or other host) URL |
| Employee Attendance & Workforce Analytics → GitHub repo link | Your repo URL |
| Criminal Network Analysis Platform → GitHub repo link | Your repo URL once it's public (or delete the link if the project isn't ready to show yet) |
| Contact → GitHub | Replace `href="#"` with your GitHub profile URL and update the visible text `github.com/yourusername` |
| Contact → LinkedIn | Replace `href="#"` with your LinkedIn profile URL and update the visible text `linkedin.com/in/yourusername` |
| Contact → Phone | Keep, edit, or delete the whole `.contact-method` block — your call on whether to make this public |

To edit link text, open `index.html` in any text editor, use Ctrl+F (or
Cmd+F) to find `FILL`, and update the line right below each comment.

## 4. Put it online (free options)

**GitHub Pages**
1. Create a new GitHub repo and push this folder to it.
2. In the repo, go to Settings → Pages → set the source branch to `main`
   and the folder to `/ (root)`.
3. Your site will be live at `https://yourusername.github.io/repo-name`.

**Netlify / Vercel**
1. Drag and drop this folder onto [netlify.com/drop](https://app.netlify.com/drop),
   or connect the GitHub repo on [vercel.com](https://vercel.com).
2. No build command needed — it's a static site.

## Structure

```
portfolio/
├── index.html        content and structure — this is where all "FILL" spots live
├── css/style.css      light theme, layout, animation styles
├── js/script.js       nav toggle, photo fallback, hero network animation
├── assets/            put photo.jpg here
└── README.md          this file
```

## Notes on the design

- Light theme with an indigo/teal accent pair, chosen to echo the
  graph-and-data feel of your ML/network projects.
- The only continuous animation is the drifting node network behind the
  hero — a nod to the graph-based project — kept subtle and low-opacity
  so it doesn't compete with the text. It automatically turns off if the
  visitor's OS has "reduce motion" enabled.
- Everything else uses small hover responses only (cards lifting slightly,
  links underlining) rather than scroll-triggered animations on every
  section, to keep the page feeling calm rather than busy.
