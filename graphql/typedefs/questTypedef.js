import { gql } from 'apollo-server';

const questTypeDefs = gql`

    interface Quest {
        code: String!
        title: String!
        description: String
        cardID: String!
        step: Int!
        image: String
    }

    type Quiz implements Quest {
        code: String!
        title: String!
        description: String
        cardID: String!
        step: Int!
        question: String!
        options: [String]!
        img_url: String
        answer: String!
        image: String

    }

    type Riddle implements Quest {
        code: String!
        title: String!
        description: String
        cardID: String!
        step: Int!
        question: String!
        answer: String!
        img_url: String
        image: String

    }

    type Hint {
        code: String!
        title: String!
        description: String
        questCode: String!
        cardID: String!
        step: Int!
        img_url: String
        image: String

    }

    type CheckAns {
        correct: Boolean!
        finished: Boolean
    }

`;

export default questTypeDefs;