import express from 'express';
import { getRandomSeedServer } from './src/getRandomSeedServer';
import { registerWithSeedServer } from './src/registerWithSeedServer';
import { register } from './src/routes/register';
import { lookup } from './src/routes/lookup';
import { addNode } from './src/servers';
import { seeds } from './seed';

const PORT = process.env.PORT ?? 3000;
const app = express();

app.use(express.json());

app.post("/register", register);
app.get("/lookup", async (req, res, next) => {
    try {
        await lookup(req, res);
    } catch (error) {
        next(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


async function initialize(){
    for (let seed of seeds){
        addNode(seed);
    }
    const randomSeedServerUri = getRandomSeedServer();
    await registerWithSeedServer(randomSeedServerUri.uri);
}

setTimeout(() => {
    initialize();
}, 500);
