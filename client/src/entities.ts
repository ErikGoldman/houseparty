export interface IUser {
  donationAmount: number;
  displayName: string;
  email: string;
  photoUrl: string;
  id: number;
  isHost: boolean;
  isAdmin: boolean;
  houseparty: IHouseparty | null;
}

export interface IHouseparty {
  id: number;
  userId: number;
  date: string;
  invites: IUser[];
}
