import { gql } from 'apollo-server';

const adTypedef = gql`

    type Ad {
        title: String!
        code: String!
        img_url: String
        url: String!
        location: String
        tag: String!
    }

    type AdResponse {
        title: String!
        image: String
        url: String!
        location: String
        tag: String!
    }
`;

export default adTypedef;