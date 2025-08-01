"use client";
import React from "react";
import ComponentCard from "../../common/ComponentCard";
import Switch from "../switch/Switch"; // Ensure this path is correct

interface ToggleSwitchProps {
  setNewArrival: (value: boolean) => void;
  setFeatured: (value: boolean) => void;
  setHot: (value: boolean) => void;
  initialNewArrival?: boolean;
  initialFeatured?: boolean;
  initialHot?: boolean;
}

export default function ToggleSwitch({ initialFeatured, initialHot, initialNewArrival, setNewArrival, setFeatured, setHot }: ToggleSwitchProps) {

  const handleFeaturedChange = (checked: boolean) => {
    console.log("Featured switch is now:", checked ? "ON" : "OFF");
    setFeatured(checked);
  };
  const handleHotChange = (checked: boolean) => {
    console.log("Hot switch is now:", checked ? "ON" : "OFF");
    setHot(checked);
  };    

  const handleNewArrivalChange = (checked: boolean) => {
    console.log("New Arrival switch is now:", checked ? "ON" : "OFF");
    setNewArrival(checked);
  };

  return (
    <ComponentCard title="Product Status Toggles"> {/* Changed title for clarity */}
      <div className="flex flex-col gap-4"> {/* Changed to flex-col for better stacking */}
        <Switch
          label="Hot Product" // More descriptive label
          defaultChecked={initialHot}
          onChange={handleHotChange}
          color="blue" // Explicitly set color
        />
        <Switch
          label="Featured Product"
          defaultChecked={initialFeatured}
          onChange={handleFeaturedChange}
          color="blue" // Explicitly set color
        />
        <Switch
          label="New Arrival"
          defaultChecked={initialNewArrival}
          onChange={handleNewArrivalChange}
          color="blue" // Explicitly set color
        />
      </div>
    </ComponentCard>
  );
}