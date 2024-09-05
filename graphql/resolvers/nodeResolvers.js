import Node from '../models/node.js'
import { UserInputError } from 'apollo-server'
import { fetchAllNodes } from '../utils/nodeService.js';


const nodeResolver = {
    Query: {
        allNodes: async (root, args) => {
            return fetchAllNodes()
        },
        findNodeByLocation: async (root, args) => {
            const {location} = args
            return Node.findOne({location}).populate('neighbors')
        },
        findNodeByMAC: async (root, args) => {
            const {mac} = args
            return Node.findOne({mac}).populate('neighbors')
        },
        findNodeMACByName: async (root, args) => {
            const {name} = args
            console.log(Node.findOne({name}))
            return Node.findOne({name}).mac
        }
    },
    Mutation: {
        addNode: async (root, args) => {
        
            const node = new Node({...args})

            try{
                await node.save()

            } catch(error){
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
            }
            return node
        },
        addNeighborToNode: async (root, args) => {
            const {me, neighbors} = args
            const node = await Node.findOne({name: me})
            if(!node){
                throw new UserInputError('Node not found')
            }
            const errNeigh = []
            for(const neighbor of neighbors){
                const neighborNode = await Node.findOne({name: neighbor})
                if(!neighborNode){
                    errNeigh.push(neighbor)
                    continue
                }
                if (!node.neighbors.some(existingNeighbor => existingNeighbor._id.equals(neighborNode._id))) {
                    node.neighbors = node.neighbors.concat(neighborNode);
                }
            }

            if(errNeigh.length){
                console.log('Neighbor not found', errNeigh)
                throw new UserInputError('Neighbor not found', {
                    invalidArgs: errNeigh
                })
            }

            await node.save()
            return node
        },
    }
};

export default nodeResolver;