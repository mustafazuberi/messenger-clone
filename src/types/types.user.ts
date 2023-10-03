type User = {
  fullName: string;
  email: string;
  password: string;
  gender: "male" | "female" | "other" | string;
  emailVerified: boolean;
  friends: User[] | [];
  isAuthenticated: boolean;
};

export default User;
