import { gql } from 'apollo-server';

const mutationTypeDefs = gql`

    type Mutation {
        addCard(
            title: String!
            description: String = "Descripcion por defecto"
            code: String!
            img_url: String = "404.jpg"
            coins: Int = 10
            checkpoints: Int!
            location: String = "FDI"
            duration: Int!
            tags: [String] = []
        ): Card

        addQuiz(
            code: String!
            title: String!
            description: String
            cardID: String!
            step: Int!
            question: String!
            options: [String]!
            img_url: String
            answer: String!
        ): Quiz

        editTitle(
            code: String!
            title: String!
        ): Card

        addTags(
            code: String!
            tags: [String]!
        ): Card

        addRiddle(
            code: String!
            title: String!
            description: String
            cardID: String!
            step: Int!
            question: String!
            answer: String!
            img_url: String
        ): Riddle

        createUser(
            username: String!
            password: String!
            email: String!
        ): User

        login(
            username: String!
            password: String!
        ): String

        addRefreshToken(
            token: String!
            user: String!
        ): RefreshToken

        removeRefreshToken(
            username: String!
            refreshToken: String!
        ): Boolean

        refreshSessionToken(
            refreshToken: String!
        ): Token

        addCardToUser(
            code: String!
        ): User

        addHint(
            code: String!
            title: String!
            description: String
            cardID: String!
            questCode: String!
            step: Int!
            img_url: String
        ): Hint

        updateCardStatus(
            cardCode: String!
            step: Int!
        ): UpdateCardStatusResponse

        addNode(
            mac: String!
            name: String
            data: String
            descrip: String
            location: String
        ): Node

        addNeighborToNode(
            me: String!
            neighbors: [String]!
        ): Node

        createApiKey(
            key: String!
        ): ApiKey

        addAd(
            title: String!
            code: String!
            img_url: String
            url: String!
            location: String
            tag: String!
        ): Ad

               
    }
`;

export default mutationTypeDefs;