# **TheNewsrom**
TheNewsroom is MEAN Stack Web Application for creation and delivery the latest news in different areas of life: local, worldwide, sports, movies, music, cars, technology and more. It offers functionalities such as: edditing categories, subcategories, posts, managing the roles of the users, etc.
#### Demo: <a href="https://thenewsroom-mean-app.appspot.com" target="_blank">https://thenewsroom-mean-app.appspot.com</a>

#### Video Preview - Desktop: <a href="https://www.youtube.com/watch?v=0zFTRU7UpSM" target="_blank">https://www.youtube.com/watch?v=0zFTRU7UpSM</a>


[![https://www.youtube.com/watch?v=q-o8NgFBtDA](https://media.giphy.com/media/l57qdZsFax6lbEHQJ3/giphy.gif)](https://www.youtube.com/watch?v=q-o8NgFBtDA)

#### Video Preview - Mobile: <a href="https://www.youtube.com/watch?v=l40k-GeFjl8" target="_blank">https://www.youtube.com/watch?v=l40k-GeFjl8</a>

[![https://www.youtube.com/watch?v=333t9ANeLNQ](https://media.giphy.com/media/QVmoPvkXIXMFzromvD/giphy.gif)](https://www.youtube.com/watch?v=333t9ANeLNQ)

## **Table of contents**
 - [**Features**](#features)
   - [_Menu_](#menu)
   - [_Submenu_](###submenu)
   - [_Pagination_](#pagination)
   - [_Infinity-scroll_](#infinity-scroll)
   - [_Post Details Page_](#post-details-page)
   - [_Post Edit Page_](#post-edit-page)
   - [_Searchbar_](#searchbar)
   - [_Aside widget_](#aside-widget)
   - [_Authentication/Authorization_](#authenticationauthorization)
   - [_Admin Control Panel_](#admin-control-panel)
 - [**Architecture and technologies**](#architecture-and-technologies)
   - [_Heroku_](#heroku)
     - [_Latency_](#latency)
     - [_Clusters_](#clusters)
   - [_MongoDB_](#mongodb)
     - [_ODM_](#ODM)
     - [_Indexes_](#indexes)
     - [_Transactions_](#transactions)
   - [_Redis_](#redis)
   - [_Google Cloud Platform_](#google-cloud-platform)
   - [_Angular_](#angular)
 - [**Testing**](#testing)
 - [**Build Process**](#build-process)
   - [API-keys](#api-keys)
 - [**Team**](#team)

<a href="#features"></a>
## **Features**

All the functionalities of the application are accessible on both mobile and desktop.
<a href="#menu"></a>

### _Menu_
The posts are organized in different categories and subcategories. A category may or may not have subcategories. On desktop version the subcategories are accessible via dropdown list under their main category. On mobile version there is a hamburger menu available in the top left corner.

<a href="#submenu"></a>

### _Submenu_
There is a submenu under the main menu, where you can find the current path of the route in the webpage you are on.


<a href="#pagination"></a>

### _Pagination_
For Desktop version the list of posts is controlled by pagination (15 posts per page)
<!-- [![Pagination](https://media.giphy.com/media/Sr87YoFsopPALGjMCO/giphy.gif)] -->

<img src="https://media.giphy.com/media/Sr87YoFsopPALGjMCO/giphy.gif" alt="Pagination" title="Pagination"/>

<a href="#infinity-scroll"></a>

### _Infinity-scroll_
For Mobile version the list of posts is controlled by Infinity scroll (30 posts per load).

<img src="https://media.giphy.com/media/RlIK7Ay8UjnIzQY2w6/giphy.gif" alt="Infinity scroll" title="Infiniti scroll"/>

<a href="#post-details-page"></a>

### _Post-Details-Page_
For every post there is detail page available, where can be found its full content, related pots or share it on social media (Facebook, twitter or via email) and write a comment about (for registered users with writing privileges).

<img src="https://media.giphy.com/media/J5GneIukbmsiPha59P/giphy.gif" alt="Post-Details-Page preview" title="Post-Details-Page"/>

<a href="#post-edit-page"></a>

### _Post-Edit-Page_
Users with writer and/or admin privaleges can create new or update old posts.

<img src="https://media.giphy.com/media/llstrWBxbHprxlJg4O/giphy.gif" alt="Post-Edit-Page preview" title="Post-Edit-Page"/>

<a href="#searchbar"></a>

### _Searchbar_
With keywords can be found specific post or posts by tag, title, author and/or content.

<img src="https://media.giphy.com/media/h8azK6ZsgYBgfuCb1K/giphy.gif" alt="Post-Edit-Page preview" title="Post-Edit-Page"/>

<a href="#aside-widget"></a>

### _Aside widget_
The Aside sticky widget is positioned on the right side below header for desktops and in center below header for mobile. Aside has three sections: Latest, Popular and Commented, which are showing correspondingly 6 of the latest, 6 of the most popular and 6 of the most commented posts in the last chosen time period (preferably day, but currently month for demo purposes).

<img src="https://media.giphy.com/media/Y4Q7185r4hyFYjsk8m/giphy.gif" alt="Aside widget preview" title="Aside widget"/>

<a href="#authenticationauthorization"></a>

### _Authentication/Authorization_
Users can authenticate themselves in signup/login pages. Users that are not authenticated can read posts, but can't write comments.

<img src="https://media.giphy.com/media/QxkhnfoxLFZNc0Ow6K/giphy.gif" alt="Authentication preview" title="Authentication"/>

After successful authentication the user will be authorized with specific functionalities, dependent on the Roles they have:

- Reader – can view posts and write comments
- Writer – Reader that can also write new Posts or edit his own
- Admin – can do all

Authenticated users may have no role (users that abuse the Code of Conduct). They will have the same authorization as the unauthenticated users.

Each user can have several roles. The roles can be assigned only by the admin via control panel (accessible and visible only for admin). There can be several admins.

<a href="#admin-control-panel"></a>

### _Admin Control Panel_
The Admin can also perform CRUD operations from the control panel on categories/ subcategories, modify their visibility, change their order of appearance, look into their corresponding posts.

<img src="https://media.giphy.com/media/fqsqHaF3ezyXy7KMJP/giphy.gif" alt="Control Panel preview" title="Control Panel"/>

<a href="#architecture-and-technologies"></a>

## **Architecture and Technologies**
<img src="./assets/images/architecture/Architecture_v1.png?raw=true" alt="Application Architecture" title="Application Architecture" width=880/>
<!-- [Application Architecture](/assets/images/Architecture_v1.png?raw=true "Application Architecture") -->
<!-- <img src="./assets/images/Architecture_v1.png?raw=true" alt="Application Architecture" title="Application Architecture"  style="width:200px;"/> -->

The application is build with MEAN stack, which includes:

* MongoDB acts as the database for your application, in case you need to persist data. It's where records are stored. MongoDB is a document-oriented NoSQL database, that stores data in a JSON-like format and allows the user to perform SQL-like queries against it.
* ExpressJS is a web framework for NodeJS, commonly used as a backend for web apps in this stack. In our case we are going to use Loopback (instead of just ExpressJS), which extends and builds on top of Express to ease the creation of RESTful APIs.
* Angular is the client side web framework.
* NodeJS powers express and will be the layer where our server will run.

The Front-End and the Back-End of the MEAN stack app are deployed separately. Node.js server is deployed on Heroku Cloud App Platform, while Angular application is deployed on Google Cloud Platform. Post - Images are hosted on Google Cloud Storage.

<a href="#heroku"></a>

### _**Heroku**_
Heroku was chosen mainly for its free availability for Redis cloud services, accessible via add-on from Redis Labs. On both AWS and GCP caching services are paid. Heroku is considered as easier to use, in comparison to the complexity of AWS and GCP, and offers free plans that suits perfectly startups and educational purpose applications. For bigger enterprise applications where scale is from greater importance AWS and GCP would be the better choice from economical and technical stand point.

<a href="#latency"></a>

#### _Latency_
Heroku free tier is hosted on [Amazon's EC2 cloud-computing platform in Dublin, Ireland](https://check-host.net/ip-info?host=https://the-newsroom-mean-app.herokuapp.com "https://check-host.net/ip-info?host=https://the-newsroom-mean-app.herokuapp.com") (the only available free runtime for Europe). Having this under consideration the average latency from Sofia to our server in Dublin would be round [60ms](https://wondernetwork.com/pings/Dublin "https://wondernetwork.com/pings/Dublin").

MongoDB Database server is hosted on
[AWS EC2 in Frankfurt, Germany](https://docs.atlas.mongodb.com/reference/amazon-aws/#amazon-aws "https://docs.atlas.mongodb.com/reference/amazon-aws/#amazon-aws"). The AWS Inter-Region Latency between Instances in Dublin and Germany is close to [30ms](https://www.cloudping.co "https://www.cloudping.co").

As a result the total theorethical average latency should be round _**90ms**_ for every query served by MongoDB Database and _**60ms**_ for query served by Redis cache, as it is also hosted on AWS EC2 in Dublin, Ireland.

<a href="#clusters"></a>

#### _Clusters_
Heroku deployment is limited to the free account level with one dyno (lightweight Linux container) with 512 MB of RAM and 1-4 CPU cores, depending on the current availability.  To take advantage of all available CPU power and Increase the throughput in Node.js is used the Cluster Module via pm2 library. In order to remain under the memory limit the maximum amount of workers is set to three with memory buffer of near 200MB under low load condition, which should be considered as a good margin, without leaving a significant amount of unused memory on the dyno.

<img src="./assets/images/architecture/pm2.jpg?raw=true" alt="pm2 dashboard with three workers" title="pm2 dashboard with three workers" width=880/>

<a href="#mongodb"></a>

### _**MongoDB**_
As Database server is used MongoDB Atlas global cloud database service, managed on Google Cloud Platform. The free plan used offers 512 MB of Storage with replica set with three data bearing servers.
Of the data bearing nodes, one is deemed as primary node, while the other nodes are deemed secondary nodes.
The primary node receives all write operations. The secondaries replicate the primary and apply the operations to their data sets such that the secondaries’ data sets reflect the primary’s data set. If the primary is unavailable, an eligible secondary will hold an election to elect itself the new primary.

<img src="./assets/images/architecture/MongoDB_Replication.jpg?raw=true" alt="Replica set" title="Replica set" width=300/>

Sharding was not used, as it is unavailable for free tear and therefore won’t be discussed further.

<a href="#ODM"></a>

#### _ODM_
Mongoose is adopted as an ODM that provides a straightforward and schema-based solution to model your application data on top of MongoDB’s native drivers.

<a href="#indexes"></a>

#### _Indexes_
Through Mongoose are defined the following Indexes:
  - compound – 1 (posts)
  - text – 2 (posts, tags)
  - single – 5 (posts, tags, category, subcategory, users)

Indexes are key for achieving high performance in MongoDB, as they allow the database to search through less documents to satisfy a query. Without an index MongoDB has to scan through all of the documents in a collection to fulfill the query.

Indexing is not free because whenever we change anything in the document which affects the index, we’re going to have to update the index. It needs to be written on memory and finally on disk, which means that will slow down the writes operations. Considering the main focus of the current application is delivering information, hence read operations, indexing downside won’t be that big.
For 10000 stored posts the current database size reached 33MB, while the index size was round 15MB,  well below 512MB available, or near 480MB for caching and other tasks, like managing connections, handling aggregations and other.

 <a href="#transactions"></a>

#### _Transactions_
As we have a high read to write ratio, for Post schema design is adopted denormalizing strategy with “One-To-Many” Relationships with the main goal of securing faster reads. One major concern with denormalized data is the lack of atomic update. To tackle this problem is implemented two-phase commits with transaction-like semantics by using Fawn library for Node.js applications.

<a href="#redis"></a>

### _**Redis**_
Redis is used as a caching service, which provides a simple key/value data store that makes it possible to save and lookup information in close to O(1) time at a very high rate (theoretically > 100k ops/sec with a sub-millisecond latency). Redis cache is found at the level nearest to the front end, where it is implemented to return data quickly, if such is available, without taxing the MongoDB Database server. Only if the cache doesn’t have the requested data, the query is served by the MongoDB, and stored in Redis for next query.

<a href="#google-cloud-platform"></a>

### _**Google Cloud Platform**_
Angular application is deployed on GCP free tier with 5GB storage capacity and up to 50k ops/day using Google App Engine. App Engine is a fully managed, serverless platform for developing and hosting web applications at scale.

The instance is located in Eemshaven, Netherlands. The average latency to Sofia is [40ms]( https://wondernetwork.com/pings/Amsterdam "https://wondernetwork.com/pings/Amsterdam").

Images are hosted in separete Storage bucket with cache headers set to `Cache-Control: 'public, max-age=864000'`, which corresopnds to 10 days of cache storage. App static assets like Fonts and images are set to be stored for one year and css, js files to ten days.

<a href="#angular"></a>

### _**Angular**_
The Application is following the Style Guide and the Folders-by-feature structure. Several user defined modules were created, out of which one is preloaded: `PostDetailsModule` and three are lazy-loaded: `PostEditModule`, `AdminModule` and `AuthModule` following a custom-preloading strategy. The main focus was the application to become as "thin" as possible in order to achieve lower initial loading times.

Slack is used as error-logger in order to track down errors from users. Free plan offers 10k logs history, which is more than enought for our purposes.

<a href="#testing"></a>

## **Testing**

RESTful API is tested with Postman.

<a href="#build-processt"></a>

## **Build-Process**

1. Install dependencies for frontend with `npm install`
2. Go to folder `mean-app/backend` and install dependencies for backend with `npm install`
3. Provide the required [API keys](##API-keys "Go to API keys").
4. For frontend either create new environment file - environment.staging.ts, where provide the API key for the Slack Webhook, other provide the API key for the Slack Webhook directly in the environment files: environment.prod.ts, environment.ts (dont forget to remove the import of Slack Webhook)

* Development:

  + start dev-server with `npm run server:dev`
  + start angular dev-server with `ng serve`

* Production:

  + depends on how and where you choose to host the app: One-App-Deployment (Nodejs server and Angular app are hosted together) or Two-App-Deployment (Nodejs server and Angular app are hosted separetley)
  + compile the Angular app with output directory - dist with either `ng build --prod` , other `ng build--configuration=staging` , depending on how is provided the Slack Webhook API key.

<a href="#api-keys"></a>

### _**API-keys**_

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

<a href="#team"></a>

## _**Team**_
Name: Martin Martinov <br/>
Email: martinboykov@mail.bg <br/>
Github: https://github.com/martinboykov





