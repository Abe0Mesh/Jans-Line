# Jan's Line

A web app for checking how long the line is at popular venues near campus before you head out.

## What works today

- A mobile-friendly page listing each venue with its estimated wait time and a short description of the line.
- A button on each venue that adds time to its wait time, so the interface can be tried out.
- State is handled with React `useState`, so changes live in the browser only and reset on refresh.

Venue names, wait times, and descriptions are **hard-coded sample data** for now.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js (App Router) with React |
| Language | TypeScript |
| Styling | Tailwind CSS |

## Run it locally

Requires Node.js 20 or newer.

```bash
cd frontend
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Project structure

```text
frontend/
└── app/
    ├── page.tsx      # venue list, wait-time state, "add 5 mins" button
    ├── layout.tsx    # root layout and fonts
    └── globals.css   # Tailwind import and global styles
```


