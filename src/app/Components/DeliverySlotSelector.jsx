"use client";
import { useEffect, useState } from "react";

const DeliverySlotSelector = ({ onSlotSelect }) => {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const getStartDayOffset = () => {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 9 ? 1 : 0;
  };

  const generateDateOptions = () => {
    const today = new Date();
    const offset = getStartDayOffset();
    const baseDate = new Date(today);
    baseDate.setHours(0, 0, 0, 0);

    return Array.from({ length: 3 }).map((_, i) => {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i + offset);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return {
        value: `${yyyy}-${mm}-${dd}`,
        label: date.toDateString(),
      };
    });
  };

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/slots");
        const data = await res.json();
        setSlots(data);
      } catch (err) {
        console.error("Failed to fetch slots:", err);
      }
    };

    fetchSlots();

    const dateOptions = generateDateOptions();
    if (dateOptions.length > 0) {
      const defaultDate = dateOptions[0].value;
      setSelectedDate(defaultDate);
      onSlotSelect({ slot_date: defaultDate, slot_id: null });
    }
  }, []);

  const handleTimeChange = (e) => {
    const time = e.target.value;
    setSelectedTime(time);

    const selectedSlot = slots.find((s) => s.slot_details === time);

    if (selectedSlot && selectedDate) {
      onSlotSelect({
        slot_id: selectedSlot.slot_id,
        slot_date: selectedDate,
      });
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);

    const selectedSlot = slots.find((s) => s.slot_details === selectedTime);

    if (selectedSlot && date) {
      onSlotSelect({
        slot_id: selectedSlot.slot_id,
        slot_date: date,
      });
    } else {
      onSlotSelect({ slot_date: date, slot_id: null });
    }
  };

  const dateOptions = generateDateOptions();

  return (
    <div className="space-y-4 mt-6">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded shadow-sm">
        🚫 <strong>No same day delivery</strong> on ordering after <strong>9:00 AM</strong>
      </div>

      <div>
        <label className="block font-semibold mb-1 mt-2">Select Delivery Date</label>
        <select
          value={selectedDate}
          onChange={handleDateChange}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Choose a date --</option>
          {dateOptions.map((d, i) => (
            <option key={i} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">Select Delivery Time Slot</label>
        <select
          value={selectedTime}
          onChange={handleTimeChange}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Choose a time slot --</option>
          {slots.map((slot) => (
            <option key={slot.slot_id} value={slot.slot_details}>{slot.slot_details}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DeliverySlotSelector;
