import * as React from "react";
import { compose, graphql, OptionProps } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from "react-router-dom";

import { IUser } from "../entities";

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

    return (
      <nav className="pt-navbar .modifier">
        <div className="pt-navbar-group pt-align-left">
          <div className="pt-navbar-heading"><Link to="/">Houseparty Organizer</Link></div>
        </div>
        <div className="pt-navbar-group pt-align-right">
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