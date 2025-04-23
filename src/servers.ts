export type Node = {
    user: string;
    uri: string;
}

const servers: Node[] = [];

export function addNode(node: Node){
    const isAlreadyAdded = servers.find(node => node.user === node.user);
    if(isAlreadyAdded) return;
    servers.push(node);
}