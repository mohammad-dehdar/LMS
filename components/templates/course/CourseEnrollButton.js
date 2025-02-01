"use client"

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"
import axios from "axios";
import { useState } from "react"
import toast from "react-hot-toast";

function CourseEnrollButton({price,courseId}) {
  const[isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
  
      const response = await axios.post(`/api/courses/${courseId}/checkout`);
      
      console.log("Redirecting to:", response.data.url);
      window.location.assign(response.data.url)
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
      setIsLoading(false); // Ensure isLoading is reset on error
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Button
    onClick={onClick}
    disabled={isLoading}
    size="sm" 
    className="w-full md:w-auto">
        Enroll for {formatPrice(price)}
    </Button>
  )
}

export default CourseEnrollButton