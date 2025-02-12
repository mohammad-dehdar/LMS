"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Loader, Loader2, PlusCircle } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

import ChapterList from "@/components/templates/dashboard/ChapterList"

const formSchema = z.object({
    title: z.string().min(1)
})

function ChaptersForm({ initialData, courseId }) {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const toggleCreating = () => {
        setIsCreating((current) => !current);
    }

    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const submitHandler = async (values) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values);
            toast.success("Chapter created")
            toggleCreating();
            router.refresh();
        } catch (error) {
            console.log("Error:", error.response?.data || error.message);
            toast.error("Something went wrong")
        }
    }

    const onReorder = async (updateData) => {
        try {
            setIsUpdating(true);

            axios.put(`/api/courses/${courseId}/chapters/reorder`,{
                list: updateData
            });
            toast.success("Chapter reordered");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsUpdating(false);
        }
    }

    const onEdit = (id) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`);

    }
    return (
        <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 right-0 rounded-md flex items-center justify-center z-50">
                    <Loader2
                        className="animate-spin h-6 w-6"
                    />
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Course chapter
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating && (
                        <>Cancel</>
                    )}
                    {!isCreating && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a chapter
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Introduction to the course'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={!isValid || isSubmitting} type="submit">
                            Create
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div  className={cn("text-sm mt-2", !initialData.chapters.length && "text-slate-500 italic")}>
                    {!initialData.chapters.length && "No chapter"}
                    <ChapterList
                    onEdit={onEdit} 
                    onReorder={onReorder}
                    items = {initialData.chapters || []}
                    />
                </div>

            )}
            {!isCreating && (
                <div className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reorder the chapters
                </div>

            )}
        </div>
    )
}

export default ChaptersForm;