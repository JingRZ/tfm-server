
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from './models/user.js';
import nodeResolver from './resolvers/nodeResolvers.js';


const ACCESS_TOKEN_EXP_TIME = '30s'
const REFRESH_TOKEN_EXP_TIME = '5h'
const JWT_SECRET = process.env.JWT_SECRET || 'oN823SarucV9VE1qTyIbjfdUL'



// Wrapper to add auth check
export const withAuth = (handler) => async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const verified = token ? jwt.verify(token, JWT_SECRET) : false;

        if(!verified) {
            return res.status(403).json({ message: 'Unauthorised' });
        }
    }
    catch (err) {
        return res.status(403).json({ error: err });
    }

    // Proceed to the next middleware or route handler
    return handler(req, res, next);
};


export const verifyToken = async (token, options = undefined) => {
    try {
        const verif = jwt.verify(token, JWT_SECRET);
        return options?.returnPayload ? verif.payload : true;
    } catch {
        return false;
    }
};


export const generateRefreshToken = (data) => {
    return jwt.sign(data, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXP_TIME });
};

export const generateToken = (data) => {
    return jwt.sign(data, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXP_TIME });
};


const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'User not found. Change this msg for Invalid credentials later' });
        }

        const pwdCorrect = await bcrypt.compare(password, user.pwd);
        if (!pwdCorrect) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const refreshTokenInput = {
            email: user.email,
            username: user.username,
            id: user._id,
        };
        const refreshToken = generateRefreshToken(refreshTokenInput);
        const tokenInput = {
            refreshToken,
            id: user._id,
        };
        const token = generateRefreshToken(tokenInput);
        
        // Store the refresh token in an HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // The cookie is not accessible via JavaScript
            secure: true, // The cookie will be sent only over HTTPS
            sameSite: 'strict', // The cookie is not sent with cross-site requests
            maxAge: 24 * 60 * 60 * 1000 // Cookie expiration time in milliseconds (e.g., 1 day)
        });

        return res.status(200).json({ token });

    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};


export const defaultPage = (req, res) => {
    return res.status(200).json({ message: 'Hello World' });
}

