import * as React from "react";

import { IUser } from "../entities";

interface IProps {
  user?: IUser;
}
interface IState {
}

export default class LoggedInHome extends React.Component<IProps, IState> {
  render() {
    return (
      <div>You're logged in!</div>
    );
  }
}