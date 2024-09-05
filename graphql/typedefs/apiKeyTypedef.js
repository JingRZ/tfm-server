import { gql } from 'apollo-server';

const apiKeyTypedef = gql`

    type ApiKey {
        key: String!
        createdAt: String
    }
`;

export default apiKeyTypedef;