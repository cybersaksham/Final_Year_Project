# CTF Platform Using Monitoring in Grafana

## Downloading Code & Installing

```bash
git clone https://github.com/cybersaksham/Final_Year_Project
cd Final_Year_Project
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

## Configure Grafana

Open http://localhost:3000 to connect to grafana.

### Login

- username: admin
- password: admin

### Elastic Search Database

- Run following command in terminal

```bash
docker inspect --format '{{ .NetworkSettings.Networks.final_year_project_default.Gateway }}' elasticsearch
```

- This will print gateway address of where docker is running.
- Go to http://localhost:3000/connections/datasources
- Click on the elastic search datasource created already there named `es-ctf`
- Put `http://{Gateway_IP}:9200` in URl field and hit save button.
- Now we are ready to see the data in dashboards.

## Running Frontend

- In the root folder of repository run following:

```bash
cd frontend
npm run dev
```

- Go to http://localhost:3001 to view the frontend

## Running Backend

- In the root folder of repository run following:

```bash
cd backend
nodemon app.js
```

- Backend will be up at http://localhost:5500
