import * as React from "react";
import { graphql, OptionProps } from 'react-apollo';
import gql from 'graphql-tag';

import { IUser } from "../entities";

interface IProps {
  pendingUsers?: IUser[];
}
interface IState {
}

class AdminHome extends React.Component<IProps, IState> {
  render() {
    // should have pending requests
    return (
      <div>You're an admin!</div>
    );
  }
}

const query =  gql`
query {
  pendingUsers {
    id
    displayName
    profilePhoto
    email
  }
}`;

const WrappedAdminHost = graphql(
  query,
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
)(AdminHome as any);

export default WrappedAdminHost;