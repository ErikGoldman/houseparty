export interface IUser {
  displayName: string;
  email: string;
  photoUrl: string;
  id: number;
  isHost: boolean;
  isAdmin: boolean;
  houseparty: IHouseparty | null;
}

export interface IInvited {
  id: number;
  name: string;
  email: string;
}

export interface IHouseparty {
  id: number;
  userId: number;
  date: string;
  inviteList: IInvited[];
}
