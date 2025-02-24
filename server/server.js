const express = require('express');
const path = require('path');
const sql = require('mssql');
const fs = require('fs').promises;
const app = express();
const PORT = 3000;
const { CONFIG } = require('../config.js'); 

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'app')));

const config = {
    user: 'sa',
    password: CONFIG.DB,
    server: 'localhost',
    port: 1433,
    database: 'QuizzerDatabase',
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  };
  
  sql.connect(config)
    .then(() => console.log('Connected to SQL Server'))
    .catch(err => console.error('Connection failed:', err));

// load home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'app', 'index.html'));
});

app.get('/recent5', (req, res) => {
    /*
    TODO: get the recent 5 quiz scores from the user 
    */
});

// load quiz page
app.get('/quiz', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'app', 'quiz.html'));
});

// generates a random set of 10 questions from questions.json
app.get('/getQuiz', async (req, res) => {
    // get random numbers between 0 and 30 for randomly generated questions
    let count = 10;
    let min = 0;
    let max = 29;
    let random = new Set(); 
    let questionList = [];
    while (random.size < count) {
        let n = Math.floor(Math.random() * (max - min + 1)) + min;
        random.add(n);
    }
    try {
        const data = await fs.readFile(path.join(__dirname, 'questions.json'), 'utf-8');
        console.log(random);
        const questions = JSON.parse(data);
        random.forEach((randIndex) => questionList.push(questions[randIndex]))
        res.json(questionList);
    } catch (error) {
        console.error("Error reading questions file:", error);
    }
});

// load results page
app.get('/results', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'app', 'results.html'));
});

// process the results of the quiz into the database for the user to see past attempts in menu
app.post('/results', (req, res) => {
    const {numCorrect} = req.body;
    console.log(numCorrect);
    /*
    TODO: insert into database quiz results table (SERIAL PK (quiz number), numCorrect, user)
    */
});

app.listen(PORT, () => {
    console.log(`🔥 Server running at http://localhost:${PORT}`);
});
