# Kordon | Elasticsearch Metric Notifier
Kordon is simply aimed at having capture critical metrics, which is above your defined thresholds, and send alert(s) to slack channel. These critical metrics are cluster health status, CPU percentages of each node in cluster, JVM memory percentage of each node in cluster, indexing throttle status of each node in cluster. Configurations such as thresholds, slack webhook and so forth are stored in Couchbase as document that is consisting of key-value pair if any couchbase host is existing, default configurations will be set and configurations will be refreshed in every 3 minutes.

***Before running application***, please make sure to have your configurations set correctly. Configurations are found in ```src/application.ts```. Configurations are customizable based on your settings

### Getting Started

### Step 1: Install NodeJS & NPM

[NodeJS & NPM](https://nodejs.org/en/download/)

### Step 2: Get project

Clone this repository 
```https://github.com/daidorian09/kordon.git```

### Step 3: Add global dependencies

```bash
npm i -g tsc ts-node ts-mocha tslint nodemon
```

### Step 4: Add local dependencies

```bash
npm i -D
```

### Step 5: Run in dev environment

```bash
npm run start:dev
```

### Step 6: Check readiness and liveness endpoints

```bash
Open browser and go to http://localhost:7001/healthcheck/liveness
```

### Step 7: Build for production

```bash
npm run build
```

### Step 8: Run in production environment

```bash
npm start
```

### Step 8(Optional): Build Docker image

```bash
docker build -t kordon:latest .
```

### Step 9(Optional): Run dockerized version

```bash
docker run -p 7001:7001 --name kordon-app kordon:latest
```


### Contributing
Any contributions or features are nicely welcomed.