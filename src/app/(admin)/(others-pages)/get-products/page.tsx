"use client"; // This is a client component, necessary for useState, useEffect, and interactivity

import React, { useEffect, useState } from "react";
import axios from "axios";
import PageBreadcrumb from "@/components/common/PageBreadCrumb"; // Assuming you have this breadcrumb component
import Image from "next/image"; // For optimized image loading
import { useRouter } from "next/navigation"; // For navigation



// Define the Product type to ensure type safety for product data
interface Product {
  _id: string;
  title: string;
  description: string;
  price: number; // Assuming price is a number
  category: string;
  location: string;
  reviews: string; // Or string[] if multiple reviews
  image: string[]; // Assuming Cloudinary returns an array of URLs
  hot: boolean;
  featured: boolean;
  newArrival: boolean;
  bidProduct: boolean;
  bidtimer?: string; // Optional, as it's for bid products
  createdAt: string;
  updatedAt: string;
  // Add any other fields your product model has
}

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter(); // For navigation

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get`, {
        headers: {
          'access_token': token, // Use 'access_token' as per your backend middleware
        },
      });
      setProducts(response.data.products); // Assuming response.data is { message, products: [...] }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(`Error: ${err.response.data?.message || err.response.statusText}`);
      } else {
        setError("An unexpected error occurred while fetching products.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return; // User cancelled
    }

    setIsDeleting(true); // Indicate deletion in progress
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert("Authentication token not found. Please log in.");
        setIsDeleting(false);
        return;
      }

      const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/delete-product/${productId}`, {
        headers: {
          'access_token': token, // Use 'access_token' for authenticated delete
        },
      });
      console.log(response.data)

      if (response.data.success) {
        alert(response.data.message || "Product deleted successfully!");
        // Update UI by filtering out the deleted product
        setProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
      } else {
        alert(response.data.message || "Failed to delete product.");
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      if (axios.isAxiosError(err) && err.response) {
        alert(`Failed to delete: ${err.response.data?.message || err.response.statusText}`);
      } else {
        alert("An unexpected error occurred during deletion.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditProduct = (productId: string) => {
    // For "Edit", you'd typically navigate to an edit page with the product ID
    // Example using Next.js useRouter:
    // const router = useRouter();
    // router.push(`/dashboard/products/edit/${productId}`);
    
    // You would then have a new page like src/app/dashboard/products/edit/[productId]/page.tsx
    // that fetches the specific product details and pre-fills an AddProduct-like form.
    router.push(`/update-product/${productId}`); // Navigate to the edit page with product ID
  };

  return (
    <div className="container mx-auto p-4">
      <PageBreadcrumb pageTitle="All Products" />

      {loading && (
        <div className="text-center text-lg font-semibold text-gray-700 dark:text-gray-300">
          Loading products...
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-900 border border-red-300 rounded-lg">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
          No products found.
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
              <div className="relative h-48 w-full overflow-hidden">
                {product.image && product.image.length > 0 ? (
                  <Image
                    src={`${product.image[0]}`} // Display the first image
                    alt={product.title}
                    layout="fill" // Makes the image fill the parent
                    objectFit="cover" // Covers the area without distortion
                    className="transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {product.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                  {product.description}
                </p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ${product.price ? product.price.toFixed(2) : 'N/A'}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Category: {product.category.toUpperCase()}
                  </span>
                </div>
                <div className="flex-grow"></div> {/* Pushes buttons to bottom */}
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleEditProduct(product._id)}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    disabled={isDeleting} // Disable during deletion process
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}