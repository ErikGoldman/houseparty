import * as React from "react";
import { compose, graphql, OptionProps } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from "react-router-dom";

import { IUser } from "../entities";
import PendingHostApprovalQuery from "../queries/pendingHostApprovals";

interface IProps {
  pendingUsers?: IUser[];
  user?: IUser;
}
interface IState {
}

class NavBar extends React.Component<IProps, IState> {
  render() {
    if (!this.props.user) {
      return <div />;
    }

    const numHostsToApprove = this.props.pendingUsers ? this.props.pendingUsers.length : 0;

    const navButtons = this.props.user.isAdmin ? (
      <span>
        <Link to="/approve">
          <button className="pt-button pt-minimal pt-icon-notifications">
            Hosts to approve { numHostsToApprove > 0 ? <span className="pt-tag pt-intent-danger">{numHostsToApprove}</span> : "" }
          </button>
        </Link>
        <Link to="/hosts">
          <button className="pt-button pt-minimal pt-icon-walk">Hosts</button>
        </Link>
      </span>
    ) : (
      <span>
      </span>
    );

    return (
      <nav className="pt-navbar .modifier">
        <div className="pt-navbar-group pt-align-left">
          <div className="pt-navbar-heading"><Link to="/">Houseparty Organizer</Link></div>
        </div>
        <div className="pt-navbar-group pt-align-right">
          {navButtons}
          <span className="pt-navbar-divider"></span>
          <div>
            <img className="profile-photo" src={this.props.user.photoUrl} />
            <span className="navbar-name">{this.props.user.displayName}</span>
          </div>
        </div>
      </nav>
    )
  }
}

const query =  gql`
query {
  user {
    id
    displayName
    photoUrl
    email
    isHost
    isAdmin
  }
}`;
const WrappedNavBar = compose(
  graphql(
    query,
    {
      props: (info: OptionProps<IProps, { user?: IUser }>) => {
        if (!info.data || info.data.user === undefined) {
          return {
            user: undefined,
          };
        }

        return {
          user: info.data.user || null,
        };
      },
    },
  ),
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
)(NavBar as any);


const WithNavBar = (content: JSX.Element) => {
  return (
    <div>
      <WrappedNavBar />
      <div className="main-content">
        {content}
      </div>
    </div>
  )
}

export default WithNavBar;