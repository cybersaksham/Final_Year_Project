# CTF Platform Using Monitoring in Grafana

## Downloading Code & Installing

```bash
git clone https://github.com/cybersaksham/Final-Year-Project
cd Final-Year-Project
npm --prefix ./frontend install
npm --prefix ./backend install
```

## Running docker images for grafana, mongodb, and elastic search

```bash
docker compose up -d
```

## Running Frontend

```bash
cd frontend
npm run dev
```

- Go to http://localhost:3001 to view the frontend

## Running Backend

```bash
cd backend
nodemon app.js
```

- Backend will be up at http://localhost:5500
