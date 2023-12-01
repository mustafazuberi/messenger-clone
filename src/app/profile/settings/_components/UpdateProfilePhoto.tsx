"use client";
import { Button } from "@/components/ui/button";
import useSettings from "@/hooks/useSettings";
import { Loader2 } from "lucide-react";
import React from "react";

const UpdateProfilePhoto = () => {
  const {
    uploadedFile,
    getRootProps,
    getInputProps,
    updateProfilePhoto,
    updating,
  } = useSettings();

  return (
    <main className="flex flex-col gap-x-4">
      <h3 className="mb-2 text-gray-700 dark:text-gray-300">
        Select Profile Picture
      </h3>
      <div {...getRootProps()}>
        <input {...getInputProps()} type="file" accept="image/*" />
        <section className="border-dotted border-2 cursor-pointer min-h-[200px] flex justify-center items-center w-full">
          {!uploadedFile ? (
            <p className="max-w-[80%] text-gray-700 dark:text-gray-300">
              Drag and drop files here or click to browse.
            </p>
          ) : (
            <p className="max-w-[80%] text-gray-700 dark:text-gray-300">
              Now that you have selected an image {uploadedFile.name}, you can
              proceed with the update.
            </p>
          )}
        </section>
      </div>
      {updating ? (
        <Button disabled className="mt-[33px]">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Wait
        </Button>
      ) : (
        <Button className="mt-[33px]" onClick={updateProfilePhoto}>
          Update
        </Button>
      )}
    </main>
  );
};
export default UpdateProfilePhoto;
