"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const UpdateProfilePhoto = () => {
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | undefined>();

  const handleUploadedFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const urlImage = URL.createObjectURL(file);
      setPreview(urlImage);
    }
  };

  const onUpload = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.click();
    }
  };

  const uploadButtonLabel = preview ? "Change image" : "Upload image";

  return (
    <div>
      <label htmlFor="profileInp">Here Upload to test</label>
      <input
        type="file"
        id="profileInp"
        className="hidden"
        onChange={handleUploadedFile}
      />
      <Avatar>
        <AvatarImage src={preview} width={80} height={80} />
      </Avatar>
      <Button onClick={onUpload}>{uploadButtonLabel}</Button>
    </div>
  );
};

export default UpdateProfilePhoto;
