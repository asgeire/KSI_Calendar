var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var request = require('request');
var xml2js = require('xml2js');


// !!! STILLINGAR !!!
var motNumer = "35586"; //Pepsi deild karla 2016
var myTeam = "Stjarnan"; //SET YOUR TEAM NAME
// !!! STILLINGAR !!!

var myGames = [];
var today = new Date();

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Google Calendar API.
  authorize(JSON.parse(content), saveGamesToCalendar);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

var globalauth;
function saveGamesToCalendar(auth) {
  globalauth = auth;
  getXmlGamesFromKSI(parseGameResponse); //MAIN
}


function insertGames(gamesString) {
  var calendar = google.calendar('v3');

  for (i = 0; i < myGames.length; i++) { 
    game = myGames[i];
    var newEvent = {
      'id': game.LeikurNumer[0],
      'summary': game.FelagHeimaNafn + " - " + game.FelagUtiNafn,
      'description': 'Pepsi deildin',
      'location': game.VollurNafn[0],
      'start': {
        'dateTime': new Date(game.LeikDagur),
        'timeZone': 'Iceland',
      },
      'end': {
        'dateTime': new Date(game.LeikDagur).addHours(2),
        'timeZone': 'Iceland',
      },
      'reminders': {
        'useDefault': true
      },
    };

    //console.log(newEvent.summary);

    calendar.events.insert({
      auth: globalauth,
      calendarId: 'primary',
      resource: newEvent,
    }, function(err, event) {
      if (err) {
        console.log('There was an error creating an event: ' + err);
        return;
      }
      console.log(event.summary + ' created');
      console.log('Event link: %s', event.htmlLink);
    });
  }
  console.log("Program end");
}

function parseGameResponse(xml) {
  xml2js.parseString(xml, function (err, result) {
    var games = result["soap:Envelope"]["soap:Body"][0].MotLeikirResponse[0].MotLeikirSvar[0].ArrayMotLeikir[0].MotLeikur;
    console.log("Got " + games.length + " games from KSI response");
    filterGames(games);
});
}

function filterGames(games){
  for (i = 0; i < games.length; i++) { 
    game = games[i];
    if(game.FelagHeimaNafn == myTeam || game.FelagUtiNafn == myTeam){
      var d1 = new Date(game.LeikDagur);
      if(d1.getTime() > today.getTime()){
        myGames.push(game);
      }
    }
  }
  console.log("Game count after filtering " + myGames.length);
  insertGames();
}


function getXmlGamesFromKSI(callback) {
  var soapInput = 
"<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:mot='http://www2.ksi.is/vefthjonustur/mot/'><soapenv:Header/><soapenv:Body><mot:MotLeikir><mot:MotNumer>"+motNumer+"</mot:MotNumer></mot:MotLeikir></soapenv:Body></soapenv:Envelope>";
  request({
    url: "http://www2.ksi.is/vefthjonustur/mot.asmx",
    method: "POST",
    headers: {
        "content-type": "text/xml;charset=UTF-8"
    },
    body: soapInput
}, function (error, response, body){
  if (!error && response.statusCode == 200) {
    console.log('Successfully called KSI webservice');
    callback(body);
  }
  else {
    console.log("HTTP error");
    //console.log(response);
  }
});
}


Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}