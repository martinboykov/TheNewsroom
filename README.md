# TheNewsRoom
Website for the latest news: ✓ local, ✓ world, ✓ sports, ✓ movies, ✓ music, ✓ cars and ✓ technology.

## Table of Contents
* Introduction
* Demo
* Features
* Technologies
* Build Process
* Team

## Introduction
## Demo - <https://thenewsroom-mean-app.appspot.com>
## Features
## Architecture
![picture alt](http://www.brightlightpictures.com/assets/images/portfolio/thethaw_header.jpg "Title is optional")

## Build Process
- install dependencies for frontend with `npm install`
- go to folder `mean-app/backend` and install dependencies for backend with `npm install`
- provide the required [API keys](##API-keys "Go to API keys")
      For frontend either create new environment file - environment.staging.ts, where provide the API key for the Slack Webhook, other provide the API key for the Slack Webhook directly in the environment files: environment.prod.ts, environment.ts (dont forget to remove the import of SLACK_WEBHOOK)

### Development:

  - start dev-server with `npm run server:dev`
  - start angular dev-server with `ng serve`

### Production:
  - depends on how and where you choose to host the app: One-App-Deployment (Nodejs server and Angular app are hosted together) or Two-App-Deployment (Nodejs server and Angular app are hosted separetley)
  - compile the Angular app with output directory - dist with either `ng build --prod`, other `ng build--configuration=staging`, depending on how is provided the Slack Webhook API key



## API-keys
* Backend
  * Database - MongoDB: `MONGO_ATLAS_USER_NAME`, `MONGO_ATLAS_PASSWORD`
  * Cache - Redis:
    * Development - `REDIS_HOST_IP`, `REDIS_HOST_PORT`
    * Production - depending on the provider (Redis Heroku - `REDIS_URL`, Redis Labs - `REDISCLOUD_URL`)
  * JSON Web Token (JWT): `JWT_SECRET`

  * Monitoring - New Relic: `NEW_RELIC_LICENSE_KEY`
  * MongoDB: `MONGO_ATLAS_USER_NAME`, `MONGO_ATLAS_PASSWORD`

* Frontend
  * Errors and Exceptions - Slack: `SLACK_WEBHOOK`

## Team
