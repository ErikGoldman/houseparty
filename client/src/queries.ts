import gql from 'graphql-tag';

export const AllSignedUpHostsQuery =  gql`
query {
  signedUpUsers {
    id
    donatedAmount
    displayName
    email
    photoUrl
    hasSignedUp
    houseparty {
      id
      date
      invites {
        id
        date
        user {
          id
          donatedAmount
          displayName
          email
        }
      }
    }
  }
}`;