import * as React from "react";
import { compose, graphql, OptionProps } from 'react-apollo';
import { Tab2, Tabs2 } from "@blueprintjs/core";

import { IUser } from "../entities";
import { AllSignedUpHostsQuery } from "../queries";
import HostTable from "../components/hosttable";

interface IProps {
  signedUpUsers?: IUser[];
}
interface IState {
  selectedTab: string;
}

class AdminHome extends React.Component<IProps, IState> {
  handleTabChange(selectedTab: string) {
    this.setState({ selectedTab });
  }
  render() {
    if (this.props.signedUpUsers === undefined) {
      return <div />;
    }

    const noPartyHosts = this.props.signedUpUsers.filter((u) => u.houseparty === null || u.houseparty.date === null);
    const numNoHouseparty = noPartyHosts.length;
    const noPartyTitle = (
      <span>
        No date set&nbsp;
        { numNoHouseparty === 0 ? "" : <span className="pt-tag pt-intent-danger">{numNoHouseparty}</span> }
      </span>
    );
    
    return (
      <div>
        <h1>Admin Page</h1>
        <div className="host-approval-table">
          <div>
            <Tabs2 id="Tabs2Example" onChange={(newTab: string) => { this.handleTabChange(newTab); }}>
              <Tab2 id="all" title="All Hosts" panel={<HostTable hosts={this.props.signedUpUsers} />} />
              <Tab2 id="noParty" title={noPartyTitle} panel={<HostTable hosts={noPartyHosts} />} />
            </Tabs2>
          </div>
        </div>
      </div>
    );
  }
}


const WrapedElem = compose(
  graphql(
    AllSignedUpHostsQuery,
    {
      props: (info: OptionProps<IProps, { signedUpUsers?: IUser[] }>) => {
        if (!info.data || info.data.signedUpUsers === undefined) {
          return {
            signedUpUsers: undefined,
          };
        }

        return {
          signedUpUsers: info.data.signedUpUsers || [],
        };
      },
    },
  ),
)(AdminHome as any);

export default WrapedElem;