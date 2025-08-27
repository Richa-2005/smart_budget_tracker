import React, { useState, useRef, useEffect } from 'react';

export function DatePicker ({ onDateChange, currentYear, currentMonth }) {
    
    const years = Array.from({ length: 26 }, (_, i) => 2025 - i);
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
        <select className="year-dropdown" onChange={handleYearChange} value={currentYear}>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select className="month-dropdown" onChange={handleMonthChange} value={currentMonth}>
          {months.map((month, index) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </select>
      </div>
    );
  };