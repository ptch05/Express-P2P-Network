import fetch from "cross-fetch";

export function registerWithSeedServer(uri: string){
    return fetch(`${uri}/register`, {
        method: "POST",
        body: JSON.stringify({
            uri: 'http://localhost:3000',
            user: "sally"
        }),
        headers: {
            "Content-Type": "application/json",
        }
    }).then(res => res.json());
}