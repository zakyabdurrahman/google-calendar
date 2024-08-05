const express = require('express');
const Controller = require('./controllers/controller');
const app = express();
const PORT = 3000;

app.use(express.json())

app.get('/google', Controller.google)
app.get("/oauth2callback", Controller.getToken);

app.listen(PORT, () => {
    console.log("online on http://localhost:3000");
    
})