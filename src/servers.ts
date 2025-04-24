export type Node = {
    user: string;
    uri: string;
}

const servers: Node[] = [];

export function addNode(node: Node){
    const isAlreadyAdded = servers.find(node => node.user === node.user);
    if(isAlreadyAdded) return;
    console.log(`${node.user} registered at uri of ${node.uri}`);
    servers.push(node);
}

export function getNodeByUser(user: string){
    return servers.find(server => server.user === user);
}

export function getNodes(){
    return [...servers];
}