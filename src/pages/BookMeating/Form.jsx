import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { client } from "../../sanity";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const Form = () => {
  const navigate = useNavigate();
  const { date, time } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    job: "",
  });

  const [loading, setLoading] = useState(false);


  const handleReset = () => {
    setFormData(initialState);
    setIsConfirmed(false);
  };
  const [isConfirmed, setIsConfirmed] = useState(false);
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const appointment = {
      _type: "appointment",
      date: new Date(date).toISOString().split("T")[0], // saves "2025-05-20",
      time,
      ...formData,
    };

    try {
      await client.create(appointment);
      console.log("Saved to Sanity:", appointment);
      setIsConfirmed(true);
      await fetch("https://formspree.io/f/xdkgjrnn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          job: formData.job,
          date: formattedDate,
          time,
          to: formData.email, 
          message: `${formData.name}, requested an appointment on ${formattedDate} at ${time}.`,
        }),
      });
    } catch (err) {
      console.error("Error saving appointment:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300`}
    >

      <div
        className={`w-full max-w-xl rounded-2xl shadow-2xl p-8 transition-colors duration-300`}
      >
        <AnimatePresence>
          {isConfirmed && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-4"
            >
              <h2 className="text-2xl font-semibold text-green-400">
                Appointment Confirmed 🎉
              </h2>
              <p className="mt-2 text-sm">
                {formattedDate} at {time}
              </p>
              <p className="text-sm">
                with <strong>Vista</strong>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!isConfirmed && (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6">
              Book with Vista
            </h2>
            <div className="text-center text-sm mb-4">
              <p>
                <span className="font-medium">Date:</span> {formattedDate}
              </p>
              <p>
                <span className="font-medium">Time:</span> {time}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <Input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
              <Input
                type="text"
                placeholder="Current Job/Title"
                value={formData.job}
                onChange={(e) =>
                  setFormData({ ...formData, job: e.target.value })
                }
                required
              />
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Booking..." : "Confirm Appointment"}
              </Button>
              <Button
                variant="outline"
                className="mb-6"
                onClick={() => navigate(-1)}
              >
                ← Go Back
              </Button>
            </form>
          </>
        )}

        {isConfirmed && (
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        )}
      </div>
    </div>
  );
};

export default Form;
