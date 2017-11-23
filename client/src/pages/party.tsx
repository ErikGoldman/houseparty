import * as React from "react";
import { match } from "react-router-dom";

import WithNavBar from "../components/navbar";
import Party from "../components/party";

interface IProps {
  match?: match<{ userId: string }>;
}
interface IState {
}

export default class PartyPage extends React.Component<IProps, IState> {
  render() {
    return WithNavBar(<Party userId={this.props.match ? parseInt(this.props.match.params.userId, 10) : undefined} />);
  }
}
