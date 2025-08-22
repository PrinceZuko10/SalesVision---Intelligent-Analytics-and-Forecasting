import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import Routes and Route here
import App from './App';
import UserInfo from './UserInfo';
import './index.css';
import EmployeeList from './EmployeeList';
import SurveyStores from './SurveyStores';
import Navbar from './Navbar';
import SurveyBranches from './SurveyBranches';
import Signup from './Signup';
import StoreList from './StoreList';
import InputSales from './InputSales';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/userinfo" element={<UserInfo />} />
      <Route path="/employees" element={<EmployeeList />} />
      <Route path="/survey-stores" element={<SurveyStores />} />
      <Route path="/survey-branches" element={<SurveyBranches />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/store" element={<StoreList />} />
      <Route path="/input-sales" element={<InputSales />} />
    </Routes>
  </Router>
);
