import * as React from "react";
import { compose, graphql, MutationFunc } from 'react-apollo';
import gql from 'graphql-tag';
import * as moment from "moment";
import { Link } from "react-router-dom";

import { IUser } from "../entities";
import { DatePicker } from "@blueprintjs/datetime";

interface IProps {
  setHousepartyDate?: MutationFunc<any>;
  host: IUser;
}
interface IState {
  isPickingDate: boolean;
}

class HostRow extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      isPickingDate: false,
    };
  }

  onChooseDate(date: Date) {
    if (!this.props.setHousepartyDate) {
      throw new Error("this should literally never happen");
    }

    const dateString = moment(date).toISOString();

    this.props.setHousepartyDate({
      variables: { userId: this.props.host.id, date: dateString },
    })
    .then(({ data }) => {
      this.setState({ isPickingDate: false });
    }).catch((error) => {
      console.log('there was an error approving a host', error);
    });
  }

  pickDate() {
    this.setState({ isPickingDate: true });
  }

  render() {
    if (this.props.host === undefined) {
      return <div />;
    }

    const housepartyDateOrUndefined = (this.props.host.houseparty ?
      new Date(moment(this.props.host.houseparty.date).valueOf()) : undefined
    );

    let actionButton: JSX.Element;
    if (this.state.isPickingDate) {
      actionButton = (
        <DatePicker onChange={(date: Date) => this.onChooseDate(date)} value={housepartyDateOrUndefined} />
      );
    } else if (this.props.host.houseparty === null) {
      actionButton = (
        <button className="pt-button pt-primary-intent" onClick={() => { this.pickDate(); }}>
          Schedule houseparty
        </button>
      );
    } else {
      actionButton = (
        <Link to={`/party/${this.props.host.id}`}>
          <button className="pt-button pt-primary-intent">
            View
          </button>
        </Link>
      );
    }

    const housepartyDate = this.props.host.houseparty ?
      moment(this.props.host.houseparty.date).format("MM/DD/YY") : "Not scheduled"
    ;

    return (
      <tr>
        <td>{actionButton}</td>
        <td>{housepartyDate}</td>
        <td><img className="profile-photo" src={this.props.host.photoUrl} /></td>
        <td>{this.props.host.displayName}</td>
        <td>{this.props.host.email}</td>
      </tr>
    );
  }
}

const setHousepartyDate = gql`
mutation setHousepartyDate($userId: Int!, $date: String!) {
  setHousepartyDate(userId: $userId, date: $date) {
    id
    houseparty {
      id
      date
      invites {
        id
      }
    }
  }
}
`;

const WrappedElem = compose(
  graphql(setHousepartyDate, { name: "setHousepartyDate" }),
)(HostRow as any);

export default WrappedElem;