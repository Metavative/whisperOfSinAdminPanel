"use client";

import React from "react";
import Image from "next/image"; // Use Next.js Image component for optimization
import upload_area from "@/icons/upload_area.png"; // Assuming this is your default upload image path

type FileInputExampleProps = {
  // Props for images
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
  // New props for videos
  video1: File | null;
  setVideo1: React.Dispatch<React.SetStateAction<File | null>>;
  video2: File | null;
  setVideo2: React.Dispatch<React.SetStateAction<File | null>>;
};

export default function FileInputExample({
  image1, setImage1,
  image2, setImage2,
  image3, setImage3,
  image4, setImage4,
  image5, setImage5,
  video1, setVideo1,
  video2, setVideo2,
}: FileInputExampleProps) {

  // Helper function to get the preview URL for images
  const getPreviewSrc = (file: File | null) =>
    file ? URL.createObjectURL(file) : upload_area.src;

  // Helper function to get the preview URL for videos
  const getVideoPreviewSrc = (file: File | null) =>
    file ? URL.createObjectURL(file) : null; // Return null if no file, so <video> doesn't try to load invalid src

  return (
    <div className="bg-white p-6 rounded-lg shadow-theme-xs dark:bg-gray-800">
      <div>
        <h1 className="text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-200 font-bold mb-4">Upload Images</h1>

        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {[
            { id: 'image1', src: image1, set: setImage1, alt: 'Upload Image 1' },
            { id: 'image2', src: image2, set: setImage2, alt: 'Upload Image 2' },
            { id: 'image3', src: image3, set: setImage3, alt: 'Upload Image 3' },
            { id: 'image4', src: image4, set: setImage4, alt: 'Upload Image 4' },
            { id: 'image5', src: image5, set: setImage5, alt: 'Upload Image 5' },
          ].map((imgProps) => (
            <label key={imgProps.id} htmlFor={imgProps.id} className="block cursor-pointer">
              <Image
                className="w-20 h-20 object-cover border rounded"
                src={getPreviewSrc(imgProps.src)}
                alt={imgProps.alt}
                width={80}
                height={80}
                priority
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

        <h1 className="text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-200 font-bold mb-4">Upload Videos (Max 2)</h1>
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {[
            { id: 'video1', src: video1, set: setVideo1, alt: 'Upload Video 1' },
            { id: 'video2', src: video2, set: setVideo2, alt: 'Upload Video 2' },
          ].map((vidProps) => (
            <div key={vidProps.id} className="relative w-24 h-24"> {/* Added a wrapper div for relative positioning */}
              <label htmlFor={vidProps.id} className="block cursor-pointer">
                {vidProps.src ? (
                  <video
                    className="w-24 h-24 object-cover border rounded"
                    src={getVideoPreviewSrc(vidProps.src) || undefined}
                    controls
                    autoPlay
                    loop
                    muted
                    width={100}
                    height={100}
                  />
                ) : (
                  <Image
                    className="w-24 h-24 object-cover border rounded"
                    src={upload_area.src}
                    alt={vidProps.alt}
                    width={100}
                    height={100}
                    priority
                  />
                )}
                
                <input
                  onChange={(e) => vidProps.set(e.target.files?.[0] || null)}
                  type="file"
                  id={vidProps.id}
                  hidden
                  accept="video/*"
                />
              </label>
              {vidProps.src && ( // Only show replace button if a video is selected
                <label
                  htmlFor={vidProps.id}
                  className="absolute bottom-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  Replace
                </label>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
