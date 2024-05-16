# CTF Platform Using Monitoring in Grafana

## Downloading Code & Installing

```bash
git clone https://github.com/cybersaksham/Final_Year_Project
cd Final-Year-Project
npm --prefix ./frontend install
npm --prefix ./backend install
```

## Running docker images for grafana, mongodb, and elastic search

```bash
docker compose up -d
```

- Grafana will be running at http://localhost:3000
- MongoDb will be running at http://localhost:27017
- Elastic search will be running at http://localhost:9200

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

## Configure Grafana

Open http://localhost:3000 to connect to grafana.

### Login

- username: admin
- password: admin

### Elastic Search Database
