import fetch from "cross-fetch";

export function registerWithSeedServer(uri: string){
    return fetch(`${uri}/register`, {
        method: "POST",
        body: JSON.stringify({
            uri: `http:localhost:${process.env.PORT}`,
            user: process.env.USERNAME,
        }),
        headers: {
            "Content-Type": "application/json",
        }
    }).then(res => res.json());
}