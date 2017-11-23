export interface IUser {
  donatedAmount: number;
  displayName: string;
  email: string;
  photoUrl: string;
  id: number;
  isHost: boolean;
  isAdmin: boolean;
  houseparty: IHouseparty | null;
}

export interface IInvite {
  id: number;
  user: IUser;
  houseparty: IHouseparty;
  date: string;
}

export interface IHouseparty {
  id: number;
  userId: number;
  date: string;
  invites: IInvite[];
}
