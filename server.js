const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require('cors');
const bodyParser = require("body-parser");
const {SignedLotteryContract,TicketContract,SignedCoinContract,drawCall,parseCall,InitializeCall,resetCall} = require('./contract')
const ethers = require('ethers')
const cron = require('node-cron');
const { parse } = require("path");
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());

var web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/"));
// our server instance
const server = http.createServer(app);

var nextParse;
var nextDraw;

var Parse;
var Draw;
/* Below mentioned steps are performed to return the Frontend build of create-react-app from build folder of backend */
// InitializeCall();
async function getParseTime (){
  var _parseTime = await SignedLotteryContract.nextPharse();
  var _roundTime = await SignedLotteryContract.nextDraw();
  nextParse = _parseTime.toString();
  nextDraw = _roundTime.toString();
  console.log(Date.now())
  console.log(nextParse,nextDraw);
  
  let parseDate = new Date(nextParse*1000);
  let drawDate = new Date(nextDraw*1000);

  let parseFormatTime = parseDate.getSeconds()+" "+parseDate.getMinutes()+" "+parseDate.getHours()+" "+parseDate.getDate()+" "+(Number(parseDate.getMonth())+1)+" *";
  console.log(parseFormatTime) 

  console.log(Parse)
  if(Parse!=null)
    Parse.stop();
  Parse = cron.schedule(parseFormatTime, async ()=>{
    await startParse();
  });
  Parse.start();

  console.log(Parse)

  let drawFormatTime = drawDate.getSeconds()+" "+drawDate.getMinutes()+" "+drawDate.getHours()+" "+drawDate.getDate()+" "+(Number(drawDate.getMonth())+1)+" *";
  
  if(Draw!=null)
    Draw.stop();
  Draw = cron.schedule(drawFormatTime,async ()=>{
    await drawandreset();
    getParseTime();
  });
  Draw.start();
  
}

async function drawandreset(){
  await drawCall();
  await resetCall();
}

async function startParse(){
  await parseCall();
}
// startParse();
// drawandreset();
getParseTime();

server.listen(port, () => console.log(`Listening on port ${port}`));
