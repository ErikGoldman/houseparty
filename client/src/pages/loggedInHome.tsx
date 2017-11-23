import * as React from "react";
import { compose, graphql, OptionProps } from 'react-apollo';
import gql from 'graphql-tag';

import { IHouseparty, IUser } from "../entities";

interface IProps {
  user?: IUser;
  houseparty?: IHouseparty;
}
interface IState {
  selectedDate: Date;
}

export class LoggedInHome extends React.Component<IProps, IState> {
  handleChange(newDate: Date) {
    this.setState({ selectedDate: newDate });
  }

  render() {
    if (this.props.houseparty === undefined) {
      return <div />;
    }

    let housepartyBody: JSX.Element;

    if (this.props.houseparty === null) {
      housepartyBody = (
        <h3>
          You aren't currently registered to host a houseparty! Please <a href="mailto:sonja@sonja2018.org">message
          Sonja</a> and annoy her until she confirms a date with you.
        </h3>
      );
    } else {
      housepartyBody = (
        <div>
          <div className="houseparty-date">{this.props.houseparty.date}</div>
          Bloop
        </div>
      );
    }

    return (
      <div>
        <h1>Your Houseparty</h1>
        <div className="host-main">
          {housepartyBody}
        </div>
      </div>
    );
  }
}

const GetHousepartyQuery = gql`
query {
  houseparty {
    id
    date
    invites {
      id
      displayName
      email
    }
  }
}
`;

const WrappedComponent = compose(
  graphql(
    GetHousepartyQuery,
    {
      props: (info: OptionProps<IProps, { houseparty?: IHouseparty }>) => {
        if (!info.data || info.data.houseparty === undefined) {
          return {
            pendingUsers: undefined,
          };
        }

        return {
          houseparty: info.data.houseparty,
        };
      },
    },
  ),
)(LoggedInHome as any);

export default WrappedComponent;