const express = require("express")
const cors = require("cors")

const allowlist = ['https://nftbiker.xyz', 'https://nftbiker.test', 'http://nftbiker.xyz']

// banned wallets from
// https://raw.githubusercontent.com/teia-community/teia-report/main/restricted.json
const bannedWallets = require('./restricted.json')

const app = express()
const port = process.env.PORT || 8080


const corsOptions = {
  origin: '',
  optionsSuccessStatus: 200
}

var corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = {
      origin: true,
      optionsSuccessStatus: 200
    }
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/banned', function (req, res) {
  const wallets = req.query.wallets
  return processRequest(req, res, String(wallets).split(/[\s,;:]+/))
});

app.post('/banned', function (req, res) {
  const wallets = req.body.wallets
  return processRequest(req, res, wallets)
});


function isBanned(wallet) {
  return bannedWallets.includes(wallet)
}

function processRequest(req, res, wallets) {
  list = typeof wallets === 'string' ? [wallets] : wallets

  let b = 0
  let results = {}
  for (let w of list) {
    w = String(w).trim()
    if (w != '' && isBanned(w)) {
      b += 1
      results[w] = true
    }
  }
  console.log(list.length, ' wallets checked : ', b, ' banned')
  res.send(results);
}

app.listen(port, '0.0.0.0');
console.log('Server started at http://127.0.0.1:' + port);