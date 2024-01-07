const express = require("express")

// banned wallets from
// https://raw.githubusercontent.com/teia-community/teia-report/main/restricted.json
const bannedWallets = require('./restricted.json')

const app = express()
const port = process.env.PORT || 8080

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


function verifyReferrer(req) {
  console.log(req)
  let ref = req.get('Referrer')
  console.log('referrer:', ref)
  if (typeof ref === 'undefined') return true
  else if (ref == '') return true

  return ref.match(/^https?:\/\/(www\.)nftbiker.(xyz|test)/im) ? true : false
}

function isBanned(wallet) {
  return bannedWallets.includes(wallet)
}

function processRequest(req, res, wallets) {
  if (!verifyReferrer(req)) {
    res.status(403).json({})
    return
  }

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