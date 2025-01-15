"use client"

import * as z from "zod"
import axios from "axios"


import { Button } from "@/components/ui/button"
import { File, Loader2, PlusCircle, X } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import FileUpload from "./FileUpload"



const formSchema = z.object({
    url: z.string().min(1),
})

function AttachmentForm({ initialData, courseId }) {
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const submitHandler = async (values) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success("Course Updated")
            toggleEdit();
            router.refresh();
        } catch (error) {
            console.log(error)
        }
    }

    const onDelete = async (id) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment deleted");
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        } finally {
            setDeletingId(null);
        }
    }

   
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course attachment
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a file
                        </>
                    )}
                    
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length ===  0 && (<p className="text-sm mt-2 text-slate-500 italic">No attachments</p>)}
                    {initialData.attachments.length > 0  && (
                        <div className="space-y-2">
                            {initialData.attachments.map((attachment) => 
                                (<div
                                key={attachment.id}
                                className="flex items-center p-3 w-full  border-sky-200 border text-sky-700 rounded-md" 
                                >
                                    <File className="h-4 w-4 mr-2 flex-shrink-0"/>
                                    <p className="text-wrap overflow-x-auto">{attachment.name}</p>
                                    {deletingId === attachment.id && (
                                        <div>
                                            <Loader2 className="h-4 w-4 animate-spin "/>
                                        </div>
                                    )}
                                    {deletingId !== attachment.id && (
                                        <button onClick={() => onDelete(attachment.id)} className="ml-auto hover:opacity-75 transition">
                                            <X className="h-4 w-4 "/>
                                        </button>
                                    )}
                                </div>)
                            )}
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseAttachment"
                        onchange={(url) => {
                            if (url) {
                                submitHandler({url : url})
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Make sure the file you upload is in a supported format (e.g., PDF, DOCX, JPG, PNG) and does not exceed the maximum file size limit of 10MB.
                    </div>
                </div>
            )}
        </div>
    )
}

export default AttachmentForm;