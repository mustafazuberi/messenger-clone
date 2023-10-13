type User = {
  email: string;
  uid: string;
  emailVerified: boolean;
  displayName: string;
  gender?: "male" | "female" | "other" | string;
  photoUrl?: string;
  isActive?: false;
  friends: User[] | [];
};

export default User;
