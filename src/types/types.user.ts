type User = {
  email: string;
  uid: string;
  emailVerified: boolean;
  displayName: string;
  gender?: "male" | "female" | "other" | string;
  photoUrl?: string;
  DOB?: Date;
  bio?: string;
};

export default User;


