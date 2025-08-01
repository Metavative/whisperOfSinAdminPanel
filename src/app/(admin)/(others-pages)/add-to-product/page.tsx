
import AddProduct from "@/components/product/AddProduct";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:
    "Add To Product | Whisper Of Sins E-commerce Dashboard | Metavaitive",
  description: "This is the Whisper Of Sins Admin panel for managing e-commerce functionalities.",
};
export default function AddToProduct() {
   
    
  return <AddProduct />
}
