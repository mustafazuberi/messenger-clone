export type StrangerStatus = "Req Received" | "Req Sent" | "stranger";

type Stranger = {
  email: string;
  uid: string;
  displayName: string;
  gender?: "male" | "female" | "other" | string;
  photoUrl?: string;
  StrangerStatus?: StrangerStatus;
};

export default Stranger;
