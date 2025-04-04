"use client";
import React, { useEffect, useState } from "react";

const DeliverySlotSelector = ({ onSlotSelect }) => {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    // Fetch time slots from backend
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
  }, []);

  const generateDateOptions = () => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return {
        value: date.toISOString().split("T")[0], // e.g., "2025-04-01"
        label: date.toDateString(), // e.g., "Tue Apr 01 2025"
      };
    });
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    onSlotSelect({ date, time: selectedTime });
  };

  const handleTimeChange = (e) => {
    const time = e.target.value;
    setSelectedTime(time);
    onSlotSelect({ date: selectedDate, time });
  };

  return (
    <div className="space-y-4 mt-6">
      <div>
        <label className="block font-semibold mb-1">Select Delivery Date</label>
        <select
          value={selectedDate}
          onChange={handleDateChange}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Choose a date --</option>
          {generateDateOptions().map((d, i) => (
            <option key={i} value={d.value}>
              {d.label}
            </option>
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
            <option key={slot.slot_id} value={slot.slot_details}>
              {slot.slot_details}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DeliverySlotSelector;
