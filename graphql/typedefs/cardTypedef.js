import { gql } from 'apollo-server';

const cardTypeDefs = gql`

    type Card {
        title: String!
        description: String
        code: String!
        image: String
        coins: Int
        checkpoints: Int
        location: String
        duration: Int
        tags: [String]
    }

  

`;

export default cardTypeDefs;