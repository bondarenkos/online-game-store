let db = require("./db.json");
const fs = require('node:fs');

function verifyUser(username, password)
{
  for (var i = 0; i < db.users.length; i++) {
    var user = db.users[i];
    if((user.email == username || user.phone == username) && user.password == password) {
      return user.id;
    }
  }
  return -1;
}

function isUsernameInDb(username)
{
  for (var i = 0; i < db.users.length; i++) {
    var user = db.users[i];
    if(user.email == username || user.phone == username) {
      return true;
    }
  }
  return false;
}

function getUserRentHistory(userId)
{
  var userRents = db.rents.filter(item => item.userId == userId);
  let result = [];
  userRents.forEach(rent =>
    {
      var game_data = getGameById(rent.gameId);

      result.push(
        {
          "title" : game_data.title,
          "imgPath" : game_data.imgPath,
          "beginDate" : rent.beginDate,
          "endDate" : rent.endDate
        }
      );
    });
  return result;
}

function isUserIdInDb(userId)
{
  for (var i = 0; i < db.users.length; i++) {
    var user = db.users[i];
    if(user.id == userId) {
      return true;
    }
  }
  return false;
}

function getTodayDate()
{
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${year}.${month}.${day}`;
  
  return currentDate;
}

function getUserById(userId)
{
  for (var i = 0; i < db.users.length; i++) {
    var user = db.users[i];
    if(user.id == userId) {
      return user;
    }
  }
  return null
}
function isGameInDb(gameId)
{
  for (var i = 0; i < db.users.length; i++) {
    var game = db.games[i];
    if(game.gameId == gameId) {
      return true;
    }
  }
  return false;
}

function getGameById(gameId)
{
  return db.games.filter(game => game.gameId == gameId)[0];
}

function rentGame(userId, gameId)
{
  let game = getGameById(gameId);
  if(game === undefined || game.amount < 1 || !isUserIdInDb(userId))
  {
    return false;
  }

  game.amount -= 1;

  db.rents.push({
    "userId": userId,
    "gameId": gameId,
    "beginDate": getTodayDate(),
    "endDate": null
  });

  updateDb();
  return true;
}

function updateDb()
{
  fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
}

function getOpinionList()
{
  var op = db.opinions;
  var result = [];

  op.forEach(item =>
  {
    var user = getUserById(item.userId);
    result.push(
      {
        "userData" : user.name + " " + user.surname,
        "content" : item.content,
        "stars" : item.stars
      }
    );
  });

  return result;
}

function getOfferList()
{
  return db["games"];
}

function getStrFromParam(parameter)
{
  return parameter.split("=")[1];
}

function getIntFromParam(parameter)
{
  return parseInt(getStrFromParam(parameter));
}

function isValidPassword(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);
}

module.exports = {
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
    getIntFromParam,
    isValidPassword
};
  