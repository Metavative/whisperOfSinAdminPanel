"use client";

import React, { useState, useEffect } from "react"; // Import useEffect

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  // Make 'value' the primary source of truth for controlled behavior
  value: string; // This prop will be controlled by the parent component (e.g., category state)
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  value, // Destructure 'value' prop
}) => {
  // Use 'value' prop directly as the controlled value
  // No need for internal selectedValue state unless you want uncontrolled behavior,
  // but for pre-filling edit forms, controlled is better.

  // Optional: If you *insist* on an internal state that syncs with the prop,
  // you can do this, but usually, 'value' prop is enough for controlled inputs.
  // const [internalValue, setInternalValue] = useState(value);
  // useEffect(() => {
  //   setInternalValue(value);
  // }, [value]);


  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    onChange(newValue); // Simply pass the new value up to the parent
    // If using internalValue state: setInternalValue(newValue);
  };

  return (
    <select
      className={`h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
        value // Use the 'value' prop directly for conditional styling
          ? "text-gray-800 dark:text-white/90"
          : "text-gray-400 dark:text-gray-400"
      } ${className}`}
      value={value} // This makes it a controlled component using the 'value' prop
      onChange={handleChange}
    >
      {/* Placeholder option */}
      {/* Conditionally render placeholder if current value is empty or not found in options */}
      {(!value || !options.some(option => option.value === value)) && (
        <option
          value="" // Value for the placeholder should typically be an empty string
          disabled // Make it disabled so it can't be selected once a real option is chosen
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {placeholder}
        </option>
      )}

      {/* Map over options */}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;