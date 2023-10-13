type Stranger = {
  email: string;
  uid: string;
  displayName: string;
  gender?: "male" | "female" | "other" | string;
  photoUrl?: string;
};

export default Stranger;
