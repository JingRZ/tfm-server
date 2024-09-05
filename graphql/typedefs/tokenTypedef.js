import { gql } from 'apollo-server';

const tokenTypeDefs = gql`

    type RefreshToken {
        token: String!
        username: String!
        active: Boolean!
    }

    type Token {
        token: String!
    }

`;

export default tokenTypeDefs;