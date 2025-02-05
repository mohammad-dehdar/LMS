"use client"

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function CourseEnrollButton({price, courseId}) {
  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)
      console.log('Starting checkout process for course:', courseId)
      
      const response = await axios.post(`/api/courses/${courseId}/checkout`)
      console.log('Checkout response:', response.data)
      
      if (response.data.url) {
        window.location.assign(response.data.url)
      } else {
        throw new Error('No checkout URL received')
      }
      
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error("Payment initiation failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size="sm" 
      className="w-full md:w-auto"
    >
      {isLoading ? 'Processing...' : `Enroll for ${formatPrice(price)}`}
    </Button>
  )
}

export default CourseEnrollButton