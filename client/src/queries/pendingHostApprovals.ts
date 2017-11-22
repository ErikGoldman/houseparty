import gql from 'graphql-tag';

const query =  gql`
query {
  pendingUsers {
    id
    displayName
    email
    photoUrl
  }
}`;

export default query;