import React, { useEffect, useState } from "react";
import { client } from "../../sanity";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { BarChart2, CalendarCheck, Clock, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);

  const navigate = useNavigate()

  useEffect(() => {
    const fetchAppointments = async () => {
      const data = await client.fetch(`*[_type == "appointment"]`);
      setAppointments(data);
    };
    fetchAppointments();
  }, []);


  const total = appointments.length;
  const pending = appointments.filter((a) => !a.status || a.status === "pending").length;
  const approved = appointments.filter(a => a.status === "approved").length;
  const rejected = appointments.filter(a => a.status === "rejected").length;

  const today = new Date();
  const upcoming = appointments.filter(a => new Date(a.date) >= today && new Date(a.date) <= new Date(today.getTime() + 7 * 24*60*60*1000)).length;
  const past = appointments.filter(a => new Date(a.date) < today).length;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center gap-4">
            <BarChart2 className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total Appointments</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{pending}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold">{approved}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold">{rejected}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <p className="text-lg font-semibold mb-4">Upcoming Appointments (Next 7 Days)</p>
            <p className="text-4xl font-bold">{upcoming}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-lg font-semibold mb-4">Past Appointments</p>
            <p className="text-4xl font-bold">{past}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <Button variant="default" onClick={() => navigate('./appointments')}>
          Manage Appointments
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;

