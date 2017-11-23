import * as React from "react";
import { compose, graphql, OptionProps } from 'react-apollo';
import gql from 'graphql-tag';

import { IHouseparty, IUser } from "../entities";
import Party from "../components/party";

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
        <div className="host-main">
          <h3>
            You aren't currently registered to host a houseparty! Please <a href="mailto:sonja@sonja2018.org">message
            Sonja</a> and annoy her until she confirms a date with you.
          </h3>
        </div>
      );
    } else {
      housepartyBody = (
        <div>
          <Party />
        </div>
      );
    }

    return (
      <div>
        {housepartyBody}
      </div>
    );
  }
}

const GetHousepartyQuery = gql`
query {
  user {
    id
    houseparty {
      id
      date
      invites {
        id
        user {
          id
          donatedAmount
        }
      }
    }
  }
}
`;

const WrappedComponent = compose(
  graphql(
    GetHousepartyQuery,
    {
      props: (info: OptionProps<IProps, { user?: IUser }>) => {
        if (!info.data || info.data.user === undefined) {
          return {
            houseparty: undefined,
          };
        }

        return {
          houseparty: info.data.user.houseparty,
        };
      },
    },
  ),
)(LoggedInHome as any);

export default WrappedComponent;