"use client";
import React, { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Radio from "../input/Radio"; // Assuming this is your custom Radio component
import Label from "../Label";
import Input from "../input/InputField"; // Assuming InputField is your Input component
import DatePicker from '@/components/form/date-picker'; // Import your custom DatePicker component
import { TimeIcon } from '@/icons'; // Assuming TimeIcon and CalenderIcon are exported from here

interface RadioButtonsProps {
  setBidProduct: (value: boolean) => void;
  setBidTimer: (value: Date | null) => void;
  initialBidProduct: boolean;
  initialBidTimer?: Date | null; // This will be a Date object or null
}

export default function RadioButtons({ initialBidProduct, setBidProduct, initialBidTimer, setBidTimer }: RadioButtonsProps) {
  // State for which radio button is selected ('true' for bidding, 'false' for normal)
  const [selectedOption, setSelectedOption] = useState(initialBidProduct ? "true" : "false");

  // State for the date input, formatted as a string for flatpickr/backend (YYYY-MM-DD)
  const [bidDateInput, setBidDateInput] = useState('');
  // State for the time input, formatted as a string for <input type="time"> (HH:mm)
  const [bidTimeInput, setBidTimeInput] = useState('');

  // Helper to combine date string (YYYY-MM-DD) and time string (HH:mm) into a Date object
  const combineDateTime = (dateStr: string, timeStr: string): Date | null => {
    if (!dateStr || !timeStr) return null;
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);
    // Month is 0-indexed in Date constructor
    return new Date(year, month - 1, day, hours, minutes, 0, 0);
  };

  // Effect to initialize states when initial props change (e.g., when editing a product)
  useEffect(() => {
    setSelectedOption(initialBidProduct ? "true" : "false");
    // If there's an initial bid timer, format it for the date and time inputs
    if (initialBidTimer instanceof Date && !isNaN(initialBidTimer.getTime())) {
      // Format to YYYY-MM-DD for the date picker
      const year = initialBidTimer.getFullYear();
      const month = String(initialBidTimer.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
      const day = String(initialBidTimer.getDate()).padStart(2, '0');
      setBidDateInput(`${year}-${month}-${day}`);

      // Format to HH:mm for the time input
      const hours = String(initialBidTimer.getHours()).padStart(2, '0');
      const minutes = String(initialBidTimer.getMinutes()).padStart(2, '0');
      setBidTimeInput(`${hours}:${minutes}`);
    } else {
      setBidDateInput(''); // Clear date input if no initial timer
      setBidTimeInput(''); // Clear time input if no initial timer
    }
  }, [initialBidProduct, initialBidTimer]); // Depend on initial props

  const handleRadioChange = (value: string) => {
    setSelectedOption(value);
    setBidProduct(value === "true");
    // If switching to 'Normal Product', clear the bid timer and input fields
    if (value === "false") {
      setBidTimer(null);
      setBidDateInput('');
      setBidTimeInput('');
    }
  };

  // Handler for Flatpickr's onChange event
  const handleFlatpickrDateChange = (selectedDates: Date[], dateStr: string) => {
    setBidDateInput(dateStr); // Update internal date string state
    const newBidTimer = combineDateTime(dateStr, bidTimeInput);
    setBidTimer(newBidTimer);
  };

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    setBidTimeInput(timeValue); // Update internal time input state

    // Combine current date string and new time string to update the bidTimer Date object
    const newBidTimer = combineDateTime(bidDateInput, timeValue);
    setBidTimer(newBidTimer);
  };

  return (
    <ComponentCard title="Product Type">
      <div className="flex flex-wrap items-center gap-8">
        <Radio
          id="radioNormal"
          name="productType"
          value="false"
          checked={selectedOption === "false"}
          onChange={handleRadioChange}
          label="Normal Product"
        />
        <Radio
          id="radioBidding"
          name="productType"
          value="true"
          checked={selectedOption === "true"}
          onChange={handleRadioChange}
          label="Bidding Product"
        />
      </div>

      {selectedOption === "true"  && ( // Only show bid timer inputs if "Bidding Product" is selected
        <div className="mt-6">
          {/* Bid End Date Input using custom DatePicker */}
          <DatePicker
            id="bidDate"
            label="Bid End Date"
            placeholder="Select bid end date"
            defaultDate={bidDateInput || undefined} // Pass the string for defaultDate
            onChange={handleFlatpickrDateChange}
          />

          {/* Bid End Time Input */}
          <Label htmlFor="bidTime">Bid End Time</Label>
          <div className="relative">
            <Input
              type="time"
              id="bidTime"
              name="bidTime"
              value={bidTimeInput}
              onChange={handleTimeInputChange}
              className="pr-10" // Adjust padding for icon
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <TimeIcon /> {/* Time icon */}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Set the exact date and time for the bidding to end.
          </p>
        </div>
      )}
    </ComponentCard>
  );
}
