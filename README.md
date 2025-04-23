# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Project Report

### Final Version Overview

The final version of The Final Buzzer is a React-based web application designed to help students efficiently manage their exam preparation. The application provides a real-time countdown to the user’s upcoming exam and a dashboard to track planned versus actual study time for various tasks. With a clean and intuitive interface, The Final Buzzer offers students a structured and visual approach to organizing their study efforts leading up to an exam.

### Achievements

Successfully implemented:

- Exam Countdown Timer: A large visual clock that dynamically counts down to the exam date in days, hours, and minutes.

- Task Entry System: Allows users to add, edit, and delete study tasks with estimated preparation time.

- Time Tracking: Each task includes a Record and Stop button to track and log actual time spent studying.

- Dashboard Display: A comprehensive dashboard that shows the countdown, task list, and cumulative study progress.

- Local Storage Persistence: User data is saved to local storage, maintaining study history across sessions.

### Challenges and Limitations

I faced challenges with:

- Managing Multiple Timers: Implementing independent timers for each task required the use of useEffect hooks in ways that aren't considered best practice. However, for maintaining stateful, real-time tracking across components, this approach was necessary within the project’s scope.

- Working with dayjs: Although lightweight and easy to integrate, dayjs lacked robust documentation for more advanced use cases, which introduced friction when handling time formatting and dynamic countdown logic.

- Exploring Timer Libraries: Due to time constraints, I wasn’t able to experiment with external timer libraries like react-timer-hook, which may have provided cleaner or more scalable implementations for managing timers.

### Scaling the Project

To scale the project, I recommend:

- Enhanced Timer Infrastructure: Replacing custom timer logic with a dedicated library like react-timer-hook to reduce complexity and improve maintainability.

- Improved Accessibility: Improved color contrast ratios (according to WCAG standards), keyboard navigation, and clearer focus indicators to support users with assistive technologies.

- Mobile Optimization: Further refining responsive layouts and touch-friendly interactions for a seamless mobile-first experience.

- Analytics Dashboard: Introducing charts to visualize study trends over time and identify gaps between planned and actual time.

### Key Files and Directories

- **`src/components/CountdownTimer.js`**: Handles the countdown timer functionality and UI using dayjs for initializing and updating exam-related time data.
- **`src/components/TaskManagement.js`**: Manages the task entry system, including multiple timers for tasks, goal times, and cumulative study tracking.
- **`src/App.js/`**: Lays out the main dashboard, integrating the CountdownTimer and TaskManagement components.

These files and directories represent the foundation of The Final Buzzer and reflect the project’s emphasis on real-time interactivity, usability, and inclusive design.
