"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import Link from "next/link"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormLabel,
    FormMessage,
    FormItem,

} from "@/components/ui/form"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RouteMatcher } from "next/dist/server/future/route-matchers/route-matcher"
import ToastProvider from "@/components/Provider/ToastProvider"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"


const formSchema = z.object({
    title: z.string().min(1, { message: "Title is Required" })
})

function CreatePage() {
    const router = useRouter();
    const form = useForm({ resolver: zodResolver(formSchema), default: { title: "" }, });
    const { isSubmitting, isValid } = form.formState;
    const submitHandler = (values) => {
        try {
            const response = axios.post("api/course", values);
            router.push(`/teacher/courses/${response.data.id}`)
        } catch  {
            toast.error("somthing went wrong");
        }
    }
    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl"> Your Course</h1>
                <p className="text-sm text-slate-600">What Whould you like to name your course? Don&apos;t worry you can change it later</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitHandler)}
                        className="space-y-8 mt-8"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Course Title
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabble={isSubmitting}
                                            placeholder="e.g  'advance web development'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        What will you teach in this Course?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Link href="/">
                                <Button
                                    type="button"
                                    variant="ghost"
                                >
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                            >
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default CreatePage