import { auth } from "@clerk/nextjs/server"
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {
    const { userId } = await auth();
    if (!userId) throw new UploadThingError("Unauthorized");
    return { userId };
}

export const ourFileRouter = {
    courseImage: f({ 
        image: { 
            maxFileSize: "4MB", 
            maxFileCount: 1 
        }
    })
    .middleware(async () => {
        return await handleAuth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
        console.log("Upload completed for userId:", metadata.userId);
        console.log("File URL:", file.url);
        return { uploadedBy: metadata.userId };
    }),

    courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(async () => {
        return await handleAuth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
        console.log("Attachment uploaded by:", metadata.userId);
        console.log("File URL:", file.url);
        return { uploadedBy: metadata.userId };
    }),

    chapterVideo: f({ 
        video: { 
            maxFileCount: 1, 
            maxFileSize: "512GB"
        }
    })
    .middleware(async () => {
        return await handleAuth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
        console.log("Video uploaded by:", metadata.userId);
        console.log("File URL:", file.url);
        return { uploadedBy: metadata.userId };
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;