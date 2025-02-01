"use client"

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

function CourseProgressButton({
    chapter,
    courseId,
    isCompleted,
    nextChapterId,
}) {
    const Icon = isCompleted ? XCircle : CheckCircle;

  return (
    <Button
    type="button"
    variant={isCompleted ? "outline" : "success"}
    >
        {isCompleted ? "Not completed" : "Mark as Completed"}
        <Icon className="h-4 w-4 ml-2"/>
    </Button>
  )
}

export default CourseProgressButton