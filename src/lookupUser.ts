import fetch from "cross-fetch";

export function lookupUser(user: string, uri: string){
    return fetch(`${uri}/lookup?user=${user}`).then(res => {
        if (res.status !== 200) {
            throw new Error(`Failed to lookup user ${user} on seed server: ${res.statusText}`);
        }
        return res.json();
    });
}