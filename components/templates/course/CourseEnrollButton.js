"use client"

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"

function CourseEnrollButton({price,courseId}) {
  return (
    <Button classname="w-full md:auto">
        Enroll for {formatPrice(price)}
    </Button>
  )
}

export default CourseEnrollButton