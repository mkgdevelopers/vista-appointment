// src/admin/components/AdminLayout.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">

      <aside className="w-60 bg-gray-900 text-white p-6 flex flex-col">
        <h2 className="text-3xl font-bold mb-8">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/admin" className="hover:underline">Dashboard</Link>
          <Link to="/admin/appointments" className="hover:underline">Appointments</Link>
          <Link to="/admin/calendar" className="hover:underline">Calendar</Link>
          <Link to="/admin/time-slots">Available Slots</Link>
          <Link to="/login" className="hover:underline mt-auto text-red-400">Logout</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
