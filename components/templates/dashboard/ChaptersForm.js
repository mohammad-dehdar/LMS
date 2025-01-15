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
import { Pencil, PlusCircle } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

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



    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course description
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
                    No chapters
                    {!initialData.chapters.length && "No chapter"}
                    {/* {TODO: add list of chapters} */}
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