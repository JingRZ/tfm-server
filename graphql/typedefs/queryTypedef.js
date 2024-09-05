import { gql } from 'apollo-server';

const queryTypedef = gql`
    type Query {
        cardCount: Int!
        allCards: [Card]!
        findCard(code: String!): Card
        allQuests: [Quest]
        findQuest(code: String!): Quest
        findQuestByGameStep(cardID: String!, step: Int!): Quest
        allQuiz: [Quiz]
        allRiddle: [Riddle]
        checkAns(code: String!, answer: String!): CheckAns
        me: User
        allUsers: [User]
        findRefreshTokenByToken(token: String!): RefreshToken
        allHints: [Hint]
        findHintById(code: String!): Hint
        findHint(cardId: String!, step: Int!): Hint
        findNodeByMAC(mac: String!): Node
        allNodes: [Node]
        findNodeByLocation(location: String!): Node
        findNodeMACByName(name: String!): String
        allApiKeys: [ApiKey]
        findApiKey(key: String!): ApiKey
        allAds: [Ad]
        findAd(code: String!): AdResponse
    }
`;

export default queryTypedef;