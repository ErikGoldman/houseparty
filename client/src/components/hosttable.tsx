import * as React from "react";

import { IUser } from "../entities";
import HostRow from "./hostrow";

interface IProps {
  hosts: IUser[];
}
interface IState {
}

export default class HostTable extends React.Component<IProps, IState> {
  render() {
    return (
      <div>
        <table>
          { this.props.hosts.map((h) => <HostRow host={h} key={h.id} />) }
        </table>
      </div>
    );
  }
}
