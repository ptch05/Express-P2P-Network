import express from 'express';
import { getRandomSeedServer } from './src/getRandomSeedServer';
import { registerWithSeedServer } from './src/registerWithSeedServer';
import { register } from './src/routes/register';
import { lookup } from './src/routes/lookup';

const PORT = process.env.PORT ?? 3000;
const app = express();

app.use(express.json());

app.post("/register", register);
app.get("/lookup", lookup);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


async function initialize(){
    const randomSeedServerUri = getRandomSeedServer();
    await registerWithSeedServer(randomSeedServerUri);
}

setTimeout(() => {
    initialize();
}, 500);
