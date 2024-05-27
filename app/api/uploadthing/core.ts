import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { auth } from "@clerk/nextjs/server";
 
const f = createUploadthing();

const handleAuth = () => {
    const {userId} = auth();
    if(!userId) throw new Error("Unauthorized")
        return {userId: userId}
}
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Example "profile picture upload" route - these can be named whatever you want!
  serverImage: f(["image"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
 
  // Takes exactly ONE image up to 2MB
  strictImageAttachment: f({
    image: { maxFileSize: "2MB", maxFileCount: 1, minFileCount: 1 },
  })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
 
  // Takes up to 4 2mb images and/or 1 256mb video
  messageFile: f({
    image: { maxFileSize: "2MB", maxFileCount: 4 },
    video: { maxFileSize: "256MB", maxFileCount: 1 },
    pdf: { maxFileSize: "2MB", maxFileCount: 4 },
    "application/msword": { maxFileSize: "2MB", maxFileCount: 4 },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "2MB", maxFileCount: 4 },
    "application/vnd.ms-word.document.macroenabled.12": { maxFileSize: "2MB", maxFileCount: 4 },
  })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;