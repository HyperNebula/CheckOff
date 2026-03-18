# CheckOff

**CheckOff** is a movie tracker website, allowing you to track and record all movies you have watched or plan to watch!

## 🚀 Specification Deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] Proper use of Markdown
- [x] A concise and compelling elevator pitch
- [x] Description of key features
- [x] Description of how you will use each technology
- [x] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references.

### Elevator pitch

Your taste in books, movies, and games defines who you are. Yet, there is no single website to track it all; instead one website for books, another for movies, others for games. **CheckOff** solves all of this by unifying your media life. It is a comprehensive tracking dashboard that allows users to search, rate, and log movies, books, and all types of games in one centralized location. **CheckOff** also introduces a social layer, allowing users to see a live feed of what their friends are currently finishing or rating. Stop toggling between three different apps; track your entire digital life in one place!


### Design
Here are examples of what the login page will look like, as well as the main library page after logging in.

![Login page image](Photos/login_page.png)
![Main page image](Photos/main_page.png)


### Key features

- User login with secure connection over HTTPS
- Ability to search for different media, such as books, movies, video games, board games, using various APIs
- Add media to their library, marked as seen/read/played with the applicable date, or want to see/read/play.
- Rate media and leave a review.
- See live updates from other users on their media library changes and reviews.

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - HTML will provide the basic website structure, with pages for login, public feed, and your library.
- **CSS** - Styling for website that is clean and easily readable. Light and dark mode options. Usable on computer and phone.
- **React** - Provides a login landing page form, public update feed flow, displaying user's library, and showing search/add media interface.
- **Service** - Backend service that allows for:
    - logging in
    - retrieving user media input
    - searching for that media in the correct database API 
- **DB/Login** - Stores user/login info, each user's library using data from the APIs, each library tied to their specific login information.
- **WebSocket** - After a user updates or changes something in their library, this change gets broadcasted to every other user.

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Server deployed and accessible with custom domain name** - [My server link](https://yourdomainnamehere.click).

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **HTML pages** - I added HTML for each seperate page I will have on the completed webpage.
- [X] **Proper HTML element usage** - I used a variety of HTML elements such as div, nav, main, img. Each for their own role.
- [X] **Links** - I included links connecting each different webpage. I also included links that will modify one html page further on in the webpage development.
- [x] **Text** - I included all the necessary text to explain the website to the user and allow them to navigate.
- [X] **3rd party API placeholder** - I filled in movie details such as genre and year, and included a plcaeholder movie poster, all of which will be replaced by the API.
- [x] **Images** - I included a logo image for the website, on the webpage and in the tab. I also included placeholder images for movie posters and user profile images.
- [x] **Login placeholder** - On the main library page I included a spot where the user's username will be displayed.
- [X] **DB data placeholder** - I included an account settings page where the user's account details stored in the DB can be seen an edited. Additionally, the user's library info will be stored in the DB
- [x] **WebSocket placeholder** - I added examples of user updates on the FEED page, which will be replaced with live updates from other users.

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Visually appealing colors and layout. No overflowing elements.** - I stuck with a simple white/gray color scheme. Most elements were given rounded corners and some were given shadows for visual appeal.
- [x] **Use of a CSS framework** - I used Bootstrap for the ADD MOVIE button on library.html.
- [x] **All visual elements styled using CSS** - CSS was used.
- [x] **Responsive to window resizing using flexbox and/or grid display** - Both grid and flex were used in various parts of the site. Elements such as boxes and texts scale to the window, with spacing between elements also scaling.
- [x] **Use of a imported font** - I used a font from Google - Roboto.
- [x] **Use of different types of selectors including element, class, ID, and pseudo selectors** - I used an assortment of selectors and combination of them in order to apply CSS.

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Bundled using Vite** - I bundled together my website and deployed it on my server.
- [x] **Components** - I added 3 distince elements: the header, footer, and the main body that changes with each webpage.
- [x] **Router** - I used a router to connect the four pages together.

## 🚀 React part 2: Reactivity deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **All functionality implemented or mocked out** - I used localStorage to keep track of user accounts as well as the user's library database. I mocked out an API returning info from a movie search query, and made it so that all functionality, inclduing changing user info, is implemented.
- [x] **Hooks** - I used useState a lot of times to keep track of various variables, such as login info and the library database. I also used useEffect combined with an interval to simulate websockets on the Feed page.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] **Node.js/Express HTTP service** - I completed this section.
- [X] **Static middleware for frontend** - I completed this section.
- [X] **Calls to third party endpoints** - I used a third part API database to get information on movie searches.
- [X] **Backend service endpoints** - I added a backend service call for everything requiring storing persistent data and for accounts.
- [X] **Frontend calls service endpoints** - I created fetch requests to use each backend service that I implemented.
- [X] **Supports registration, login, logout, and restricted endpoint** - I added functionality to support accounts, including modifying and deleting accounts. If the user is not logged in, they will be redirected to login page.

## 🚀 DB deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] **Stores data in MongoDB** - I store each user's movie library in MongoDB, attached to their USER object. I added functions that sort the user's library in MongoDB
- [X] **Stores credentials in MongoDB** - I store user's info and their login token in the MongoDB.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] **Backend listens for WebSocket connection** -  Backend waits for data sent from frontend, and then sends it to all clients. The backend also temporarily stores recent feed updates so that users can see updates recieved even when they are not connected.
- [X] **Frontend makes WebSocket connection** - Frontend connects to the websocket when the page is loaded and listens for data sent from backend.
- [X] **Data sent over WebSocket connection** - Library updates are sent over websocket as the user updates their library, if they have selected this option in the account settings page.
- [X] **WebSocket data displayed** - A list of updates sent over websocket is displayed on the feed page.
- [X] **Application is fully functional** - The webapp is fully functional and has all intended features.
