type User = {
  email: string;
  password: string;
  uid: string;
  emailVerified: boolean;
  displayName: string;
  gender: "male" | "female" | "other" | string;
  photoUrl?: string;
  friends: User[] | [];
};

export default User;

