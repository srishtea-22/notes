# Notes

A simple and minimal note-taking web app with color-coded notes, search functionality, and responsive UI.

## Tech Stack

- Frontend: Svelte + Tailwind CSS
- Mock API: MockAPI.io

## Features

- Create, edit, delete notes
- Assign color tags to notes
- Search notes by title/content
- Responsive design for mobile and desktop

## How to run 

```bash
git clone https://github.com/srishtea-22/notes.git
cd notes
npm install
touch .env
```

Add this to your .env:
```bash
VITE_API_BASE_URL=https://684dd33965ed087139173400.mockapi.io/api
```

Replace with your own MockAPI URL if needed
Create the resourse as follows - 
![App Screenshot](/screenshot.png)

Then run:
```bash
npm run dev
```