import React, { useEffect, useState } from 'react';
import axios from '../api/axiosClient';
import { FiTrendingUp, FiPieChart, FiBarChart2 } from 'react-icons/fi';
import { getToken } from '../utils/auth';
import '../styles/activity.css';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export default function Activity() {
  const token = getToken();

  const [summary, setSummary] = useState(null);
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      window.location.href = '/';
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [
          summaryRes,
          weeklyRes,
          monthlyRes,
          recentRes,
          insightsRes,
        ] = await Promise.all([
          axios.get('/dashboard/summary'),
          axios.get('/dashboard/weekly-trend'),
          axios.get('/dashboard/monthly-trend'),
          axios.get('/dashboard/recent-expenses'),
          axios.get('/dashboard/insights'),
        ]);

        setSummary(summaryRes.data);
        setWeeklyTrend(weeklyRes.data);
        setMonthlyTrend(monthlyRes.data);
        setRecentExpenses(recentRes.data);
        setInsights(insightsRes.data);
        setError('');
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError('Failed to load activity dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return <div className="activity-loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="activity-error">{error}</div>;
  }

  if (!summary) {
    return <div className="activity-error">No dashboard data found.</div>;
  }

  const pieData = [
    { name: 'Necessity', value: summary.necessitySpent },
    { name: 'Miscellaneous', value: summary.miscellaneousSpent },
  ];

  const budgetComparisonData = [
    {
      period: 'Weekly',
      Budget: summary.weeklyBudget,
      Spent: summary.weeklySpent,
    },
    {
      period: 'Monthly',
      Budget: summary.monthlyBudget,
      Spent: summary.monthlySpent,
    },
  ];

  const COLORS = ['#2563eb', '#0f172a'];

  return (
    <div className="app-page">
      <div className="activity-page">
        <div className="activity-hero soft-card">
          <div className="activity-hero-left">
            <div className="activity-badge">
              <FiBarChart2 size={15} />
              <span>Insights Dashboard</span>
            </div>

            <h1 className="activity-title">
              Understand your spending
              <br />
              with sharper financial visibility.
            </h1>

            <p className="activity-subtitle">
              Review your weekly and monthly patterns, compare spending against
              goals, identify where your money goes most often, and use
              meaningful recommendations to stay aligned with your budget.
            </p>
          </div>

          <div className="activity-summary-chip">
            <span className="activity-summary-chip-label">Monthly spent</span>
            <span className="activity-summary-chip-value">
              ₹{summary.monthlySpent}
            </span>
          </div>
        </div>

        <div className="activity-cards-grid">
          <div className="metric-card soft-card">
            <p className="metric-label">Today</p>
            <p className="metric-value">₹{summary.todaySpent}</p>
          </div>

          <div className="metric-card soft-card">
            <p className="metric-label">This week</p>
            <p className="metric-value">₹{summary.weeklySpent}</p>
          </div>

          <div className="metric-card soft-card">
            <p className="metric-label">This month</p>
            <p className="metric-value">₹{summary.monthlySpent}</p>
          </div>

          <div className="metric-card soft-card">
            <p className="metric-label">Weekly left</p>
            <p
              className={`metric-value ${
                summary.remainingWeeklyBudget < 0 ? 'negative' : 'positive'
              }`}
            >
              ₹{summary.remainingWeeklyBudget}
            </p>
          </div>

          <div className="metric-card soft-card">
            <p className="metric-label">Monthly left</p>
            <p
              className={`metric-value ${
                summary.remainingMonthlyBudget < 0 ? 'negative' : 'positive'
              }`}
            >
              ₹{summary.remainingMonthlyBudget}
            </p>
          </div>
        </div>

        <div className="activity-grid-2">
          <div className="activity-panel soft-card">
            <div className="panel-title-row">
              <div>
                <h2 className="panel-title">Weekly spending trend</h2>
                <p className="panel-subtitle">
                  A quick view of how your spending changed through the week.
                </p>
              </div>
            </div>

            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="spent"
                    stroke="#2563eb"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="activity-panel soft-card">
            <div className="panel-title-row">
              <div>
                <h2 className="panel-title">Monthly spending trend</h2>
                <p className="panel-subtitle">
                  Daily totals across the current month.
                </p>
              </div>
            </div>

            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="spent" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="activity-grid-2">
          <div className="activity-panel soft-card">
            <div className="panel-title-row">
              <div>
                <h2 className="panel-title">Budget vs spending</h2>
                <p className="panel-subtitle">
                  Compare your actual spending against your set weekly and
                  monthly targets.
                </p>
              </div>
            </div>

            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Budget" fill="#0f172a" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Spent" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="activity-panel soft-card">
            <div className="panel-title-row">
              <div>
                <h2 className="panel-title">Expense breakdown</h2>
                <p className="panel-subtitle">
                  See how your monthly spending is split between necessity and
                  miscellaneous expenses.
                </p>
              </div>
            </div>

            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="activity-grid-2">
          <div className="activity-panel soft-card">
            <div className="panel-title-row">
              <div>
                <h2 className="panel-title">Key insights</h2>
                <p className="panel-subtitle">
                  High-level patterns detected from your current activity.
                </p>
              </div>
            </div>

            {insights ? (
              <div className="insight-stack">
                <div className="insight-item">
                  <p className="insight-item-label">Total transactions</p>
                  <p className="insight-item-value">{insights.totalTransactions}</p>
                </div>

                <div className="insight-item">
                  <p className="insight-item-label">Most frequent category</p>
                  <p className="insight-item-value">{insights.mostFrequentCategory}</p>
                </div>

                <div className="insight-item">
                  <p className="insight-item-label">Highest expense</p>
                  <p className="insight-item-value">
                    {insights.highestExpense
                      ? `₹${insights.highestExpense.price} • ${insights.highestExpense.description}`
                      : 'No expenses yet this month'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="panel-empty">No insights available.</div>
            )}
          </div>

          <div className="activity-panel soft-card">
            <div className="panel-title-row">
              <div>
                <h2 className="panel-title">Recommendations</h2>
                <p className="panel-subtitle">
                  Suggestions based on your current spending behavior.
                </p>
              </div>
            </div>

            {summary.recommendations?.length > 0 ? (
              <ul className="recommendation-list">
                {summary.recommendations.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <div className="panel-empty">No recommendations available.</div>
            )}
          </div>
        </div>

        <div className="activity-grid-2">
          <div className="activity-panel soft-card">
            <div className="panel-title-row">
              <div>
                <h2 className="panel-title">Recent expenses</h2>
                <p className="panel-subtitle">
                  Your latest recorded transactions.
                </p>
              </div>
            </div>

            {recentExpenses.length > 0 ? (
              <div className="expense-feed">
                {recentExpenses.map((item) => (
                  <div key={item._id} className="expense-feed-item">
                    <div className="expense-feed-main">
                      <p className="expense-feed-title">{item.description}</p>
                      <p className="expense-feed-meta">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                      <span className={`expense-mini-tag ${item.need}`}>
                        {item.need}
                      </span>
                    </div>

                    <div className="expense-feed-price">₹{item.price}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="panel-empty">No recent expenses found.</div>
            )}
          </div>

          <div className="activity-panel soft-card">
            <div className="panel-title-row">
              <div>
                <h2 className="panel-title">Budget details</h2>
                <p className="panel-subtitle">
                  Your current targets and expense distribution.
                </p>
              </div>
            </div>

            <div className="insight-stack">
              <div className="insight-item">
                <p className="insight-item-label">Weekly budget</p>
                <p className="insight-item-value">₹{summary.weeklyBudget}</p>
              </div>

              <div className="insight-item">
                <p className="insight-item-label">Monthly budget</p>
                <p className="insight-item-value">₹{summary.monthlyBudget}</p>
              </div>

              <div className="insight-item">
                <p className="insight-item-label">Necessity spending</p>
                <p className="insight-item-value">₹{summary.necessitySpent}</p>
              </div>

              <div className="insight-item">
                <p className="insight-item-label">Miscellaneous spending</p>
                <p className="insight-item-value">₹{summary.miscellaneousSpent}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}