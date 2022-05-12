import express from 'express';
import { readFile, writeFile } from 'fs/promises';
import logger from 'morgan';
import { MongoClient, ServerApiVersion } from 'mongodb';

const WORD_SCORE_FILE = 'word';
const GAME_SCORE_FILE = 'game';

const uri = "mongodb+srv://Manan:austriala@cluster0.5tqgp.mongodb.net/Cluster0?retryWrites=true&w=majority";


function readScoreFile(path) {
  return async () => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    if (path === WORD_SCORE_FILE) {
      try {
        await client.connect();
        const collection = await client.db('scrabble').collection('word_score').find({}).toArray();
        console.log(collection);
        const top = collection.sort((a, b) => b.score - a.score);
        const val = top.slice(0,10);
        return val;
      } catch (err) {
        console.log(err);
      }
      finally {
        await client.close();
      }
    }
    else if (path === GAME_SCORE_FILE) {
      const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
      try {

        await client.connect();

        const collection = await client.db('scrabble').collection('game_score').find({}).toArray();
        const top = collection.sort((a, b) => b.score - a.score);
        const val = top.slice(0,10);
        return val;
      } catch (err) {
        console.log(err);
      }
      finally {
        await client.close();
      }
    }
  }
}

const top10WordScores = readScoreFile(WORD_SCORE_FILE);
const top10GameScores = readScoreFile(GAME_SCORE_FILE);

// Save to word_score collection
function saveToWordScoreFile() {
  return async (name, word, score) => {
    const data = { name, word, score };
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {

      await client.connect();

      await client.db('scrabble').collection('word_score').insertOne(data);

      // client.close();
    } catch (err) {
      console.error(err);
    }
    finally {
      await client.close();
    }
  };
}

// save to game_score collection
function saveToGameScoreFile() {
  return async (name, score) => {
    const data = { name, score };
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
      await client.connect();
      await client.db('scrabble').collection('game_score').insertOne(data);
    } catch (err) {
      console.error(err);
    }
    finally {
      await client.close();
    }
  };
}

const saveWordScore = saveToWordScoreFile(WORD_SCORE_FILE);
const saveGameScore = saveToGameScoreFile(GAME_SCORE_FILE);

// async function top10WordScores() {
//   const scores = await readWordScores();
//   const sorted = scores.sort((a, b) => b.score - a.score);
//   const top = sorted.slice(0, 10);
//   return top;
// }

// async function top10GameScores() {
//   const scores = await readGameScores();
//   const sorted = scores.sort((a, b) => b.score - a.score);
//   const top = sorted.slice(0, 10);
//   return top;
// }

// Create the Express app and set the port number.
const app = express();
const port = process.env.PORT || 8080;

// Add Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// SOLUTION BEGIN
app.use(logger('dev'));
app.use('/', express.static('client'));
// SOLUTION END
/** TEMPLATE BEGIN 
TODO: Add the morgan middleware to the app.
TODO: Add the express.static middleware to the app. 
 TEMPLATE END */

// SOLUTION BEGIN
app.post('/wordScore', async (request, response) => {
  const { name, word, score } = request.body;
  await saveWordScore(name, word, score);
  response.status(200).json({ status: 'success' });
});

app.get('/highestWordScores', async (request, response) => {
  const scores = await top10WordScores();
  response.status(200).json(scores);
});

app.post('/gameScore', async (request, response) => {
  const { name, score } = request.body;
  await saveGameScore(name, score);
  response.status(200).json({ status: 'success' });
});

app.get('/highestGameScores', async (request, response) => {
  const scores = await top10GameScores();
  response.status(200).json(scores);
});

// This matches all routes that are not defined.
app.all('*', async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});

// Start the server.
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});