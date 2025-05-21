// admin/pages/CalendarPage.jsx
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { client } from "../../sanity";
import { Card, CardContent } from "@/components/ui/card";

const CalendarPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await client.fetch(`*[_type == "appointment"] | order(_createdAt desc)`);
      setAppointments(data);
      console.log(data)
    } catch (err) {
      console.error(err);
    }
  };

  // Filter appointments for selected date
const formatDate = (date) => date.toISOString().split("T")[0]; // "yyyy-mm-dd"

const filteredAppointments = appointments.filter((appt) => {
  const [year, month, day] = appt.date.split("-");
  const apptDate = new Date(+year, +month - 1, +day);
  return apptDate.toDateString() === selectedDate.toDateString();
});


  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">📅 Calendar View</h2>

      {/* Calendar Component */}
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        className="rounded-xl shadow border p-2"
      />

      {/* Appointments on Selected Date */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">
          Appointments on {selectedDate.toDateString()}:
        </h3>
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appt, i) => (
            <Card key={i}>
              <CardContent className="p-3 space-y-1">
                <p>
                  <strong>{appt.name}</strong> @ {appt.time}
                </p>
                <p className="text-muted-foreground">{appt.email}</p>
                <p className="text-sm text-gray-500">{appt.job}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground italic">
            No appointments on this day.
          </p>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
