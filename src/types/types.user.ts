type User = {
  email: string;
  uid: string;
  emailVerified: boolean;
  displayName: string;
  gender?: "male" | "female" | "other" | string;
  photoUrl?: string;
  friends: User[] | [];
  isActive?: false;
};

export default User;
