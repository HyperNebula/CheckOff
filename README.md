# CheckOff

**CheckOff** is a movie tracker website that allows you to track and record all the movies you have watched or plan to watch! 

**CheckOff** is a comprehensive tracking dashboard that allows you to search, rate, and log your entire movie journey in one centralized location. CheckOff also allows you to see a live feed of what your friends are currently watching or rating.

---

## Key Features

- **Movie Library:** Add movies to your personal library.
- **Status Tracking:** Mark movies as watched or want to watch, complete with the applicable dates.
- **Ratings & Reviews:** Rate the movies you've seen and leave personal reviews.
- **Social Feed:** See live updates from other users in real-time as they change their movie libraries and post reviews.
- **Secure Access:** User registration, secure login over HTTPS, and restricted private endpoints.
- **Responsive Design:** Clean, easily readable UI with light and dark mode options, fully responsive for both desktop and mobile viewing.

---

## Technologies Used

CheckOff is built using a modern full-stack web development environment:

- **HTML:** Provides the foundational website structure, with dedicated pages for login, the public feed, and your personal library.
- **CSS:** Styles a clean, user-friendly interface. Utilizes Flexbox/Grid for responsiveness, Bootstrap for component styling, and Google Fonts (Roboto).
- **React & Vite:** The frontend framework provides a dynamic Single Page Application (SPA) experience. It handles the login landing page, public update feed, library display, routing, and search/add interfaces using hooks (`useState`, `useEffect`).
- **Node.js & Express:** The backend HTTP service serves static middleware, handles API requests, and acts as a bridge for 3rd-party endpoint calls.
- **MongoDB:** Serves as the database storing secure user credentials and each user's customized movie library, linked directly to their user object. 
- **WebSockets:** Powers the real-time social feed. When a user updates their library, the backend listens for the change and instantly broadcasts it to all connected clients.
- **3rd-Party APIs:** Integrates external database APIs to fetch accurate movie data (titles, genres, release years, and movie posters) for user search queries.

---

## Live Application

The website is fully deployed and accessible here:
[**Access CheckOff Here**](https://checkoff.daviddeskins.com)
