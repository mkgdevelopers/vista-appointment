import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import vistaLogo from '../../assets/vistaonelogo.png';
import { client } from "../../sanity";
import {
  Card, CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";


const weekdayMap = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday"
};

export default function BookingPage() {

  const navigate = useNavigate();

  const [date, setDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);


  const fetchBookedSlotsForDate = async (selectedDate) => {
    const formattedDate = selectedDate.toISOString().split("T")[0]; 
    const query = `*[_type == "appointment" && date == "${formattedDate}"]{ timeSlot }`;
    try {
      const result = await client.fetch(query);
      return result.map(item => item.timeSlot);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      return [];
    }
  };

  const handleDateChange = async (selectedDate) => {
  const cleanDate = new Date(selectedDate);
  cleanDate.setHours(0, 0, 0, 0);
  setDate(cleanDate);
  setSelectedTime(null);

  const dayOfWeek = cleanDate.getDay();
  const dayName = weekdayMap[dayOfWeek];

  await fetchSlotsForDay(dayName);
};

const fetchSlotsForDay = async (day) => {
  setLoadingSlots(true); 
  const query = `*[_type == "timeSlotConfig" && day == "${day}"][0]`;

  try {
    const result = await client.fetch(query);
    if (result && result.slots) {
      setAvailableSlots(result.slots);
    } else {
      setAvailableSlots([]);
    }
  } catch (err) {
    console.error("Error fetching time slots from Sanity:", err);
    setAvailableSlots([]);
  } finally {
    setLoadingSlots(false); 
  }
};




  return (
    <div className="min-h-screen bg-white py-12 px-4 md:px-10 lg:px-20">
      {/* Header */}
      <div className="flex justify-between items-center max-w-5xl mx-auto mb-12">
        <div className="flex items-center gap-4">
          <img
            src={vistaLogo}
            alt="TheVista.One"
            className="h-14 rounded-xl"
          />
          <h1 className="text-3xl font-semibold text-gray-900 tracking-wide">
            Book an Appointment
          </h1>
        </div>
        <div className="text-sm text-muted-foreground italic">
          Powered by <span className="font-medium text-gray-800">TheVista.One</span>
        </div>
      </div>

      <Separator className="max-w-5xl mx-auto mb-10" />


    <Card className="border-none shadow-lg bg-white/80 backdrop-blur-md p-6 rounded-2xl">
      <CardContent className="flex flex-col md:flex-row gap-12 justify-between">

        <motion.div
          className="w-full md:w-[400px]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pick a date</h2>
          <div className="rounded-2xl border border-gray-200 bg-white shadow-inner overflow-hidden p-2">
            <Calendar
              onChange={handleDateChange}
              value={date}
              minDate={new Date()}
              maxDate={new Date(new Date().setDate(new Date().getDate() + 30))}
              tileDisabled={({ date }) => {
                const today = new Date();
                const isPast =
                  date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                return isPast || isWeekend;
              }}
            />
          </div>
        </motion.div>

        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select a time</h2>

          <div className="min-h-[180px]">
            {loadingSlots ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-11 w-full rounded-xl" />
                ))}
              </div>
            ) : availableSlots.length === 0 ? (
              <motion.p
                className="text-gray-500 italic text-center mt-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No slots available for this day.
              </motion.p>
            ) : (
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {availableSlots.map((time) => (
                  <motion.div
                    key={time}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button
                      variant={selectedTime === time ? "default" : "outline"}
                      className={`w-full h-11 rounded-xl text-base font-medium transition-all ${
                        selectedTime === time
                          ? "bg-teal-600 hover:bg-teal-700 text-white"
                          : "border-gray-300 text-gray-800 hover:border-teal-500"
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>


          {selectedTime && (
            <motion.div
              className="flex justify-end mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl text-sm shadow-md"
                onClick={() =>
                  navigate(
                    `/${date.toISOString()}/${selectedTime}`
                  )
                }
              >
                Continue →
              </Button>
            </motion.div>
          )}
        </motion.div>
      </CardContent>
    </Card>
    </div>
  );
}
