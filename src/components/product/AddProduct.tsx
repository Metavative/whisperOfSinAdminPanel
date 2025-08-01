"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs";
import FileInputExample from "@/components/form/form-elements/FileInputExample";
import RadioButtons from "@/components/form/form-elements/RadioButtons";
import ToggleSwitch from "@/components/form/form-elements/ToggleSwitch";
import React, { useState } from "react";
import axios from "axios";
import StatusMessage from "@/components/common/SetStatusMessage"; // Import StatusMessage

export default function AddProduct() {
  // Individual state variables for each image, managed by this parent component
  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [image3, setImage3] = useState<File | null>(null);
  const [image4, setImage4] = useState<File | null>(null);
  const [image5, setImage5] = useState<File | null>(null);

  // Other product details states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [hot, setHot] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [bidProduct, setBidProduct] = useState(false);
  const [bidtimer, setBidTimer] = useState<Date | null>(null);
  const [reviews, setReviews] = useState('');
  const [location, setLocation] = useState('');

  // State for submission feedback
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitStatus('loading');
    setSubmitMessage('Adding product...');

    const formData = new FormData();

    // Append text fields
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('location', location);
    formData.append('reviews', reviews);
    formData.append('hot', String(hot));
    formData.append('featured', String(featured));
    formData.append('newArrival', String(newArrival));
    formData.append('bidProduct', String(bidProduct));

    if (bidProduct && !bidtimer) {
      setSubmitStatus('error');
      setSubmitMessage("Bid timer is required for bid products.");
      return;
    }

    if (bidtimer) {
      formData.append('bidtimer', bidtimer.toISOString());
    }

    const imagesToUpload = [image1, image2, image3, image4, image5];

    imagesToUpload.forEach((file, index) => {
      if (file instanceof File) {
        formData.append(`image${index + 1}`, file, file.name);
      }
    });

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setSubmitStatus('error');
        setSubmitMessage('Authentication token not found. Please log in.');
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/create-product`,
        formData,
        {
          headers: {
            'access_token': token
          },
        }
      );

      console.log('Product added successfully:', response.data);
      setSubmitStatus('success');
      setSubmitMessage(response.data.message || 'Product created successfully!');

      // --- REMOVED: Code to reset form fields after successful submission ---
      // If you want the fields to remain populated, simply remove this block:
      /*
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('');
      setHot(false);
      setFeatured(false);
      setNewArrival(false);
      setBidProduct(false);
      setBidTimer(null);
      setReviews('');
      setLocation('');
      setImage1(null);
      setImage2(null);
      setImage3(null);
      setImage4(null);
      setImage5(null);
      */
      // -------------------------------------------------------------------

    } catch (error: any) {
      console.error('Error adding product:', error);
      setSubmitStatus('error');
      if (axios.isAxiosError(error) && error.response) {
        setSubmitMessage(`Failed to add product: ${error.response.data?.message || error.response.statusText || error.message}`);
      } else if (axios.isAxiosError(error) && error.request) {
        setSubmitMessage('Network Error: Could not connect to the server. Please check your connection or server status.');
      } else {
        setSubmitMessage('An unexpected error occurred while adding the product.');
      }
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Add Product" />
      <StatusMessage status={submitStatus} message={submitMessage} /> {/* Display status message here */}
      <form onSubmit={handlerSubmit} className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <DefaultInputs
            title={title} setTitle={setTitle}
            description={description} setDescription={setDescription}
            price={price} setPrice={setPrice}
            category={category} setCategory={setCategory}
            location={location} setLocation={setLocation}
            reviews={reviews} setReviews={setReviews}
          />
        </div>
        <div className="space-y-6">
          <FileInputExample
            image1={image1} setImage1={setImage1}
            image2={image2} setImage2={setImage2}
            image3={image3} setImage3={setImage3}
            image4={image4} setImage4={setImage4}
            image5={image5} setImage5={setImage5}
          />
          <RadioButtons initialBidProduct={bidProduct} initialBidTimer={bidtimer} setBidProduct={setBidProduct} setBidTimer={setBidTimer} />
          <ToggleSwitch
            setHot={setHot}
            setFeatured={setFeatured}
            setNewArrival={setNewArrival}
            initialHot={hot} // Pass initial values to ToggleSwitch for display
            initialFeatured={featured}
            initialNewArrival={newArrival}
          />
        </div>
        <div className="col-span-2">
          <button type="submit" className="btn px-4 py-2 bg-blue-500  w-full dark:text-white" disabled={submitStatus === 'loading'}>
            {submitStatus === 'loading' ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}