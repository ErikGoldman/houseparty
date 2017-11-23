import * as React from "react";
import { compose, graphql, MutationFunc, OptionProps } from 'react-apollo';
import * as moment from "moment";
import gql from 'graphql-tag';

import { IUser } from "../entities";

interface IProps {
  host?: IUser;
  userId?: number;
  deleteInvite: MutationFunc<any>;
  saveInvite: MutationFunc<any>;
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

  addNewUser() {
    this.setState({
      editor: {
        name: "",
        email: "",
      },
    });
    setTimeout(() => (this.refs.name as any).focus(), 0);
  }

  saveNew() {
    if (!this.props.saveInvite) {
      throw new Error("couldn't find save invitee mutation. this shouldn't ever happen.");
    }
    if (!this.props.host) {
      throw new Error("no host");
    }
    if (!this.state.editor) {
      throw new Error("no editor");
    }

    this.props.saveInvite({
      variables: {
        hostId: this.props.host.id,
        name: this.state.editor.name,
        email: this.state.editor.email,
      }
    })
    .then(() => {
      this.setState({
        editor: undefined,
      })
    })
  }

  onEdit(field: string, event: React.ChangeEvent<HTMLInputElement>) {
    if (!this.state.editor) {
      throw new Error("input event but no editor object...");
    }

    (this.state.editor as any)[field] = event.target.value;
    this.setState({
      editor: this.state.editor,
    })
  }
  
  removeInvite(inviteId: number) {
    if (confirm("Are you sure you want to remove this invite?")) {
      this.props.deleteInvite({
        variables: {
          inviteId,
        }
      })
    }
  }

  render() {
    if (this.props.host === undefined) {
      return <div />;
    }

    if (this.props.host.houseparty === null) {
      return (<div>This user is not hosting a houseparty...</div>);
    }

    let editor;

    if (this.state.editor) {
      editor = (
        <tr className="invite-edit-row">
          <td>
            <input placeholder="Ed Lee" ref="name" onChange={(elem: any) => this.onEdit("name", elem)} value={this.state.editor.name} />
           </td>
          <td>
            <input placeholder="ed@themayor.com" onChange={(elem: any) => this.onEdit("email", elem)} value={this.state.editor.email} />
          </td>
          <td><div>$0</div></td>
          <td className="invite-table-action">
            <div><button className="pt-button" onClick={() => this.saveNew()}>Save</button></div>
          </td>
        </tr>
      );
    }

    return (
      <div>
        <h1>Houseparty</h1>
        <h3 className="party-subtitle">
          hosted by {this.props.host.displayName} on {moment(this.props.host.houseparty.date).format("MM/DD/YY")}
         </h3>
        <div className="houseparty-invite-list">
          <button disabled={this.state.editor !== undefined} className="pt-button pt-intent-primary" onClick={() => this.addNewUser() }>
            <span className="pt-icon pt-icon-add" />Invite someone
          </button>
          <table className="invite-table">
            <tr>
              <th className="invite-table-name"><div>Name</div></th>
              <th className="invite-table-email"><div>Email</div></th>
              <th className="invite-table-donated"><div>Donated</div></th>
              <th className="invite-table-action"></th>
            </tr>
            {editor}
            {
              this.props.host.houseparty.invites.length === 0 && !this.state.editor ? (
                <tr><td colSpan={4}><div className="pt-callout">You haven't invited anyone yet!</div></td></tr>
              ) : undefined
            }
            {[...this.props.host.houseparty.invites].sort((a, b) => parseInt(b.date, 10) - parseInt(a.date, 10)).map((invited) => (
              <tr key={invited.id}>
                <td><div>{invited.user.displayName}</div></td>
                <td><div>{invited.user.email}</div></td>
                <td><div>${invited.user.donatedAmount}</div></td>
                <td className="invite-table-action">
                  <div>
                    <button className="pt-button pt-intent-danger" onClick={() => { this.removeInvite(invited.id) }}>
                      <span className="pt-icon pt-icon-remove" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    );
  }
}

const HostQuery = gql`
query user($userId: Int) {
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
        date
        user {
          id
          displayName
          email
          donatedAmount
        }
      }
    }
  }
}`;

const SaveInviteMutation = gql`
mutation saveInvite($hostId: Int!, $name: String!, $email: String!) {
  saveInvite (hostId: $hostId, name: $name, email: $email) {
    id
    date
    invites {
      id
      date
      user {
        id
        displayName
        email
        donatedAmount
      }
    }
  }
}`;

const DeleteInviteMutation = gql`
mutation deleteInvite($inviteId: Int!) {
  deleteInvite (inviteId: $inviteId) {
    id
    date
    invites {
      id
      date
      user {
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
      options: (props: IProps) => (
        { variables: { userId: props.userId } }
      ),
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
  graphql(SaveInviteMutation, { name: "saveInvite"}),
  graphql(DeleteInviteMutation, { name: "deleteInvite"}),
)(PartyPage as any);

export default WrapedElem;