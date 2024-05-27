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
    image: { maxFileSize: "2MB", maxFileCount: 1 },
    video: { maxFileSize: "16MB", maxFileCount: 1 },
    "application/pdf": { maxFileSize: "32MB", maxFileCount: 1 },
    "application/msword": { maxFileSize: "32MB", maxFileCount: 1 },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "32MB", maxFileCount: 1 },
    "application/vnd.ms-powerpoint": { maxFileSize: "32MB", maxFileCount: 1 },
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": { maxFileSize: "32MB", maxFileCount: 1 },
    "application/vnd.ms-powerpoint.presentation.macroenabled.12": { maxFileSize: "32MB", maxFileCount: 1 },
    "application/vnd.openxmlformats-officedocument.presentationml.slideshow": { maxFileSize: "32MB", maxFileCount: 1 },
    "application/vnd.ms-powerpoint.slideshow.macroenabled.12": { maxFileSize: "32MB", maxFileCount: 1 },
    "application/vnd.ms-excel": { maxFileSize: "32MB", maxFileCount: 1 },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { maxFileSize: "32MB", maxFileCount: 1 },
    "application/vnd.ms-excel.sheet.macroenabled.12": { maxFileSize: "32MB", maxFileCount: 1 },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.template": { maxFileSize: "32MB", maxFileCount: 1 },
    "application/vnd.ms-excel.template.macroenabled.12": { maxFileSize: "32MB", maxFileCount: 1 }
  })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;