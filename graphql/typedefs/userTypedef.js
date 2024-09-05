import { gql } from 'apollo-server';

const userTypeDefs = gql`

    type CardStatus {
        cardCode: String!
        step: Int
        completed: Boolean
    }

    type User {
        username: String!
        password: String!
        email: String!
        coins: Int
        cards: [CardStatus]
    }

    type UpdateCardStatusResponse {
        finish: Boolean
        currentStep: Int
    }

`

export default userTypeDefs;
