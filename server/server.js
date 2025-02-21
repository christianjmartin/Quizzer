const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const PORT = 3000;

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'app')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'app', 'index.html'));
});
app.post('/', (req, res) => {
    res.send("hello from the backend");
});

app.get('/quiz', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'app', 'quiz.html'));
});
app.post('/quiz', async (req, res) => {
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
        // console.log(questionList);
        res.json(questionList);
    } catch (error) {
        console.error("Error reading questions file:", error);
    }
});

app.listen(PORT, () => {
    console.log(`🔥 Server running at http://localhost:${PORT}`);
});
