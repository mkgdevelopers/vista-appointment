import { useEffect, useState } from "react";
import { client } from "@/sanity";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

const weekdays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const TimeSlots = () => {
  const [data, setData] = useState({});
  const [inputs, setInputs] = useState({});

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const results = await client.fetch(`*[_type == "timeSlotConfig"]`);
      const formatted = {};
      results.forEach((doc) => {
        formatted[doc.day] = { ...doc };
      });
      setData(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSlot = async (day) => {
    const value = inputs[day]?.trim();
    if (!value) return;

    const existing = data[day];
    const newSlots = [...(existing?.slots || []), value];

    try {
      if (existing) {
        await client.patch(existing._id).set({ slots: newSlots }).commit();
      } else {
        await client.create({
          _type: "timeSlotConfig",
          day,
          slots: [value],
        });
      }

      toast.success(`Slot added for ${capitalize(day)}`);
      setInputs({ ...inputs, [day]: "" });
      fetchSlots();
    } catch (err) {
      toast.error("Failed to add slot");
    }
  };

  const handleDeleteSlot = async (day, slot) => {
    const existing = data[day];
    if (!existing) return;

    const newSlots = existing.slots.filter((s) => s !== slot);

    try {
      await client.patch(existing._id).set({ slots: newSlots }).commit();
      toast.success(`Slot removed from ${capitalize(day)}`);
      fetchSlots();
    } catch {
      toast.error("Failed to delete slot");
    }
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {weekdays.map((day) => {
        const slots = data[day]?.slots || [];

        return (
          <Card key={day} className="p-4">
            <h2 className="font-semibold text-lg mb-2">
              {capitalize(day)}
            </h2>

            <div className="flex flex-wrap gap-2 mb-4">
              {slots.map((slot, idx) => (
                <div
                  key={idx}
                  className="bg-muted px-2 py-1 rounded-full flex items-center gap-1 text-sm"
                >
                  {slot}
                  <Trash2
                    size={14}
                    className="cursor-pointer text-red-500"
                    onClick={() => handleDeleteSlot(day, slot)}
                  />
                </div>
              ))}

              {slots.length === 0 && (
                <span className="text-muted-foreground text-sm">
                  No slots set.
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="e.g. 10:00 AM"
                value={inputs[day] || ""}
                onChange={(e) =>
                  setInputs({ ...inputs, [day]: e.target.value })
                }
              />
              <Button size="icon" onClick={() => handleAddSlot(day)}>
                <Plus size={18} />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default TimeSlots;
