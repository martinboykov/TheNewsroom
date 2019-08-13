# TheNewsrom
TheNewsroom is MEAN Stack Web Application for creation and delivery the latest news in different areas of life: local, worldwide, sports, movies, music, cars, technology and more. It offers functionalities such as: edditing categories, subcategories, posts, managing the roles of the users, etc.
#### Demo: https://thenewsroom-mean-app.appspot.com
#### Video Preview - Desktop: https://www.youtube.com/watch?v=q-o8NgFBtDA
[![https://www.youtube.com/watch?v=q-o8NgFBtDA](/assets/images/functionalities/Desktop_thumbnail.jpg?raw=true)](https://www.youtube.com/watch?v=q-o8NgFBtDA)
#### Video Preview - Mobile: https://www.youtube.com/watch?v=q-o8NgFBtDA
[![https://www.youtube.com/watch?v=333t9ANeLNQ](/assets/images/functionalities/Mobile_thumbnail.jpg?raw=true)](https://www.youtube.com/watch?v=333t9ANeLNQ)

## Table of contents
 - [Features](##features)
   - [_Menu_](###menu)
   - [_Submenu_](###submenu)
   - [_Post-Details Page_](###post-details-page)
   - [_Edit Post_](###edit-post)
   - [_Searchbar_](###searchbar)
   - [_Aside menu_](###aside-menu)
   - [_Authentication/Authorization_](###authenticationauthorization)
   - [_Admin Control Panel_](###admin-control-panel)
 - [Architecture](##architecture)
 - [Technologies](##technologies)
 - [Testing](##testing)
 - [Build Process](##build-process)
   - [API-keys](###api-keys)
 - [Team](##team)

## Features

All the functionalities of the application are accessible on both mobile and desktop.

### _Menu_
The posts are organized in different categories and subcategories. A category may or may not have subcategories. On desktop version the subcategories are accessible via dropdown list under their main category. On mobile version there is a hamburger menu available in the top left corner.

### _Submenu_
There is a submenu under the main menu, where you can find the current path of the route in the webpage you are on.

### _Post-Details Page_
For every post there is detail page available, where can be found its full content, related pots or share it on social media (Facebook, twitter or via email) and write a comment about (for registered users with writing privileges).

### _Edit Post_
Users with writer and/or admin privaleges can create new or update old post.

### _Searchbar_
With keyword can be found specific post or posts by tag, title, author and/or content.

### _Aside menu_
There is Aside sticky menu, positioned on the right side below header for desktops and centered below header for mobile. Aside has three sections: Latest, Popular and Commented., which are showing correspondingly 6 of the latest, 6 of the most popular and 6 of the most commented posts in the last chosen time period (last day).

For desktop version the list of posts is controlled by pagination (15 posts per page), while for Mobile with Infiniti scroll.

### _Authentication/Authorization_
Users that are not authenticated can only view posts. Users can authenticate themselves in signup/login pages.

After successful authentication the user will be authorized with specific functionalities, dependent on the Roles they have:

- Reader – can view posts and write comments
- Writer – Reader that can also write new Posts or edit his own
- Admin – can do all

Authenticated users may have no role (users that abuse the Code of Conduct). They will have the same authorization as the unauthenticated users.

Each user can have several roles. The roles can be assigned only by the admin via control panel (accessible and visible only for admin). There can be several admins.

### _Admin Control Panel_
The Admin can also perform CRUD operations from the control panel on categories/ subcategories, modify their visibility, change their order of appearance, look into their corresponding posts.


## Architecture
<img src="./assets/images/Architecture_v1.png?raw=true" alt="Application Architecture" title="Application Architecture" width="800"/>
<!-- [Application Architecture](/assets/images/Architecture_v1.png?raw=true "Application Architecture") -->
<!-- <img src="./assets/images/Architecture_v1.png?raw=true" alt="Application Architecture" title="Application Architecture"  style="width:200px;"/> -->


## Technologies

The core of the application is build with MEAN stack, which includes:

* MongoDB acts as the database for your application, in case you need to persist data. It's where records are stored. MongoDB is a document-oriented NoSQL database, that stores data in a JSON-like format and allows the user to perform SQL-like queries against it.
* ExpressJS is a web framework for NodeJS, commonly used as a backend for web apps in this stack. In our case we are going to use Loopback (instead of just ExpressJS), which extends and builds on top of Express to ease the creation of RESTful APIs.
* Angular is the client side web framework.
* NodeJS powers express and will be the layer where our server will run.

## Testing

RESTful API is tested with Postman.

## Build-Process

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

### API-keys

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
Name: Martin Martinov <br/>
Email: martinboykov@mail.bg <br/>
Github: https://github.com/martinboykov
