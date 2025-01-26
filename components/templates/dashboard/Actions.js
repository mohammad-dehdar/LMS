"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useConfettiStore } from "@/hooks/use-confetti-store";

import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"

import ConfirmModal from "@/components/modals/ConfirmModal"
import toast from "react-hot-toast";
import axios from "axios";

function Actions({ disabled, courseId, chapterId, isPublished }) {
    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}`);

            toast.success("Course Deleted");
            router.push(`/teacher/courses`)
        } catch (error) {
            toast.error("Somthing went wrong");
        }finally {
            setIsLoading(false);
        }
    }

    const publishHandler = async () => {
        try {
            setIsLoading(true);
            if(isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`)
                toast.success("Course unpublished")
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`)
                toast.success("Course published")    
                useConfettiStore.getState().onOpen();
            }

            router.refresh()
        } catch (error) {
            toast.error("Somthing went wrong");
        }finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={publishHandler}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isPublished ? "Unpublish" : "publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}

export default Actions