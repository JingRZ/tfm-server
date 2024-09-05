import { gql } from 'apollo-server';

const nodeTypeDefs = gql`

    type Node {
        name: String
        mac: String!
        data: String
        descrip: String
        location: String
        neighbors: [Node]
    }

`;

export default nodeTypeDefs;