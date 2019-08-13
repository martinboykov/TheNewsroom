# TheNewsRoom

Website for the latest news: ✓ local, ✓ world, ✓ sports, ✓ movies, ✓ music, ✓ cars and ✓ technology.

#### Demo: <https://thenewsroom-mean-app.appspot.com>
#### Video Preview: [![Short video of the app](/assets/images/functionalities/Menu_Desktop.jpg?raw=true)](http://www.youtube.com/watch?v=gFxWlPTRNGw)

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

All the functionalities of the application are accessible on both mobile and desktop.

The posts are organized in different categories and subcategories. A category may or may not have subcategories. On desktop version the subcategories are accessible via dropdown list under their main category. On mobile version there is a hamburger menu available in the top left corner.

There is a submenu under the main menu, where you can find the current path of the route in the webpage you are on.

For every post there is detail page available, where can be found its full content, related pots or share it on social media (Facebook, twitter or via email) and write a comment about (for registered users with writing privileges).

There is search functionality. With keyword can be found specific post or posts by tag, title, author and/or content .

There is Aside sticky menu, positioned on the right side below header for desktops and centered below header for mobile. Aside has three sections: Latest, Popular and Commented., which are showing correspondingly 6 of the latest, 6 of the most popular and 6 of the most commented posts in the last chosen time period (last day).
Desktop version

Mobile version


For desktop version the list of posts is controlled by pagination (15 posts per page), while for Mobile with Infiniti scroll.
Desktop version

Mobile version
Users that are not authenticated can only view posts. Users can authenticate themselves in signup/login pages.

After successful authentication the user will be authorized with specific functionalities, dependent on the Roles they have:
•	Reader – can view posts and write comments
•	Writer – Reader that can also write new Posts or edit his own
•	Admin – can do all

Authenticated users may have no role (users that abuse the Code of Conduct). They will have the same authorization as the unauthenticated users.
Each user can have several roles. The roles can be assigned only by the admin via control panel (accessible and visible only for admin). There can be several admins.

The Admin can also perform CRUD operations on categories/ subcategories, modify their visibility, change their order of appearance, look into their corresponding posts.





Writers and Admins can write new or edit old posts.



## Architecture

![Application Architecture](/assets/images/Architecture_v1.png?raw=true "Application Architecture")



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

