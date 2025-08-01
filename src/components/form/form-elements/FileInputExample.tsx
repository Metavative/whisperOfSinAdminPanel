"use client";

import React from "react";
import Image from "next/image"; // Use Next.js Image component for optimization
import upload_area from "@/icons/upload_area.png"; // Assuming this is your default upload image path

type FileInputExampleProps = {
  // Define props for each individual image state and its setter
  image1: File | null;
  setImage1: React.Dispatch<React.SetStateAction<File | null>>;
  image2: File | null;
  setImage2: React.Dispatch<React.SetStateAction<File | null>>;
  image3: File | null;
  setImage3: React.Dispatch<React.SetStateAction<File | null>>;
  image4: File | null;
  setImage4: React.Dispatch<React.SetStateAction<File | null>>;
  image5: File | null;
  setImage5: React.Dispatch<React.SetStateAction<File | null>>;
};

export default function FileInputExample({
  image1, setImage1,
  image2, setImage2,
  image3, setImage3,
  image4, setImage4,
  image5, setImage5,
}: FileInputExampleProps) {

  // Helper function to get the preview URL (and revoke it on unmount if needed for performance)
  // For simplicity, we'll just create the URL on render. Browsers handle cleanup relatively well.
  const getPreviewSrc = (file: File | null) =>
    file ? URL.createObjectURL(file) : upload_area.src;

  return (
    <div className="bg-white p-6 rounded-lg shadow-theme-xs dark:bg-gray-800">
      <div>
        <h1 className=" text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-200 font-bold">Upload Images</h1>

        <div className="flex justify-center gap-4 mb-6">
          {[
            { id: 'image1', src: image1, set: setImage1, alt: 'Upload Image 1' },
            { id: 'image2', src: image2, set: setImage2, alt: 'Upload Image 2' },
            { id: 'image3', src: image3, set: setImage3, alt: 'Upload Image 3' },
            { id: 'image4', src: image4, set: setImage4, alt: 'Upload Image 4' },
            { id: 'image5', src: image5, set: setImage5, alt: 'Upload Image 5' },
          ].map((imgProps) => (
            <label key={imgProps.id} htmlFor={imgProps.id} className="block"> {/* Added block for better spacing/click area */}
              <Image
                className="w-20 h-20 object-cover border cursor-pointer rounded"
                src={getPreviewSrc(imgProps.src)}
                alt={imgProps.alt}
                width={80} // Specify width and height for Next.js Image component
                height={80}
                priority // Consider for immediate display, but use sparingly
              />
              <input
                onChange={(e) => imgProps.set(e.target.files?.[0] || null)}
                type="file"
                id={imgProps.id}
                hidden
                accept="image/*"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}