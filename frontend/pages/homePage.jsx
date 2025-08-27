import React, { useState, useRef, useEffect } from 'react';
import DatePicker from '/components/homeDatePicker.jsx'
// A simple component for the month/year dropdowns

// A component to display and scroll the calendar days
const Calendar = ({ currentMonth, currentYear }) => {
  const [weeks, setWeeks] = useState([]);
  const calendarRef = useRef(null);

  useEffect(() => {
    const generateWeeks = (year, month) => {
      const weeksArray = [];
      const firstDayOfMonth = new Date(year, month, 1);
      let day = new Date(firstDayOfMonth);
      day.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

      for (let i = 0; i < 6; i++) {
        const week = [];
        for (let j = 0; j < 7; j++) {
          week.push(new Date(day));
          day.setDate(day.getDate() + 1);
        }
        weeksArray.push(week);
      }
      return weeksArray;
    };

    setWeeks(generateWeeks(currentYear, currentMonth));
  }, [currentMonth, currentYear]);

  // Logic to scroll to the current week when the component mounts or dependencies change
  useEffect(() => {
    if (calendarRef.current) {
      const today = new Date();
      if (currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
        const weeksContainer = calendarRef.current;
        const todayElement = weeksContainer.querySelector('.current-day-active');

        if (todayElement) {
          // Find the week container of the current day and scroll to it
          const currentWeekElement = todayElement.closest('.calendar-week');
          if (currentWeekElement) {
            weeksContainer.scrollTop = currentWeekElement.offsetTop;
          }
        }
      }
    }
  }, [weeks, currentMonth, currentYear]);


  return (
    <div className="calendar-container" ref={calendarRef}>
      {weeks.map((week, weekIndex) => (
        <div className="calendar-week" key={weekIndex}>
          {week.map((date, dateIndex) => (
            <div 
              className={`calendar-day ${date.getMonth() !== currentMonth ? 'other-month-day' : ''} ${date.toDateString() === new Date().toDateString() ? 'current-day-active' : ''}`} 
              key={dateIndex}
            >
              <div className="day-name">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="day-number">
                {date.getDate()}
              </div>
              <div className="day-details">
                {date.toLocaleDateString('en-US', { month: 'short' })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Main component for the Home Page
const HomePage = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const handleDateChange = (month, year) => {
    if (month !== null) {
      setCurrentMonth(month);
    }
    if (year !== null) {
      setCurrentYear(year);
    }
  };

  return (
    <div className="homepage-container">
      <header className="header-container">
        <h1 className="header-title">Smart Budget Tracker</h1>
        <div className="date-controls-container">
          <span className="current-date-display">{`${new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}</span>
          <DatePicker onDateChange={handleDateChange} currentYear={currentYear} currentMonth={currentMonth} />
        </div>
      </header>
      
      <main className="main-content">
        <Calendar 
          currentMonth={currentMonth} 
          currentYear={currentYear} 
        />
        <div className="budget-summary-container">
          <h2>Summary</h2>
          <p>This is where your budget summary and transactions will go.</p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;