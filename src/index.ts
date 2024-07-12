import express from 'express';
import { fetchWithTimeout } from './fetchWithTimeout';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.get('/', (req, res) => {
  res.send("Hello World");
})
app.get('/sendtoall', (req, res, next) => {
  res.send(`Sending ${req.query.query}`);
  next()
}, async (req, res) => {
  const endpoint = <string>req.query.query;
  await sendToAll(endpoint)

});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


async function sendToAll(endpoint: string) {
  const result = await fetchWithTimeout(`https://uptimechecker2.onrender.com/maskedcls`);
  const clients = result?.data;
  for (const client of clients) {
    const url = `${client.repl}/${endpoint}`
    console.log("Trying : ", url)
    await fetchWithTimeout(url);
    await sleep(500)
  }
}

async function sleep(ms: number) {
  new Promise((resolve) => { setTimeout(resolve, ms) })
}
