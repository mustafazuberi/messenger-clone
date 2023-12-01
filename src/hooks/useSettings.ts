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
import AddBioSchema from "@/schema/schema.bio";

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

  const formGender: UseFormReturn<z.infer<typeof GenderSchema>> = useForm<
    z.infer<typeof GenderSchema>
  >({
    resolver: zodResolver(GenderSchema),
    defaultValues: {
      gender: "",
    },
  });

  const formAddBio: UseFormReturn<z.infer<typeof AddBioSchema>> = useForm<
    z.infer<typeof AddBioSchema>
  >({
    resolver: zodResolver(AddBioSchema),
    defaultValues: {
      bio: "",
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

  const updateChatRoomsBatch = async (key: string, value: string | Date) => {
    const querySnapshotRooms = await getDocs(collectionGroup(db, "chatrooms"));
    const roomBatch = writeBatch(db);
    querySnapshotRooms.forEach((doc) => {
      if (doc.data().userDetails[currentUser.uid]) {
        const docRef = doc.ref;
        roomBatch.update(docRef, {
          userDetails: {
            ...doc.data().userDetails,
            [doc.data().userDetails[currentUser.uid].uid]: {
              ...doc.data().userDetails[currentUser.uid],
              [key]: value,
            },
          },
        });
      }
    });
    await roomBatch.commit();
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
      await updateChatRoomsBatch("displayName", values.fullName);
      // dispatch in redux
      dispatch(
        updateUserDetails({ ...currentUser, displayName: values.fullName })
      );
      setUpdating(false);
      toast({
        description: "Display name updated successfully!",
      });
      formFullName.reset();
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
      await updateChatRoomsBatch("DOB", values.dob);
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
      formDOB.reset();
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
      await updateChatRoomsBatch("gender", values.gender);
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
      formGender.reset();
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
      await updateChatRoomsBatch("photoUrl", photoURL);

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

  const onSubmitBio = async (values: z.infer<typeof AddBioSchema>) => {
    setUpdating(true);
    try {
      const userDocRef = doc(db, "users", currentUser.uid); //updating in DB
      await updateDoc(userDocRef, {
        bio: values.bio,
      });

      await updateFriendsBatch("bio", values.bio);
      await updateChatRoomsBatch("bio", values.bio);
      // updating current user in redux
      dispatch(
        updateUserDetails({
          ...currentUser,
          bio: values.bio,
        })
      );
      setUpdating(false);
      toast({
        description: "Bio updated successfully!",
      });
      formAddBio.reset();
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
    formAddBio,
    onSubmitBio,
  };
};

export default useSettings;
