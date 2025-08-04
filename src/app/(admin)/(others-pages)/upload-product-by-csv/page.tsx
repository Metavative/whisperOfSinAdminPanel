'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaFileCsv, FaUpload, FaSpinner } from 'react-icons/fa';
import Papa from 'papaparse'; // PapaParse library ko import karein

// Hum PapaParse ko asani se CDN se bhi load kar sakte hain, agar aapko isse package manager se install nahi karna
// <script src="https://unpkg.com/papaparse@5.4.1/papaparse.min.js"></script>

const useAuth = () => {
  // A simple mock for demonstration purposes
  const [user, setUser] = useState<{ id: string; isAdmin: boolean } | null>({ id: 'mock-user-123', isAdmin: true });
  const [isLoading, setIsLoading] = useState(false);
  
  return { user, isLoading };
};

/**
 * This page component provides a UI for administrators to upload a CSV file
 * for bulk product insertion. It validates the file type, handles the
 * API call to the backend, and provides clear user feedback.
 */
export default function UploadProductsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false); // Naya state: parsing ke liye
  const [itemCount, setItemCount] = useState<number | null>(null); // Naya state: items ki tadaad ke liye
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Redirects non-admin users away from this page
  if (!authLoading && (!user || !user.isAdmin)) {
    router.push('/');
    return null;
  }

  /**
   * Handles the file input change event. Validates that the file is a CSV and counts the rows.
   * @param event The file input change event.
   */
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === 'text/csv') {
        setSelectedFile(file);
        setMessage('');
        setIsError(false);
        setItemCount(null); // Naya file select hone par count reset karein
        setIsParsing(true); // Parsing shuru ho gayi

        // CSV file ko parse karna
        Papa.parse(file, {
          header: true, // Pehli row ko headers samjhein
          skipEmptyLines: true, // Khaali lines ko chor dein
          complete: (results) => {
            // Header row ko exclude karne ke liye -1 karte hain
            const count = results.data.length;
            setItemCount(count);
            setIsParsing(false); // Parsing khatam
            setMessage(`CSV file selected. Found ${count} items.`);
          },
          error: (error) => {
            setIsParsing(false);
            setSelectedFile(null);
            setMessage('Error parsing CSV file. Please check its format.');
            setIsError(true);
          }
        });

      } else {
        setSelectedFile(null);
        setItemCount(null);
        setMessage('Invalid file type. Please select a CSV file.');
        setIsError(true);
      }
    }
  };

  /**
   * Handles the form submission. Prepares the file for upload and sends it
   * to the backend API endpoint.
   * @param event The form submission event.
   */
  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setMessage('Please select a CSV file to upload.');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage('');
    setIsError(false);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setMessage('Authentication token not found. Please log in.');
        setIsError(true);
        setIsLoading(false);
        return;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/reate-product-by-csv`, {
        method: 'POST',
        body: formData,
        headers: {
          'access_token': token
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setSelectedFile(null);
        setItemCount(null); // Upload ke baad count reset karein
      } else {
        setMessage(data.message || 'Failed to upload products.');
        setIsError(true);
      }
    } catch (error) {
      setMessage('A network error occurred. Please try again.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-gray-900 text-white p-4">
      <div className="dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-4">Upload Products</h2>
        <p className="text-center text-gray-400 mb-4">
          Upload a CSV file to add multiple products to your database.
        </p>
        <p className="text-center text-gray-400 mb-8 font-medium">
          The CSV file must have the following column headers:
          <br />
          <code className="dark:bg-gray-700 p-1 rounded-md text-sm text-yellow-300">
            title, image, description, reviews, category, price, location, hot, featured, newArrival, bidProduct, bidtimer
          </code>
        </p>

        <form onSubmit={handleUpload}>
          <div className="mb-6">
            <label
              htmlFor="csvFile"
              className="flex items-center justify-center p-6 border-2 border-dashed dark:border-gray-600 rounded-md cursor-pointer hover:border-blue-500 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <FaFileCsv className="h-12 w-12 text-gray-400 mb-2" />
                {selectedFile ? (
                  <>
                    <span className="text-blue-400 font-medium">{selectedFile.name}</span>
                    {isParsing ? (
                      <span className="text-gray-400 mt-2 flex items-center">
                        <FaSpinner className="animate-spin mr-2" /> Parsing file...
                      </span>
                    ) : (
                      itemCount !== null && (
                        <span className="text-green-500 mt-2 font-semibold">
                          Items Found: {itemCount}
                        </span>
                      )
                    )}
                  </>
                ) : (
                  <span className="text-gray-400">
                    Click to browse or drag and drop a CSV file.
                  </span>
                )}
              </div>
              <input
                id="csvFile"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
                disabled={isLoading || isParsing}
              />
            </label>
          </div>

          {message && (
            <p
              className={`text-center mb-4 ${
                isError ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
            disabled={isLoading || isParsing || !selectedFile}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <FaUpload className="mr-2" />
                Upload CSV
              </>
            )}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          <Link href="#" className="text-blue-500 hover:underline">
            Download sample CSV template
          </Link>
        </p>
      </div>
    </div>
  );
}
