const express = require('express');
const log = (message) => console.log(message);
const app = express();
const port = 3000;
let db = require("./db.json");
const { 
  verifyUser,
  isUsernameInDb,
  getUserRentHistory,
  isUserIdInDb,
  getTodayDate,
  getUserById,
  isGameInDb,
  getGameById,
  rentGame,
  updateDb,
  getOpinionList,
  getOfferList,
  getStrFromParam,
  getIntFromParam
} = require("./functions");

app.use(express.static('public'));
app.use(express.json());

app.get('/get-offers', (req, res) => {
  res.send(JSON.stringify(getOfferList()));
});

app.get('/game_info/:id', (req, res) => {
  var id = parseInt(req.params.id.split("=")[1]);
  res.send(JSON.stringify(getGameById(id)));
});

app.get('/rent_game/:userId&:gameId', (req, res) => {
  var userId = getIntFromParam(req.params.userId);
  var gameId = getIntFromParam(req.params.gameId);
  var statusCode = rentGame(userId, gameId) ? 200 : 404
  res.sendStatus(statusCode);
});

app.get('/onlogin/:userName&:userPassword', (req, res) => {
  var username = getStrFromParam(req.params.userName);
  var password = getStrFromParam(req.params.userPassword);
  var userId = verifyUser(username, password);
  var statusCode = 404;
  if (userId >= 0 )
  { 
    statusCode = 200;
  }
  res.status(statusCode).json(`${userId}`);
});

app.get('/getUserData/:userId', (req, res) => {
  var userId = getIntFromParam(req.params.userId);
  res.json(JSON.stringify(getUserById(userId)));
});

app.get('/checkUsernameInDb/:userName', (req, res) => {
  var username = getStrFromParam(req.params.userName);
  res.json(JSON.stringify(isUsernameInDb(username)));
});

app.get('/getRentHistory/:userId', (req, res) => {
  var userId = getIntFromParam(req.params.userId);
  res.json(JSON.stringify(getUserRentHistory(userId)));
});

app.post('/addUser',
  (req, res) => {
    const { email, phone, password, name, surname} = req.body;
    const id = Math.max(...db.users.map(user => user.id)) + 1;
    const user = {
      "id" : id,
      "email" : email,
      "phone" : phone,
      "password" : password,
      "name" : name,
      "surname" : surname,
      "registryDate" : getTodayDate()
    };

    console.log(user);

    db.users.push(user);
    updateDb();

    res.sendStatus(200);
});

app.post('/addProblem',
  (req, res) => {
    const { userId, content} = req.body;
    const id = Math.max(...db.problems.map(p => p.id)) + 1;
    db.problems.push({
      "id" : id,
      "userId" : userId,
      "content" : content
    });

    updateDb();
    
    res.sendStatus(200);
});

app.get('/get-opinions', (req, res) => {
  res.send(JSON.stringify(getOpinionList()));
});

app.post('/addOpinion',
  (req, res) => {
    const { userId, content, stars} = req.body;
    db.opinions.push({
      "userId" : userId,
      "content" : content,
      "stars" : stars
    });

    updateDb();
    
    res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
