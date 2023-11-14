"use client";
import { Button } from "@/components/ui/button";
import useSettings from "@/hooks/useSettings";
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
      <h3 className="mb-2">Select Profile Picture</h3>
      <div {...getRootProps()}>
        <input {...getInputProps()} type="file" accept="image/*" />
        <section className="border-dotted border-2 cursor-pointer min-h-[200px] flex justify-center items-center w-full">
          {!uploadedFile ? (
            <p className="max-w-[80%]">
              Drag and drop files here or click to browse.
            </p>
          ) : (
            <p className="max-w-[80%]">
              Now that you have selected an image {uploadedFile.name}, you can
              proceed with the update.
            </p>
          )}
        </section>
      </div>
      <Button
        className="mt-[33px]"
        onClick={updateProfilePhoto}
        disabled={updating}
      >
        {updating ? "Please wait..." : "Update"}
      </Button>
    </main>
  );
};
export default UpdateProfilePhoto;