export const authUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if(username && password){
            return login(req, res);
        }
        
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const valid = await verifyToken(token);
        if (!valid) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        } else {
            return res.status(200).json({ token: token });
        }

    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    console.log('Refresh token:', refreshToken);

    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
    }

    try {
        const { email } = jwt.verify(refreshToken, JWT_SECRET);
        const tokenInput = {
            refreshToken,
            email
        };
        const token = generateRefreshToken(tokenInput);
        console.log('New token:', token);

        return res.status(200).json({ token });
    }

    catch (error) {
        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: 'Invalid or expired refresh token' });
        } else {
            console.error('Error processing the refresh token:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
}

/*
const nodes = {
    A: { x: 0, y: 0 },
    B: { x: 0, y: 2 },
    C: { x: 2, y: 0 },
    D: { x: 3, y: 2 },
    E: { x: 0, y: 4 },
    F: { x: 4, y: 0 }
};
  

const graph = {
    A: ['B', 'C'],
    B: ['A', 'D', 'E'],
    C: ['A', 'F'],
    D: ['B'],
    E: ['B', 'F'],
    F: ['C', 'E']
};

const nodes = {
    P0A1: { x: 0, y: 3 },
    P0A2: { x: 1, y: 3 },
    P0A3: { x: 0, y: 2 },
    P0A4: { x: 1, y: 1 },
    P0A5: { x: 0, y: 0 },
    P0A6: { x: 1, y: 0 }
};
  

const graph = {
    P0A1:  ['P0A2', 'P0A3'],
    P0A2: ['P0A1', 'P0A4'],
    P0A3:  ['P0A1', 'P0A4', 'P0A5'],
    P0A4: ['P0A2', 'P0A6'],
    P0A5: ['P0A3', 'P0A6'],
    P0A6: ['P0A4', 'P0A5'],
};



const nodes = {
    EXT3: { x: 5, y: 5 },
    SEC: { x: 4, y: 5 },
    CNS: { x: 2, y: 5 },
    SAC: { x: 2, y: 6 },
    BIB: { x: 1, y: 6 },
    EXT4: { x: 0, y: 5 },
    A1: { x: 0, y: 4 },
    A2: { x: 0, y: 3 },
    A3: { x: 0, y: 2 },
    A4: { x: 0, y: 1 },
    A5: { x: 0, y: 0 },
    EXT1: { x: 1, y: 0 },
    EXT2: { x: 4, y: 0 },
    STR2: { x: 2, y: 0 },
    STR1: { x: 2, y: 3 },
    CFT: { x: 4, y: 2 },
    ASC1: { x: 3, y: 1 },
    ASC2: { x: 3, y: 4 },
    H2: { x: 3, y: 4 }
};

const trans = {
    EXT3: "Salida3",
    SEC: "Secretaría",
    CNS: "Conserjería",
    SAC: "Salón de Actos",
    BIB: "Biblioteca",
    EXT4: "Salida4",
    A1: "Aula1",
    A2: "Aula2",
    A3: "Aula3",
    A4: "Aula4",
    A5: "Aula5",
    EXT1: "Salida1",
    EXT2: "Salida2",
    STR2: "Escaleras2",
    STR1: "Escaleras1",
    CFT: "Cafetería",
    ASC1: "Ascensor1",
    ASC2: "Ascensor2",
    H2: "Hall2"
};
  

const graph = {
    EXT3:  ['SEC'],
    SEC: ['EXT3', 'CNS', 'H2'],
    CNS:  ['SEC', 'SAC', 'BIB', 'A1'],
    SAC: ['CNS', 'BIB'],
    BIB: ['SAC', 'EXT4'],
    EXT4: ['BIB'],
    A1: ['CNS', 'A2'],
    A2: ['A1', 'A3', 'ASC1'],
    A3: ['A2', 'A4'],
    A4: ['A3', 'A5'],
    A5: ['A4', 'EXT1'],
    EXT1: ['A5', 'STR2'],
    STR2: ['EXT1', 'EXT2'],
    EXT2: ['STR2', 'CFT'],
    CFT: ['EXT2', 'STR1'],
    STR1: ['ASC1'],
    ASC1: ['STR1', 'A2', 'H2'],
    ASC2: ['STR2', 'EXT1'],
    H2: ['ASC1', 'CFT', 'SEC']
};
*/



function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

const fetchNodesMAC = async () => {
    let nodes = {};
    let graph = {};
    let names = {};
    await nodeResolver.Query.allNodes().then(res => {
        res.forEach(node => {
            const location = JSON.parse(node.location).map(Number);

            nodes[node.mac] = { x: location[0], y: location[1] };
            graph[node.mac] = node.neighbors.map(neigh => neigh.mac);
            names[node.mac] = node.name
        });
    });
    return { nodes, graph, names };
}

const fetchNodes = async () => {
    let nodes = {};
    let graph = {};
    await nodeResolver.Query.allNodes().then(res => {
        res.forEach(node => {
            const location = JSON.parse(node.location).map(Number);

            nodes[node.name] = { x: location[0], y: location[1] };
            graph[node.name] = node.neighbors.map(neigh => neigh.name);
        });
    });
    return { nodes, graph };
}

export const aStar = async (startName, endName) => {
    
    const { nodes, graph } = await fetchNodes();
    
    const startNode = nodes[startName];
    const endNode = nodes[endName];
    if(!startNode || !endNode) {
        return [];
    }

    let openSet = [startName];
    let cameFrom = new Map();

    let gScore = new Map();
    gScore.set(startName, 0);

    let fScore = new Map();
    fScore.set(startName, heuristic(startNode, endNode));

    while (openSet.length > 0) {
        // Get the node in openSet with the lowest fScore
        let current = openSet.reduce((lowest, node) =>
            fScore.get(node) < fScore.get(lowest) ? node : lowest
        );

        if (current === endName) {
            let path = [];
            while (cameFrom.has(current)) {
                path.push(current);
                current = cameFrom.get(current);
            }
            path.push(startName);
            path.reverse();
            console.log('Path found:', path);
            return path;
        }

        openSet = openSet.filter(node => node !== current);
        console.log('Current node:', current);

        for (let neighborName of graph[current]) {
            let neighbor = nodes[neighborName];
            let tentativeGScore = gScore.get(current) + 1;

            if (!gScore.has(neighborName) || tentativeGScore < gScore.get(neighborName)) {
                cameFrom.set(neighborName, current);
                gScore.set(neighborName, tentativeGScore);
                fScore.set(neighborName, gScore.get(neighborName) + heuristic(neighbor, endNode));

                if (!openSet.includes(neighborName)) {
                    openSet.push(neighborName);
                }
            }
        }
    }
    return []; // No path found
}




export const aStar_MAC = async (startMAC, endMAC) => {
    
    const { nodes, graph, names } = await fetchNodesMAC();
    
    const startNode = nodes[startMAC];
    const endNode = nodes[endMAC];
    if(!startNode || !endNode) {
        return [];
    }

    console.log('Start node:', startNode);
    console.log('End node:', endNode);

    let openSet = [startMAC];
    let cameFrom = new Map();

    let gScore = new Map();
    gScore.set(startMAC, 0);

    let fScore = new Map();
    fScore.set(startMAC, heuristic(startNode, endNode));

    while (openSet.length > 0) {
        // Get the node in openSet with the lowest fScore
        let current = openSet.reduce((lowest, node) =>
            fScore.get(node) < fScore.get(lowest) ? node : lowest
        );

        if (current === endMAC) {
            let path = [];
            while (cameFrom.has(current)) {
                path.push(current);
                current = cameFrom.get(current);
            }
            path.push(startMAC);
            path.reverse();
            let aux = [];
            for (let i = 0; i < path.length; i++) {
                aux.push(names[path[i]]);
            }
            console.log('Path found:', aux);
            return aux;
        }

        openSet = openSet.filter(node => node !== current);
        console.log('Current node:', current);

        for (let neighborName of graph[current]) {
            let neighbor = nodes[neighborName];
            let tentativeGScore = gScore.get(current) + 1;

            if (!gScore.has(neighborName) || tentativeGScore < gScore.get(neighborName)) {
                cameFrom.set(neighborName, current);
                gScore.set(neighborName, tentativeGScore);
                fScore.set(neighborName, gScore.get(neighborName) + heuristic(neighbor, endNode));

                if (!openSet.includes(neighborName)) {
                    openSet.push(neighborName);
                }
            }
        }
    }
    return []; // No path found
}



export const whereami = async (req, res) => {
    const data = req.body.data;
    if(!data) {
        return res.status(400).json({ message: 'No data provided' });
    }

    const { names } = await fetchNodesMAC();

    if (!Array.isArray(data)) {
        console.error('Expected an array but got:', typeof data);
        return res.status(400).json({ message: 'Invalid data format' });
    }

    const closestDevice = data.reduce((closest, current) => {
        return (current.dist < closest.dist) ? current : closest;
    });

    const name = names[closestDevice.id];
    
    return res.status(200).json({ message: 'You are here', name });
}