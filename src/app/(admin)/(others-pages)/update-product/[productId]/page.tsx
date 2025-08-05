"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs";
import RadioButtons from "@/components/form/form-elements/RadioButtons";
import ToggleSwitch from "@/components/form/form-elements/ToggleSwitch";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Image from "next/image";
import upload_area from "@/icons/upload_area.png";
import StatusMessage from "@/components/common/SetStatusMessage"; // Import StatusMessage component

// Define the Product type to ensure type safety for product data
interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  reviews: string;
  image: string[]; // Assuming Cloudinary returns an array of URLs
  video?: string[]; // Added video field to Product interface
  hot: boolean;
  featured: boolean;
  newArrival: boolean;
  bidProduct: boolean;
  bidtimer?: string; // Optional, as it's for bid products
  createdAt: string;
  updatedAt: string;
}

export default function EditProductPage() {
  const params = useParams();
  const productId = params.productId as string;

  // State to hold the full fetched product data
  const [productData, setProductData] = useState<Product | null>(null);

  // States for initial product data loading feedback
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [initialDataError, setInitialDataError] = useState<string | null>(null);

  // Form field states (these are controlled states for the inputs)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [reviews, setReviews] = useState('');
  const [hot, setHot] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [bidProduct, setBidProduct] = useState(false);
  const [bidtimer, setBidTimer] = useState<Date | null>(null);

  // Image states: currentImageUrls are from the fetched product, newImages are local File objects
  const [currentImageUrls, setCurrentImageUrls] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<(File | null)[]>([null, null, null, null, null]);

  // Video states: currentVideoUrls are from the fetched product, newVideos are local File objects
  const [currentVideoUrls, setCurrentVideoUrls] = useState<string[]>([]);
  const [newVideos, setNewVideos] = useState<(File | null)[]>([null, null]); // Max 2 videos

  // States for form submission feedback
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  // Effect to fetch product data when component mounts or productId changes
  useEffect(() => {
    if (!productId) {
      setInitialDataError("Product ID is missing.");
      setLoadingInitialData(false);
      return;
    }

    const fetchProduct = async () => {
      setLoadingInitialData(true);
      setInitialDataError(null); // Clear previous errors
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          setInitialDataError("Authentication token not found. Please log in.");
          setLoadingInitialData(false);
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get?productId=${productId}`, {
          headers: {
            'access_token': token,
          },
          params: {
            t: Date.now() // Bypass caching
          }
        });

        const fetchedProduct = response.data.product || response.data.products?.[0];

        if (fetchedProduct) {
          setProductData(fetchedProduct);
        } else {
          setInitialDataError("Product not found.");
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        if (axios.isAxiosError(err) && err.response) {
          setInitialDataError(`Error: ${err.response.data?.message || err.response.statusText}`);
        } else {
          setInitialDataError("An unexpected error occurred while fetching the product.");
        }
      } finally {
        setLoadingInitialData(false);
      }
    };

    fetchProduct();
  }, [productId]); // Re-run when productId changes

  // Effect to populate form fields once productData is fetched
  useEffect(() => {
    if (productData) {
      console.log(productData);
      setTitle(productData.title);
      setDescription(productData.description);
      setPrice(String(productData.price));
      setCategory(productData.category);
      setLocation(productData.location);
      setReviews(productData.reviews);
      setHot(productData.hot);
      setFeatured(productData.featured);
      setNewArrival(productData.newArrival);
      setBidProduct(productData.bidProduct);
      // setBidTimer(productData.bidtimer ? new Date(productData.bidtimer) : null);
          setBidTimer(productData.bidtimer && productData.bidtimer !== "" ? new Date(productData.bidtimer) : null);

      setCurrentImageUrls(productData.image || []);
      setNewImages([null, null, null, null, null]); // Reset new images on load of a new product

      setCurrentVideoUrls(productData.video || []); // Populate current video URLs
      setNewVideos([null, null]); // Reset new videos on load of a new product
    }
  }, [productData]); // Re-run when productData changes

  // Helper function to get the preview URL for images (mix of File and string URL)
  const getPreviewSrc = (index: number) => {
    if (newImages[index]) {
      return URL.createObjectURL(newImages[index] as File);
    }
    if (currentImageUrls[index]) {
      return currentImageUrls[index];
    }
    return upload_area.src;
  };

  // Helper function to get the preview URL for videos
  const getVideoPreviewSrc = (file: File | null | string) => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    if (typeof file === 'string') {
      return file; // It's an existing URL
    }
    return null; // No file or URL
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0] || null;
    setNewImages(prev => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
    // If a new file is selected, remove the corresponding current URL
    if (file && currentImageUrls[index]) {
      setCurrentImageUrls(prev => {
        const updated = [...prev];
        updated[index] = ''; // Clear the old URL at this position
        return updated;
      });
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0] || null;
    setNewVideos(prev => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
    // If a new file is selected, remove the corresponding current URL
    if (file && currentVideoUrls[index]) {
      setCurrentVideoUrls(prev => {
        const updated = [...prev];
        updated[index] = ''; // Clear the old URL at this position
        return updated;
      });
    }
  };

  const handlerUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!productData) {
      setSubmitStatus('error');
      setSubmitMessage("Product data not loaded. Cannot update.");
      return;
    }

    setSubmitStatus('loading');
    setSubmitMessage('Updating product...');

    const formData = new FormData();

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

    // Append new image files
    newImages.forEach((file, index) => {
      if (file instanceof File) {
        formData.append(`image${index + 1}`, file, file.name);
      }
    });
    // Append existing image URLs that were not replaced
    formData.append('existingImageUrls', JSON.stringify(currentImageUrls.filter(url => url !== '')));


    // Append new video files
    newVideos.forEach((file, index) => {
      if (file instanceof File) {
        formData.append(`video${index + 1}`, file, file.name);
      }
    });
    // Append existing video URLs that were not replaced
    formData.append('existingVideoUrls', JSON.stringify(currentVideoUrls.filter(url => url !== '')));


    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setSubmitStatus('error');
        setSubmitMessage('Authentication token not found. Please log in.');
        return;
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/update-product/${productId}`,
        formData,
        {
          headers: {
            'access_token': token,
            'Content-Type': 'multipart/form-data', // Important for FormData
          },
        }
      );

      console.log('Product updated successfully:', response.data);
      setSubmitStatus('success');
      setSubmitMessage(response.data.message || 'Product updated successfully!');
      // Re-fetch product data to update the UI with new URLs
      // Note: This will reset `newImages` and `newVideos` states.
      // If you want to keep the uploaded files in the UI until next page load,
      // you'd need a more complex state management for file previews.
      // For now, re-fetching will show the updated Cloudinary URLs.
      // fetchProduct(); // This would be the function to re-fetch product details
    } catch (error) {
      console.error('Error updating product:', error);
      setSubmitStatus('error');
      if (axios.isAxiosError(error) && error.response) {
        setSubmitMessage(`Failed to update product: ${error.response.data?.message || error.response.statusText}`);
      } else if (axios.isAxiosError(error) && error.request) {
        setSubmitMessage('Network Error: Could not connect to the server. Please check your connection or server status.');
      } else {
        setSubmitMessage('An unexpected error occurred while updating the product.');
      }
    }
  };

  // Conditional rendering based on initial data loading status
  if (loadingInitialData) {
    return (
      <div className="container mx-auto p-4">
        <PageBreadcrumb pageTitle="Loading Product" />
        <StatusMessage status="loading" message="Loading product details..." />
      </div>
    );
  }

  if (initialDataError) {
    return (
      <div className="container mx-auto p-4">
        <PageBreadcrumb pageTitle="Error Loading Product" />
        <StatusMessage status="error" message={initialDataError} />
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="container mx-auto p-4">
        <PageBreadcrumb pageTitle="Product Not Found" />
        <StatusMessage status="error" message="No product data found for this ID." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <PageBreadcrumb pageTitle={`Edit Product: ${productData.title}`} />
      <form onSubmit={handlerUpdate} className="grid grid-cols-1 gap-6 xl:grid-cols-2">
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
          {/* Image Upload Section */}
          <div className="bg-white p-6 rounded-lg shadow-theme-xs dark:bg-gray-800">
            <h1 className="mb-4 text-lg font-semibold dark:text-white">Upload Images (existing shown, new will replace/add)</h1>
            <div className="flex justify-center gap-4 mb-6 flex-wrap">
              {[0, 1, 2, 3, 4].map((index) => (
                <label key={index} htmlFor={`editImage${index}`} className="block cursor-pointer relative">
                  <Image
                    className="w-20 h-20 object-cover border rounded"
                    src={getPreviewSrc(index)}
                    alt={`Product Image ${index + 1}`}
                    width={80}
                    height={80}
                    priority
                  />
                  <input
                    onChange={(e) => handleImageFileChange(e, index)}
                    type="file"
                    id={`editImage${index}`}
                    hidden
                    accept="image/*"
                  />
                  {/* Small replace button for images - optional, but consistent with video */}
                  {newImages[index] || currentImageUrls[index] ? (
                    <label
                      htmlFor={`editImage${index}`}
                      className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-1 py-0.5 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
                    >
                      Replace
                    </label>
                  ) : null}
                </label>
              ))}
            </div>
          </div>

          {/* Video Upload Section */}
          <div className="bg-white p-6 rounded-lg shadow-theme-xs dark:bg-gray-800">
            <h1 className="text-gray-500 font-bold mb-4 dark:text-gray-200">Upload Videos (Max 2)</h1>
            <div className="flex justify-center gap-4 mb-6 flex-wrap">
              {[0, 1].map((index) => ( // Loop for up to 2 videos
                <div key={`video-${index}`} className="relative w-24 h-24">
                  <label htmlFor={`editVideo${index}`} className="block cursor-pointer">
                    {(newVideos[index] || currentVideoUrls[index]) ? (
                      <video
                        className="w-24 h-24 object-cover border rounded"
                        src={getVideoPreviewSrc(newVideos[index] || currentVideoUrls[index]) || undefined}
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
                        src={upload_area.src} // Generic video placeholder
                        alt={`Upload Video ${index + 1}`}
                        width={100}
                        height={100}
                        priority
                      />
                    )}
                    
                    <input
                      onChange={(e) => handleVideoFileChange(e, index)}
                      type="file"
                      id={`editVideo${index}`}
                      hidden
                      accept="video/*"
                    />
                  </label>
                  {(newVideos[index] || currentVideoUrls[index]) && ( // Only show replace button if a video is selected
                    <label
                      htmlFor={`editVideo${index}`}
                      className="absolute bottom-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
                    >
                      Replace
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          <RadioButtons
            setBidProduct={setBidProduct}
            setBidTimer={setBidTimer}
            initialBidProduct={bidProduct}
            initialBidTimer={bidtimer}
          />
          <ToggleSwitch
            setHot={setHot}
            setFeatured={setFeatured}
            setNewArrival={setNewArrival}
            initialHot={hot}
            initialFeatured={featured}
            initialNewArrival={newArrival}
          />
        </div>

        <div className="col-span-2">
        <StatusMessage status={submitStatus} message={submitMessage} /> {/* Display update status message */}

        <button type="submit" className="btn px-4 py-2 bg-blue-500 w-full dark:text-white" disabled={submitStatus === 'loading'}>
            {submitStatus === 'loading' ? 'Updating Product...' : 'Update Product'}
          </button>

        </div>
      </form>
    </div>
  );
}
