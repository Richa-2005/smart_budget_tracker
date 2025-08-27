import React, { useState, useRef, useEffect } from 'react';

function generateYears(startYear, count) {
    const years = [];
    for (let i = 0; i < count; i++) {
      years.push(startYear - i);
    }
    return years;
  }
  
 
export function DatePicker ({ onDateChange, currentYear, currentMonth }) {

    const years = generateYears(2025, 26);
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

    const MapYear = years.map(year => (
        <option key={year} value={year}>{year}</option>
      ))
    const MapMonth = months.map((month, index) => (
        <option key={index} value={index}>{month}</option>
      ))
  
    return (
      <div className="date-picker-container">
        <select className="year-dropdown" onChange={handleYearChange} value={currentYear}>
          {MapYear}
        </select>
        <select className="month-dropdown" onChange={handleMonthChange} value={currentMonth}>
          {MapMonth}
        </select>
      </div>
    );
  };

export function Calendar  ({ currentMonth, currentYear })  {
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
