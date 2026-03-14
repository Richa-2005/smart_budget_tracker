# Smart Budget Tracker

Smart Budget Tracker is a full-stack financial management dashboard that helps users track daily expenses, manage personal budget goals, and analyze spending patterns through an interactive calendar and analytics dashboard.

The application allows users to log expenses by date, categorize spending, and compare their real expenses against weekly and monthly budget targets. It also provides visual insights through charts to help users understand where their money goes and make better financial decisions.

---

## Features

### Authentication
- Secure user authentication using JWT
- Login and registration system
- Protected API routes with token validation

### Expense Tracking
- Calendar-based expense logging
- Add, view, and delete daily expenses
- Categorize spending as **Necessity** or **Miscellaneous**

### Budget Management
- Set weekly and monthly budget goals
- Compare actual spending with budget targets

### Analytics Dashboard
- Weekly spending trend visualization
- Monthly spending analysis
- Budget vs spending comparison
- Expense category breakdown
- Smart financial insights

### Modern UI
- Clean dashboard-style interface
- Glassmorphism-based design system
- Responsive layout
- Toast notifications for user actions

---

## Tech Stack

### Frontend
- React
- React Router
- Axios with interceptor
- Recharts (analytics visualization)
- React Toastify
- CSS (custom UI system)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

## Project Architecture
Frontend (React) <br />
↓ <br />
Axios Client + Interceptors <br />
↓ <br />
Express REST API <br />
↓ <br />
MongoDB Database <br />
The frontend communicates with the backend using REST APIs, while Axios interceptors automatically manage authentication tokens and session expiration.

---

## Installation

### Clone the repository
```
git clone  https://github.com/Richa-2005/smart_budget_tracker.git
```

### Install dependencies

Backend:
```
cd backend
npm install
```

Frontend:
```
cd frontend
npm install
```

### Run backend server
```
npm run dev
```

### Run frontend
```
npm run dev
```

---

## Future Improvements

- AI-based automatic expense categorization
- Personalized spending recommendations
- Export financial reports
- Advanced filtering for analytics
- Mobile-first UI improvements

---

## Author

Richa Gupta   
