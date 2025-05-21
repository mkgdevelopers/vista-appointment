import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SelectTimeDate from "./pages/BookMeating/SelectTimeDate";
import Form from "./pages/BookMeating/Form";
import './App.css'

import AdminLayout from "./admin/components/adminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Appointments from "./admin/pages/Appointments";
import CalendarPage from "./admin/pages/CalendarPage";
import Login from "./admin/pages/Login";
import TimeSlots from "./admin/pages/TimeSlots";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Routes>

      <Route path="/" element={<SelectTimeDate />} />
      <Route path="/:date/:time" element={<Form />} />

      {/* Login route, pass handleLogin */}
      <Route path="/login" element={<Login onLogin={handleLogin} />} />

      {/* Protected admin routes */}
      <Route
        path="/admin/*"
        element={
          isLoggedIn ? (
            <AdminLayout />
          ) : (
            // Redirect to login if not logged in
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="time-slots" element={<TimeSlots/>} />
      </Route>

    </Routes>
  );
};

export default App;
