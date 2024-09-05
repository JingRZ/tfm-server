import Node from '../models/node.js';

export const fetchAllNodes = async () => {
  return Node.find({}).populate('neighbors');
};