import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom'

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

  
  useEffect(() => {
    if (calendarRef.current) {
      const today = new Date();
      if (currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
        const weeksContainer = calendarRef.current;
        const todayElement = weeksContainer.querySelector('.current-day-active');

        if (todayElement) {
          
          const currentWeekElement = todayElement.closest('.calendar-week');
          if (currentWeekElement) {
            weeksContainer.scrollTop = currentWeekElement.offsetTop;
          }
        }
      }
    }
  }, [weeks, currentMonth, currentYear]);

  const userId =0;
  
  return (
    <div className="calendar-container" ref={calendarRef}>
  {weeks.map((week, weekIndex) => (
    <div className="calendar-week" key={weekIndex}>
      {week.map((date, dateIndex) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const day = date.getDate().toString().padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return (
          <Link
            to={`/budget/${userId}/${formattedDate}`}
            key={dateIndex}
            className="day"
          >
            <div
              className={`calendar-day ${date.getMonth() !== currentMonth ? 'other-month-day' : ''} 
              ${date.toDateString() === new Date().toDateString() ? 'current-day-active' : ''}`}
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
          </Link>
        );
      })}
    </div>
  ))}
</div>
  );
};
