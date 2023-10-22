type Friend = {
  email: string;
  uid: string;
  emailVerified: boolean;
  displayName: string;
  isActive: boolean;
  gender?: "male" | "female" | "other" | string;
  photoUrl?: string;
  DOB?: Date;
};

export default Friend;
