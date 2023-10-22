import { UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FullNameSchema from "@/schema/schema.fullname";
import DOBSchema from "@/schema/shecma.DOB";
import GenderSchema from "@/schema/schema.gender";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import createImageUrl from "@/services/createImageUrl";
import { updateProfile } from "firebase/auth";
import { auth, db } from "@/db/firebase.config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { doc, updateDoc } from "firebase/firestore";
import { updateUserDetails } from "@/store/slice/userSlice";

const useSettings = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const currentUser = useSelector((state: RootState) => state.currentUser);

  const [updating, setUpdating] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>();

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (e) => {
      setUploadedFile(e[0]);
    },
  });

  const formFullName: UseFormReturn<z.infer<typeof FullNameSchema>> = useForm<
    z.infer<typeof FullNameSchema>
  >({
    resolver: zodResolver(FullNameSchema),
    defaultValues: {
      fullName: "",
    },
  });

  const formDOB: UseFormReturn<z.infer<typeof DOBSchema>> = useForm<
    z.infer<typeof DOBSchema>
  >({
    resolver: zodResolver(DOBSchema),
  });

  const formGender = useForm<z.infer<typeof GenderSchema>>({
    resolver: zodResolver(GenderSchema),
    defaultValues: {
      gender: "",
    },
  });

  const onSubmitFullname = async (values: z.infer<typeof FullNameSchema>) => {
    setUpdating(true);
    try {
      const userDocRef = doc(db, "users", currentUser.uid); //updating in DB
      await updateDoc(userDocRef, {
        displayName: values.fullName,
      });
      // dispatch in redux
      dispatch(
        updateUserDetails({ ...currentUser, displayName: values.fullName })
      );
      setUpdating(false);
      setUploadedFile(null);
      toast({
        description: "Display name updated successfully!",
      });
    } catch (error) {
      console.log(error);
      setUpdating(false);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

  function onSubmitDOB(data: z.infer<typeof DOBSchema>) {
    toast({
      title: "You submitted the following values:",
    });
  }

  const onSubmitGender = () => {};

  const updateProfilePhoto = async () => {
    if (!uploadedFile) return;
    setUpdating(true);
    try {
      const photoURL = await createImageUrl(uploadedFile);
      // Updating in Auth
      await updateProfile(auth.currentUser!, {
        photoURL: photoURL,
      });
      const photoUrlRef = doc(db, "users", currentUser.uid); //updating in DB
      await updateDoc(photoUrlRef, {
        photoUrl: photoURL,
      });

      // dispatch in redux
      dispatch(updateUserDetails({ ...currentUser, photoUrl: photoURL }));
      setUpdating(false);
      setUploadedFile(null);
      toast({
        description: "Profile photo updated successfully!",
      });
    } catch (error) {
      console.log(error);
      setUpdating(false);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

  return {
    formFullName,
    formDOB,
    formGender,
    onSubmitFullname,
    onSubmitDOB,
    onSubmitGender,
    uploadedFile,
    getRootProps,
    getInputProps,
    updateProfilePhoto,
    updating,
  };
};

export default useSettings;
