import * as React from "react";
import { compose, graphql, OptionProps } from 'react-apollo';
import * as moment from "moment";
import gql from 'graphql-tag';
import { match } from "react-router-dom";

import WithNavBar from "../components/navbar";
import { IUser } from "../entities";

interface IProps {
  host?: IUser;
  match: match<{ userId: string }>;
}
interface IState {
  editor?: {
    name: string;
    email: string;
  };
}

class PartyPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
    };
  }

  edit() {
    this.setState({
      editor: {
        name: "",
        email: "",
      },
    });
    setTimeout(() => (this.refs.name as any).focus(), 0);
  }

  saveNew() {
    alert("boop");
  }

  render() {
    if (this.props.host === undefined) {
      return <div />;
    }

    if (this.props.host.houseparty === null) {
      return (<div>This user is not hosting a houseparty...</div>);
    }

    let editButton;
    let editor;

    if (this.state.editor) {
      editor = (
        <tr>
          <td><button onClick={() => this.saveNew()}>Save</button></td>
          <td contentEditable ref="name">{this.state.editor.name}</td>
          <td contentEditable>{this.state.editor.email}</td>
          <td>$0</td>
        </tr>
      );
    } else {
      editButton = (
        <button className="pt-button" onClick={() => this.edit() }>
          <span className="pt-icon pt-icon-add" />Invite someone
        </button>
      );
    }

    return WithNavBar(
      <div>
        <h1>Houseparty</h1>
        <h3 className="party-subtitle">
          hosted by {this.props.host.displayName} on {moment(this.props.host.houseparty.date).format("MM/DD/YY")}
         </h3>
        <div className="houseparty-invite-list">
          {editButton}
          <table>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Donated</th>
            </tr>
            {editor}
            {this.props.host.houseparty.invites.map((invited) => (
              <tr key={invited.id}>
                <td><span className="pt-icon pt-icon-remove" /></td>
                <td>{invited.displayName}</td>
                <td>{invited.email}</td>
                <td>${invited.donationAmount}</td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    );
  }
}

const HostQuery = gql`
query user($userId: Int!) {
  user (id: $userId) {
    id
    donatedAmount
    displayName
    photoUrl
    email
    houseparty {
      id
      date
      invites {
        id
        displayName
        email
        donatedAmount
      }
    }
  }
}`;

const WrapedElem = compose(
  graphql(
    HostQuery,
    {
      options: (props: { match: match<{ userId: string }> }) => ({ variables: { userId: props.match.params.userId } }),
      props: (info: OptionProps<IProps, { user?: IUser }>) => {
        if (!info.data || info.data.user === undefined) {
          return {
            host: undefined,
          };
        }

        return {
          host: info.data.user,
        };
      },
    },
  ),
)(PartyPage as any);

export default WrapedElem;