import * as React from "react";
import { graphql, OptionProps } from 'react-apollo';
import gql from 'graphql-tag';

import AdminHome from "./adminHome";
import LoggedInHome from "./loggedInHome";
import { IUser } from "../entities";
import WithNavBar from "../components/navbar";

require("./home-main.css");

interface IProps {
  user?: IUser;
}
interface IState {
}

class Home extends React.Component<IProps, IState> {
  clickLogin() {
    location.href = "/auth/login/google";
  }

  render() {
    if (this.props.user === undefined) {
      return <div />;
    }

    if (this.props.user === null) {
      return (
        <div className="home">
          <div className="home-main">
            <h1>Houseparty Organizer</h1>
            <button className="pt-button pt-intent-danger home-login-button" onClick={() => { this.clickLogin() }}>Log in</button>
          </div>
        </div>
      );
    }

    return (
      <div>
        { WithNavBar(this.props.user.isAdmin ? <AdminHome /> : <LoggedInHome />)}
      </div>
    )
  }
}

const query =  gql`
query {
  user {
    id
    displayName
    email
    isAdmin
  }
}`;

export default graphql(
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
)(Home as any);
