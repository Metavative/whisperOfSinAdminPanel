"use client";
import React from 'react';
import ComponentCard from '../../common/ComponentCard';
import Label from '../Label';
import Input from '../input/InputField'; // Assuming InputField is your Input component
import Select from '../Select';
import { ChevronDownIcon } from '../../../icons';
import TextArea from '../input/TextArea'; // Your custom TextArea component

type DefaultInputsProps = {
  setTitle: (title: string) => void;
  title: string;
  description: string;
  setDescription: (description: string) => void;
  price: string;
  setPrice: (price: string) => void;
  category: string;
  setCategory: (category: string) => void;
  location: string;
  setLocation: (location: string) => void;
  reviews: string;
  setReviews: (review: string) => void;
}

export default function DefaultInputs({
  setTitle,
  title,
  description,
  setDescription,
  price,
  setPrice,
  category,
  setCategory,
  // location,
  // setLocation,
  reviews,
  setReviews
}: DefaultInputsProps) {
  const options = [
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
  ];

  console.log(description)

  // This one is for your custom Select component, which likely passes just the value
  const handleSelectChange = (value: string) => {
    setCategory(value);
    console.log("Selected value:", value);
  };

  // --- CORRECTED onChange HANDLERS FOR Input COMPONENTS ---
  // These now correctly expect the standard React ChangeEvent
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReviews(e.target.value);
  };

  // const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setLocation(e.target.value);
  // };

  // --- This one is for your custom TextArea component ---
  // It correctly expects just the string value, as per your TextArea.tsx
  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };


  return (
    <ComponentCard title="Default Inputs">
      <div className="space-y-6">
        <div>
          <Label>Product Name</Label>
          <Input type="text" placeholder='e.g: Mask Classic' value={title} defaultValue={title} onChange={handleTitleChange} />
        </div>

        <div>
          <Label>Select Category</Label>
          <div className="relative">
            <Select
              options={options}
              value={category} // This should be a string, not an object
              placeholder="Select an option"
              onChange={handleSelectChange} // Select component likely passes value directly
              className="dark:bg-dark-900"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>
        <div>
          <Label>Product Price</Label>
          <div className="relative">
            <Input
              type={'number'}
              placeholder="Enter product price"
              value={price}
              defaultValue={price} // Use defaultValue for initial render
              className="pl-[62px]"
              onChange={handlePriceChange}
            />
          </div>
        </div>

        <div>
          <Label>Description</Label>
          <TextArea
            placeholder="Write something here about your product..."
            rows={6}
            value={description}
            
            onChange={handleDescriptionChange} // This one takes 'value: string'
            hint="Please enter a valid message."
          />
        </div>

        <div>
          <Label htmlFor="review-input">Enter Review</Label>
          <div className="relative">
            <Input
              type="text"
              id="review-input"
              placeholder="Review"
              defaultValue={reviews} // Use defaultValue for initial render
              className="pl-[62px]"
              value={reviews}
              onChange={handleReviewChange}
            />
            <span className="absolute left-0 top-1/2 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 20H21M3 20H4.67454C5.16372 20 5.40832 20 5.63849 19.9447C5.84256 19.8957 6.03765 19.8149 6.21694 19.7053C6.41843 19.5816 6.59138 19.4086 6.93729 19.0627L19.5 6.5C20.3285 5.67157 20.3285 4.32843 19.5 3.5C18.6716 2.67157 17.3285 2.67157 16.5 3.5L3.93726 16.0627C3.59136 16.4086 3.41840 16.5816 3.29472 16.7831C3.18514 16.9624 3.10425 17.1574 3.05526 17.3615C3 17.5917 3 17.8363 3 18.3255V20Z"
                  stroke="#4B5563"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.5 6.5L17.5 10.5"
                  stroke="#4B5563"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* <div>
          <Label htmlFor="location-input">Enter your Shop Location</Label>
          <div className="relative">
            <Input
              type="text"
              id="location-input"
              placeholder="Location"
              className="pl-[62px]"
              value={location}
              defaultValue={location} // Use defaultValue for initial render
              onChange={handleLocationChange}
            />
            <span className="absolute left-0 top-1/2 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
              <svg
                width="20"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C8.68629 2 6 4.68629 6 8C6 12.25 12 22 12 22C12 22 18 12.25 18 8C18 4.68629 15.3137 2 12 2Z"
                  stroke="#E80B26"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="8" r="2.5" fill="#F59D31" />
              </svg>
            </span>
          </div>
        </div> */}
      </div>
    </ComponentCard>
  );
}