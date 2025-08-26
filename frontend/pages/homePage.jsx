import React, { useState, useRef, useEffect } from 'react';

// A simple component for the month/year dropdowns
const DatePicker = ({ onDateChange }) => {
  const years = Array.from({ length: 26 }, (_, i) => 2025 - i); // From 2025 back to 2000
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleYearChange = (event) => {
    onDateChange(null, parseInt(event.target.value));
  };

  const handleMonthChange = (event) => {
    onDateChange(parseInt(event.target.value), null);
  };

  return (
    <div className="date-picker-container">
      <select className="year-dropdown" onChange={handleYearChange}>
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
      <select className="month-dropdown" onChange={handleMonthChange}>
        {months.map((month, index) => (
          <option key={index} value={index}>{month}</option>
        ))}
      </select>
    </div>
  );
};

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

      for (let i = 0; i < 6; i++) { // Generate 6 weeks to cover any month
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

  useEffect(() => {
    if (calendarRef.current) {
      const today = new Date();
      if (currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
        const firstDayOfCurrentMonth = new Date(currentYear, currentMonth, 1);
        const weeksContainer = calendarRef.current;
        
        // This is a simplified scroll logic. More robust logic would be needed for a perfect calendar.
        // It's meant to highlight the current month's start, not necessarily the current day.
        const firstWeekIndex = Math.floor((firstDayOfCurrentMonth.getDate() - 1 + firstDayOfCurrentMonth.getDay()) / 7);
        const weekWidth = weeksContainer.children[0]?.offsetWidth || 0;
        weeksContainer.scrollLeft = weekWidth * firstWeekIndex;
      }
    }
  }, [currentMonth, currentYear, weeks]);


  return (
    <div className="calendar-container" ref={calendarRef}>
      {weeks.map((week, weekIndex) => (
        <div className="calendar-week" key={weekIndex}>
          {week.map((date, dateIndex) => (
            <div 
              className={`calendar-day ${date.getMonth() !== currentMonth ? 'other-month-day' : ''}`} 
              key={dateIndex}
            >
              <span className="day-number">{date.getDate()}</span>
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
          <DatePicker onDateChange={handleDateChange} />
        </div>
      </header>
      
      <main className="main-content">
        <Calendar 
          currentMonth={currentMonth} 
          currentYear={currentYear} 
        />
        {/* Placeholder for budget-related content or more features */}
        <div className="budget-summary-container">
          <h2>Summary</h2>
          <p>This is where your budget summary and transactions will go.</p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;