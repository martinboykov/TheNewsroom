# TheNewsRoom

Website for the latest news: ✓ local, ✓ world, ✓ sports, ✓ movies, ✓ music, ✓ cars and ✓ technology.

#### Demo: <https://thenewsroom-mean-app.appspot.com>

## Table of Contents

* Introduction
* Demo
* Features
* Technologies
* Testing
* Build Process
* Team

## Introduction

TheNewsroom is a web app for creation and delivering the latest news in different areas of life: local, worldwide, sports, movies, music, cars, technology and more. It offers capabilities to administrate the website by assigning roles to the users, managing categories, subcategories and posts.

## Features
The application can be viewed on both mobile and desktop

## Architecture

![Alt text](/assets/images/Architecture_v1.png?raw=true "Application Architecture")

## Technologies

The core of the application is build with MEAN stack, which includes:

* MongoDB acts as the database for your application, in case you need to persist data. It's where records are stored. MongoDB is a document-oriented NoSQL database, that stores data in a JSON-like format and allows the user to perform SQL-like queries against it.
* ExpressJS is a web framework for NodeJS, commonly used as a backend for web apps in this stack. In our case we are going to use Loopback (instead of just ExpressJS), which extends and builds on top of Express to ease the creation of RESTful APIs.
* Angular is the client side web framework.
* NodeJS powers express and will be the layer where our server will run.

## Testing

RESTful API is tested with Postman.

## Build Process

1. Install dependencies for frontend with `npm install`
2. Go to folder `mean-app/backend` and install dependencies for backend with `npm install`
3. Provide the required [API keys](##API-keys "Go to API keys").
4. For frontend either create new environment file - environment.staging.ts, where provide the API key for the Slack Webhook, other provide the API key for the Slack Webhook directly in the environment files: environment.prod.ts, environment.ts (dont forget to remove the import of SLACK_WEBHOOK)

* Development:

  + start dev-server with `npm run server:dev`
  + start angular dev-server with `ng serve`

* Production:

  + depends on how and where you choose to host the app: One-App-Deployment (Nodejs server and Angular app are hosted together) or Two-App-Deployment (Nodejs server and Angular app are hosted separetley)
  + compile the Angular app with output directory - dist with either `ng build --prod` , other `ng build--configuration=staging` , depending on how is provided the Slack Webhook API key

## API-keys

1. Backend
    - Database - MongoDB: `MONGO_ATLAS_USER_NAME` , `MONGO_ATLAS_PASSWORD`
    - Cache - Redis:
      - Development - `REDIS_HOST_IP` , `REDIS_HOST_PORT`
      - Production - depending on the provider (Redis Heroku - `REDIS_URL` , Redis Labs - `REDISCLOUD_URL` )
    - JSON Web Token (JWT): `JWT_SECRET`

    - Monitoring - New Relic: `NEW_RELIC_LICENSE_KEY`
    - MongoDB: `MONGO_ATLAS_USER_NAME` , `MONGO_ATLAS_PASSWORD`

2.  Frontend
    - Errors and Exceptions - Slack: `SLACK_WEBHOOK`

## Team

Martin Martinov: https://github.com/martinboykov

