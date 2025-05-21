import React, { useEffect, useState } from "react";
import { client } from "../../sanity";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { format, parse, formatISO } from "date-fns";
import { exportToCSV } from "../utils/exportToCSV";


const AppointmentsAdmin = () => {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchAppointments = async () => {
    const data = await client.fetch(
      `*[_type == "appointment"] | order(_createdAt desc)`
    );
    setAppointments(data);
    setFiltered(data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    let data = [...appointments];

    if (statusFilter !== "All") {
  data = data.filter(item => {
    const status = item.status ? item.status.toLowerCase() : "pending";
    return status === statusFilter.toLowerCase();
  });
}


    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(lower) ||
          item.email.toLowerCase().includes(lower) ||
          item.phone.toLowerCase().includes(lower)
      );
    }

    if (sortOption === "Upcoming") {
      data = data.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOption === "Past") {
      data = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === "Recently Added") {
      data = data.sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt));
    } else if (sortOption === "Oldest First") {
      data = data.sort((a, b) => new Date(a._createdAt) - new Date(b._createdAt));
    }

    setFiltered(data);
  }, [statusFilter, sortOption, searchTerm, appointments]);

  const handleStatusChange = async (id, status) => {
    await client.patch(id).set({ status }).commit();
    fetchAppointments();
  };

  const handleDelete = async (id) => {
    await client.delete(id);
    fetchAppointments();
  };

  const handleEdit = (appt) => {
    setEditData(appt);
    setEditModalOpen(true);
  };

  const saveEditedAppointment = async () => {
    const { _id, name, email, phone, date, time } = editData;
    await client.patch(_id).set({ name, email, phone, date, time }).commit();
    setEditModalOpen(false);
    fetchAppointments();
  };
const handleAddToCalendar = (appt) => {
  try {
    const { date, time, name, email, phone } = appt;

    // Try parsing time safely (supports formats like "1:00 PM" or "13:00")
    const parsedTime = parse(time, "hh:mm a", new Date());
    const isoDate = parse(date, "yyyy-MM-dd", new Date());

    const startDateTime = new Date(
      isoDate.getFullYear(),
      isoDate.getMonth(),
      isoDate.getDate(),
      parsedTime.getHours(),
      parsedTime.getMinutes()
    );

    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // 30 minutes later

    const startStr = formatISO(startDateTime).replace(/-|:|\.\d\d\d/g, "");
    const endStr = formatISO(endDateTime).replace(/-|:|\.\d\d\d/g, "");

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Appointment with ${name}&dates=${startStr}/${endStr}&details=Email: ${email}%0APhone: ${phone}&location=Online`;

    window.open(calendarUrl, "_blank");
  } catch (error) {
    console.error("Failed to generate calendar link", error);
    alert("Error generating calendar link. Please check date/time format.");
  }
};

const handleExportCSV = () => {
  const exportData = filtered.map((appt) => ({
    Name: appt.name,
    Email: appt.email,
    Phone: appt.phone,
    Date: format(new Date(appt.date), 'PPP'),
    Time: appt.time,
    Status: appt.status || 'pending',
  }));

  exportToCSV(exportData, "appointments.csv");
};

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-2">
          {["All", "Pending", "Approved", "Rejected"].map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </Button>
          ))}
        </div>
<Button variant="secondary" onClick={handleExportCSV}>
  Export as CSV
</Button>
        <Input
          placeholder="Search name, email, phone..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Select onValueChange={(v) => setSortOption(v)} defaultValue="Upcoming">
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["Upcoming", "Past", "Recently Added", "Oldest First"].map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((appt) => (
          <Card key={appt._id} className="rounded-2xl shadow-md">
            <CardContent className="p-6 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{appt.name}</h3>
                <Badge variant="outline">{appt.status || "Pending"}</Badge>
              </div>
              <p>
                <strong>Email:</strong> {appt.email}
              </p>
              <p>
                <strong>Phone:</strong> {appt.phone}
              </p>
              <p>
                <strong>Date:</strong> {format(new Date(appt.date), "PPP")}
              </p>
              <p>
                <strong>Time:</strong> {appt.time}
              </p>

              <div className="flex gap-2 flex-wrap mt-4">
                <Button
                  onClick={() => handleStatusChange(appt._id, "approved")}
                  variant="default"
                  size="sm"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleStatusChange(appt._id, "rejected")}
                  variant="destructive"
                  size="sm"
                >
                  Reject
                </Button>
                <Button
                  onClick={() => handleDelete(appt._id)}
                  variant="ghost"
                  size="sm"
                >
                  Delete
                </Button>
                <Button variant="outline" size="sm"
                onClick={()=>handleAddToCalendar(appt)}>
                  Add to Calendar
                </Button>
                <Button
                  onClick={() => handleEdit(appt)}
                  variant="secondary"
                  size="sm"
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editModalOpen && editData && (
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="space-y-4">
            <h2 className="text-xl font-semibold">Edit Appointment</h2>
            <Input
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              placeholder="Name"
            />
            <Input
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              placeholder="Email"
            />
            <Input
              value={editData.phone}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
              placeholder="Phone"
            />
            <Input
              type="date"
              value={editData.date}
              onChange={(e) => setEditData({ ...editData, date: e.target.value })}
            />
            <Input
              value={editData.time}
              onChange={(e) => setEditData({ ...editData, time: e.target.value })}
              placeholder="Time"
            />
            <Button onClick={saveEditedAppointment}>Save</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AppointmentsAdmin;
