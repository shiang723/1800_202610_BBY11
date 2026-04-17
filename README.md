# Extra Time


## Overview
Extra Time is a client-side JavaScript web application that helps FIFA fans who are unable to watch world cup matches in person feel more connected by providing an online platform for positive, entertaining interaction through point-based predictions, live chats, and up-to-date match information. The app displays a list of upcoming, live, and finished matches. Disclaimer: Match data are are currently simulated data.

Developed for the COMP 1800 course, this project applies User-Centred Design practices and agile project management, and demonstrates integration with Firebase backend services for storing user points, matches, quizzes, team players, etc.

---


## Features

- Browse upcoming, live, and finished match details
- Bet points on upcoming matches
- Earn points through trivia
- Watch post match highlights
- Responsive design for desktop and mobile

---


## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend**: Firebase for hosting
- **Database**: Firestore

---


## Usage

Using the live hosted website:

1. **Visit** our [website](https://comp1800bby-11.web.app/)
2. Browse the matches and view their details on the home page.
3. Create an account to bet on any upcoming match.

To run the application locally:

1.  **Clone** the repository.
2.  **Install dependencies** by running `npm install` in the project root directory.
3.  **Start the development server** by running the command: `npm run dev`.
4.  Open your browser and visit the local address shown in your terminal (usually `http://localhost:5173` or similar).


---


## Project Structure

```
ExtaTime/
├── Frontend/
│   ├── src/
|   |   ├── script.js
|   |   |   ...
|   |   ├── updateProfile.js
|   |   └── css/
|   └── images/
├── Backend/
├── index.html
├── homePage.html
|   ...
├── matchSummary.html
├── package.json
├── README.md
```

---


## Contributors
- **Lydia** - BCIT CST Student with a passion for art. I also love dance and exploring different creative outlits.
- **Arzee Morales** - BCIT CST Student with a passion for DJing and going for outside activities in every season. I really love listening to music on why I started to DJ.

- **Hannah** - BCIT CST Student with a passion for creating fun projects. Fun fact: Likes drawing and taking walks.


- **Mahdi** - BCIT CST Student with a passion for outdoor adventures and creating fun applications. Fun fact: I enjoy playing soccer
---


## Acknowledgments

- Match data and images are for demonstration purposes only.
- Code snippets were adapted from resources such as [Stack Overflow](https://stackoverflow.com/), [MDN Web Docs](https://developer.mozilla.org/), and COMP 1800 example codes.
- Icons sourced from [Google Fonts](https://fonts.google.com/icons)

---


## Limitations and Future Work
### Limitations

- Limited match details (e.g., no live match scores).
- Accessibility features can be further improved.
- Pay out only works if user stays on match page.
- Post Match highlights do not show up as videos or too large. 


### Future Work

- Implement teams and team leaderboards.
- Implement live chatting for each match
- Add more interactive features in the live chat.
- Add filtering and sorting options for matches (e.g., by location, country, date).
- Make post match highlight videos accessible.
- Create a dark mode for better usability in low-light conditions.

---


## License

This project is licensed under the MIT License. See the LICENSE file for details.