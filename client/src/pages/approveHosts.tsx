import * as React from "react";
import { compose, graphql, OptionProps, MutationFunc } from 'react-apollo';
import gql from 'graphql-tag';

import { IUser } from "../entities";
import WithNavBar from "../components/navbar";
import PendingHostApprovalQuery from "../queries/pendingHostApprovals";

interface IProps {
  approveHost: MutationFunc<any>;
  pendingUsers?: IUser[];
}
interface IState {
}

class ApproveHosts extends React.Component<IProps, IState> {
  approveHost(userId: number) {
    this.props.approveHost({
      variables: { userId, },
      update: (proxy, { data } : { data: any; }) => {
        proxy.writeQuery({ query: PendingHostApprovalQuery, data: { pendingUsers: data.approveHost } });
      },
    })
    .then(({ data }) => {
      console.log(data);
    }).catch((error) => {
      console.log('there was an error approving a host', error);
    });
  }

  render() {
    if (this.props.pendingUsers === undefined) {
      return <div />;
    }

    const pending = this.props.pendingUsers.map((u) => (
      <tr key={u.id}>
        <td>
          <button className="pt-button pt-primary-intent" onClick={() => { this.approveHost(u.id); }}>
            Approve
          </button>
        </td>
        <td><img className="profile-photo" src={u.photoUrl} /></td>
        <td>{u.displayName}</td>
        <td>{u.email}</td>
      </tr>
    ));

    return WithNavBar(
      <div>
        <h1>Approve new hosts</h1>
        <div className="host-approval-table">
          <div>
            <table>
              { pending }
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const approveHost = gql`
mutation approveHost($userId: Int!) {
  approveHost(userId: $userId) {
    id
    displayName
    email
    photoUrl
  }
}
`;

const WrappedApproveHosts = compose(
  graphql(
    PendingHostApprovalQuery,
    {
      props: (info: OptionProps<IProps, { pendingUsers?: IUser[] }>) => {
        if (!info.data || info.data.pendingUsers === undefined) {
          return {
            pendingUsers: undefined,
          };
        }

        return {
          pendingUsers: info.data.pendingUsers || [],
        };
      },
    },
  ),
  graphql(approveHost, { name: "approveHost" }),
)(ApproveHosts as any);

export default WrappedApproveHosts;