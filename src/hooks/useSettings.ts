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
import {
  collectionGroup,
  doc,
  getDocs,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
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

  const updateFriendsBatch = async (key: string, value: string | Date) => {
    const subcollectionName = "friends";
    const querySnapshot = await getDocs(collectionGroup(db, subcollectionName));
    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      if (doc.data().uid === currentUser.uid) {
        const docRef = doc.ref;
        batch.update(docRef, { [key]: value });
      }
    });
    await batch.commit();
  };

  const updateRequestsBatch = async (key: string, value: string) => {
    const querySnapshotReqs = await getDocs(collectionGroup(db, "requests"));
    const reqBatch = writeBatch(db);
    querySnapshotReqs.forEach((doc) => {
      if (doc.data().senderId === currentUser.uid) {
        const docRef = doc.ref;
        reqBatch.update(docRef, {
          sender: { ...currentUser, [key]: value },
        });
      } else if (doc.data().receiverId === currentUser.uid) {
        const docRef = doc.ref;
        reqBatch.update(docRef, {
          receiver: { ...currentUser, [key]: value },
        });
      }
    });
    await reqBatch.commit();
  };

  const onSubmitFullname = async (values: z.infer<typeof FullNameSchema>) => {
    setUpdating(true);
    try {
      const userDocRef = doc(db, "users", currentUser.uid); //updating in DB
      updateProfile(auth.currentUser!, {
        displayName: values.fullName,
      });
      await updateDoc(userDocRef, {
        displayName: values.fullName,
      });

      await updateFriendsBatch("displayName", values.fullName);

      await updateRequestsBatch("displayName", values.fullName);
      // dispatch in redux
      dispatch(
        updateUserDetails({ ...currentUser, displayName: values.fullName })
      );
      setUpdating(false);
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

  const onSubmitDOB = async (values: z.infer<typeof DOBSchema>) => {
    setUpdating(true);
    try {
      const userDocRef = doc(db, "users", currentUser.uid); //updating in DB
      await updateDoc(userDocRef, {
        DOB: values.dob.toDateString(),
      });

      await updateFriendsBatch("DOB", values.dob);
      // dispatch in redux
      dispatch(
        updateUserDetails({
          ...currentUser,
          DOB: values.dob,
        })
      );
      setUpdating(false);
      toast({
        description: "Date of Birth updated successfully!",
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

  const onSubmitGender = async (values: z.infer<typeof GenderSchema>) => {
    setUpdating(true);
    try {
      const userDocRef = doc(db, "users", currentUser.uid); //updating in DB
      await updateDoc(userDocRef, {
        gender: values.gender,
      });

      await updateFriendsBatch("gender", values.gender);
      // dispatch in redux
      dispatch(
        updateUserDetails({
          ...currentUser,
          gender: values.gender,
        })
      );
      setUpdating(false);
      toast({
        description: "Gender updated successfully!",
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

  const updateProfilePhoto = async () => {
    if (!uploadedFile) return;
    setUpdating(true);
    try {
      const photoURL = await createImageUrl(uploadedFile);
      // Updating in Auth
      await updateProfile(auth.currentUser!, {
        photoURL: photoURL,
      });
      // updating in users collection
      const photoUrlRef = doc(db, "users", currentUser.uid); //updating in DB
      await updateDoc(photoUrlRef, {
        photoUrl: photoURL,
      });

      // updating in friends collection inside users collection every doc
      await updateFriendsBatch("photoUrl", photoURL);
      // updating in requests which are sent
      await updateRequestsBatch("photoUrl", photoURL);

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
