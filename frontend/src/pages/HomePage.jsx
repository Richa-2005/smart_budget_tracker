import React, { useState, useEffect } from 'react';
import axios from "../api/axiosClient";
import { FiCalendar } from 'react-icons/fi';
import { DatePicker, Calendar } from '../components/homeComponents';
import '../styles/homePage.css';
import { getToken } from '../utils/auth';

export default function HomePage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [calendarTotals, setCalendarTotals] = useState({});
  const token = getToken();

  const handleDateChange = (month, year) => {
    if (month !== null) setCurrentMonth(month);
    if (year !== null) setCurrentYear(year);
  };

  useEffect(() => {
    if (!token) {
      window.location.href = '/';
      return;
    }

    const fetchCalendarTotals = async () => {
      try {
        const response = await axios.get(
          `/dashboard/calendar-totals?month=${currentMonth + 1}&year=${currentYear}`
        );

        const totalsMap = {};
        response.data.forEach((item) => {
          totalsMap[item.date] = item.total;
        });

        setCalendarTotals(totalsMap);
      } catch (error) {
        console.error(error.response?.data || error.message);
        setCalendarTotals({});
      }
    };

    fetchCalendarTotals();
  }, [currentMonth, currentYear, token]);

  return (
    <div className="app-page">
      <div className="homepage-shell">
        <div className="home-hero soft-card">
          <div className="home-hero-left">
            <div className="home-hero-badge">
              <FiCalendar size={15} />
              <span>Calendar Overview</span>
            </div>

            <h1 className="home-hero-title">
              Plan, track, and review
              <br />
              your spending day by day.
            </h1>

            <p className="home-hero-subtitle">
              Move across months, open any date, and instantly see how much you
              spent on each day. Your budget calendar gives you a clear daily
              picture before you even open the full analytics dashboard.
            </p>
          </div>

          <div className="home-hero-right">
            <div className="month-control-card glass-card">
              <span className="month-control-label">Currently viewing</span>
              <span className="month-control-title">
                {new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>

              <DatePicker
                onDateChange={handleDateChange}
                currentYear={currentYear}
                currentMonth={currentMonth}
              />
            </div>
          </div>
        </div>

        <div className="calendar-wrapper soft-card">
          <div className="calendar-header-row">
            <div className="calendar-header-day">Sun</div>
            <div className="calendar-header-day">Mon</div>
            <div className="calendar-header-day">Tue</div>
            <div className="calendar-header-day">Wed</div>
            <div className="calendar-header-day">Thu</div>
            <div className="calendar-header-day">Fri</div>
            <div className="calendar-header-day">Sat</div>
          </div>

          <Calendar
            currentMonth={currentMonth}
            currentYear={currentYear}
            calendarTotals={calendarTotals}
          />
        </div>
      </div>
    </div>
  );
}