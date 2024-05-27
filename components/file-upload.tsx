"use client"

import {FileIcon, X} from "lucide-react"
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string
    endpoint: "messageFile" | "serverImage"
}
export const FileUpload = ({
    onChange,
    value,
    endpoint
}: FileUploadProps) => {
    const fileType = value?.split(".").pop();
    const isPDF = (
        fileType === "pdf" || fileType === "doc" || fileType === "docx" ||
        fileType === "ppt" || fileType === "pptx" || fileType === "pptm" ||
        fileType === "pps" || fileType === "ppsx" || fileType === "ppsm" ||
        fileType === "xls" || fileType === "xlsx" || fileType === "xlsm" ||
        fileType === "xlt" || fileType === "xltx" || fileType === "xltm"
      );
    const isImage = (fileType === "jpeg" || fileType === "jpg" || fileType === "png" );
    const isVideo = fileType === "mp4";

    if(value && isImage) {
        return (
            <div className="relative h-20 w-20">
                <Image 
                    fill
                    src={value}
                    alt="Upload"
                    className="rounded-full"
                />
                <button
                    onClick={() => onChange("")}
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                    type="button"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }

    if(value && isPDF) {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400"/>
                <a 
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                >
                    {value}
                </a>
                <button
                    onClick={() => onChange("")}
                    className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                    type="button"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }
    if(value && isVideo) {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                
                <video width="250" controls>
                    <source src={value} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <button
                    onClick={() => onChange("")}
                    className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                    type="button"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }
    return (
        <UploadDropzone 
            className="ut-allowed-content:text-white"
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url)
            }}
            onUploadError={(error: Error) => {
                console.log(error);
            }}
        />
    )
}