"use client"

import * as z from "zod"
import axios from "axios"
import { useForm } from "react-hook-form"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Combobox } from "@/components/ui/combobox"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
    categoryId: z.string().min(1)
})

function CategoryForm({ initialData, courseId, options }) {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData?.categoryId || ""
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const submitHandler = async (values) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course Updated")
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    const selectedOtions = options.find(option => option.value === initialData.categoryId)

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course category
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit category
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn("text-sm mt-2", !initialData.categoryId && "text-slate-500 italic")}>{selectedOtions?.label ? selectedOtions?.label : "No category" }</p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Combobox
                                            options={options}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button disabled={!isValid || isSubmitting} type="submit">
                                Save
                            </Button>
                        </div>
                    </form>

                </Form>
            )}
        </div>
    )
}

export default CategoryForm;