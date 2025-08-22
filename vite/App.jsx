import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import UserInfo from './UserInfo';
import EmployeeList from './EmployeeList';
import SurveyStores from './SurveyStores';
import Navbar from './Navbar';
import SurveyBranches from './SurveyBranches';
import SalesPredictor from './Components/SalesPredictor/SalesPredictor';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/userinfo" element={<UserInfo />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/survey-stores" element={<SurveyStores />} />
        <Route path="/survey-branches" element={<SurveyBranches />} />
        <Route path="/sales-predictor" element={<SalesPredictor />} />
      </Routes>
    </Router>
  );
}

export default App;