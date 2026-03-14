import React, { useEffect, useState } from 'react';
import axios from "../api/axiosClient";
import { toast } from 'react-toastify';
import { getToken, saveToken, removeToken } from '../utils/auth';
import '../styles/account.css';

export default function Account() {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [loginData, setLoginData] = useState({
    emailOrUsername: '',
    password: '',
  });

  const [profile, setProfile] = useState(null);

  const [budgetGoal, setBudgetGoal] = useState({
    weeklyBudget: '',
    monthlyBudget: '',
  });

  const token = getToken();

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/user/profile');
      setProfile(response.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setProfile(null);
    }
  };

  const fetchBudgetGoal = async () => {
    try {
      const response = await axios.get('/budget-goal');

      setBudgetGoal({
        weeklyBudget: response.data.weeklyBudget || '',
        monthlyBudget: response.data.monthlyBudget || '',
      });
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchBudgetGoal();
    }
  }, [token]);

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBudgetGoalChange = (e) => {
    const { name, value } = e.target;
    setBudgetGoal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/user/register',registerData);

      saveToken(response.data.token);
      toast.success('Registered successfully!');
      window.location.href = '/';
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/user/login', loginData );

      saveToken(response.data.token);
      toast.success('Login successful!');
      window.location.href = '/';
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    removeToken();
    setProfile(null);
    toast.info('Logged out successfully');
    window.location.href = '/';
  };

  const handleSaveBudgetGoal = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/budget-goal',
        {
          weeklyBudget: Number(budgetGoal.weeklyBudget),
          monthlyBudget: Number(budgetGoal.monthlyBudget),
        }
      );

      toast.success('Budget goals saved successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save budget goals');
    }
  };

  if (!profile) {
    return (
      <div className="auth-page">
        <div className="auth-layout glass-card">
          <div className="auth-left">
            <div className="auth-brand">
              <div className="auth-badge">Smart Budget Tracker</div>

              <h1 className="auth-heading">
                Take control of
                <br />
                your spending,
                <br />
                one clear view at a time.
              </h1>

              <p className="auth-description">
                Track daily expenses on an interactive calendar, set weekly and
                monthly goals, monitor your spending patterns, and get smart
                recommendations to keep your finances balanced.
              </p>

              <div className="auth-feature-list">
                <div className="auth-feature-item">
                  <div className="auth-feature-title">Calendar-based tracking</div>
                  <div className="auth-feature-text">
                    Log expenses date-wise and instantly review where your money
                    goes every day.
                  </div>
                </div>

                <div className="auth-feature-item">
                  <div className="auth-feature-title">Smart spending insights</div>
                  <div className="auth-feature-text">
                    Compare necessity and miscellaneous expenses with interactive
                    charts and dashboard analytics.
                  </div>
                </div>

                <div className="auth-feature-item">
                  <div className="auth-feature-title">Goal-focused budgeting</div>
                  <div className="auth-feature-text">
                    Set weekly and monthly targets and stay ahead with meaningful
                    recommendations.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-right">
            <div className="auth-form-card">
              <div className="auth-form-top">
                <h2 className="auth-form-title">
                  {isLoginMode ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="auth-form-subtitle">
                  {isLoginMode
                    ? 'Sign in to continue tracking your financial activity.'
                    : 'Start building healthier money habits with a smarter budget view.'}
                </p>
              </div>

              <div className="auth-toggle">
                <button
                  type="button"
                  className={`auth-toggle-btn ${isLoginMode ? 'active' : ''}`}
                  onClick={() => setIsLoginMode(true)}
                >
                  Login
                </button>

                <button
                  type="button"
                  className={`auth-toggle-btn ${!isLoginMode ? 'active' : ''}`}
                  onClick={() => setIsLoginMode(false)}
                >
                  Register
                </button>
              </div>

              {isLoginMode ? (
                <form className="auth-form" onSubmit={handleLogin}>
                  <div>
                    <label className="label-text">Email or Username</label>
                    <input
                      className="input-field"
                      type="text"
                      name="emailOrUsername"
                      placeholder="Enter email or username"
                      value={loginData.emailOrUsername}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="label-text">Password</label>
                    <input
                      className="input-field"
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>

                  <button className="primary-btn" type="submit">
                    Sign In
                  </button>
                </form>
              ) : (
                <form className="auth-form" onSubmit={handleRegister}>
                  <div>
                    <label className="label-text">Username</label>
                    <input
                      className="input-field"
                      type="text"
                      name="username"
                      placeholder="Choose a username"
                      value={registerData.username}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="label-text">Email</label>
                    <input
                      className="input-field"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="label-text">Password</label>
                    <input
                      className="input-field"
                      type="password"
                      name="password"
                      placeholder="Create a password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>

                  <button className="primary-btn" type="submit">
                    Create Account
                  </button>
                </form>
              )}

              <div className="auth-mini-note">
                Build better financial awareness with one unified dashboard for
                daily tracking, budgeting, and smart analysis.
              </div>

              <div className="auth-form-footer">
                {isLoginMode
                  ? 'New here? Switch to Register to create your budget dashboard.'
                  : 'Already have an account? Switch to Login and continue where you left off.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    
  <div className="app-page">
    <div className="account-dashboard">
      <div className="account-top-grid">
        <div className="account-profile-card soft-card">
          <div className="account-profile-header">
            <div className="account-avatar">
              {profile.username?.charAt(0).toUpperCase()}
            </div>

            <div className="account-profile-meta">
              <h2>{profile.username}</h2>
              <p>{profile.email}</p>
            </div>

            <div style={{ marginLeft: 'auto' }}>
              <button className="secondary-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          <p className="account-profile-subtext">
            Manage your profile and update your budget targets here. These
            targets are used across your calendar and insights dashboard to
            compare your real spending against your goals.
          </p>
        </div>

        <div className="account-stats-card soft-card">
          <div className="account-section-head">
            <h2>Budget Snapshot</h2>
            <p>Your currently saved planning targets.</p>
          </div>

          <div className="account-stats-grid">
            <div className="account-mini-stat">
              <p className="account-mini-stat-label">Weekly Budget</p>
              <p className="account-mini-stat-value">
                ₹{budgetGoal.weeklyBudget || 0}
              </p>
            </div>

            <div className="account-mini-stat">
              <p className="account-mini-stat-label">Monthly Budget</p>
              <p className="account-mini-stat-value">
                ₹{budgetGoal.monthlyBudget || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="account-budget-card soft-card">
        <div className="account-section-head">
          <h2>Update Budget Goals</h2>
          <p>
            Set your weekly and monthly limits so your dashboard can compare
            your actual spending with your personal targets.
          </p>
        </div>

        <form className="account-budget-form" onSubmit={handleSaveBudgetGoal}>
          <div>
            <label className="label-text">Weekly Budget</label>
            <input
              className="input-field"
              type="number"
              name="weeklyBudget"
              placeholder="Enter weekly budget"
              value={budgetGoal.weeklyBudget}
              onChange={handleBudgetGoalChange}
            />
          </div>

          <div>
            <label className="label-text">Monthly Budget</label>
            <input
              className="input-field"
              type="number"
              name="monthlyBudget"
              placeholder="Enter monthly budget"
              value={budgetGoal.monthlyBudget}
              onChange={handleBudgetGoalChange}
            />
          </div>

          <div className="account-budget-actions">
            <button className="primary-btn" type="submit">
              Save Budget Goals
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
}