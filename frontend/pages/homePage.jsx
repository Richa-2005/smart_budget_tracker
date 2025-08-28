import React, { useState, useRef, useEffect } from 'react';
import {DatePicker, Calendar} from '/components/homeComponents.jsx'
import './homePage.css'
export default function HomePage  (){
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
        <h1 className="header-title">Know where every penny goes, your financial dashboard</h1>
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
      </main>
    </div>
  );
};

