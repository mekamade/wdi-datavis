# World Bank Data Visualization : Installation Guide
Basic data visualization webapp for 'World Development Indicators' from the World Bank. The app is build in a Mac environment. Please use appropriate equivalent tools to `brew`, `curl`, `unzip` etc. if you

## Prerequisites
- [Docker](https://docs.docker.com/desktop/) (requires Docker Engine, Docker Compose, Docker CLI)
- Python 3 with virtual env installed : `python3 -m pip install --user virtualenv`

Manual Build:
- Node : `brew install node` (This will install `npm` as well)

## Downloading Data & Preprocessing
Preprocessing steps are described in the report.
- Please change the directory to `./datastore/`
- Download and unzip the dataset here, make sure the CSV files are stored in `.datastore/WDI_csv/`
- Download & extract manually if needed
```
cd datastore
curl -L -O https://databank.worldbank.org/data/download/WDI_csv.zip
unzip WDI_csv.zip
```
- Create a virtual environment & install all dependencies 
```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt 
```
- Run the preprocessing step
```
python preprocess.py
```
- This should create this directory with the processed CSVs: `.datastore/processed/`

## Method 1: Docker Compose 
```
docker-compose up --build
```

## Method 2: Manual (still uses Docker for the datastore)
### Datastore
- Change directory to `./datastore` and build the Docker Image
```
cd datastore
docker build -t postgres_img
```
- Run the Docker Image
```
docker run -d -p 5432:5432 postgres_img  
```
- Wait for the database to spin up. If a GUI database viewer is available, you can check the status on:
   - Address: `127.0.0.1:5432` or `localhost:5432`
   - Username: `postgres`
   - Password: `password`
### API
- Change directory to `./api` and create virtual environment with dependencies
```
cd api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt 
```
- Run the API Server
```
python app.py
```
- The API should be accessible at `localhost:5000/graphql` on browsers with an interface
### Frontend
- We need to run a proxy to access the API without CORS errors
- Change directory to `./frontend` and install dependencies
```
cd frontend
npm install
```
- We need to run a proxy to access the API without CORS errors, run this in an alternate terminal window
```
lcp --proxyUrl http://localhost:5000   
```
- Run the Web App
```
npm start
```
- The frontend should be accessible at `localhost:3000`

