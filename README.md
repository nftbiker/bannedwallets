## About

This is a an express js server to find if a list of wallets is banned on teia or not. Running a micro service to check help to reduce the size of your web3 app, as you will not have to include the full list of banned wallets nor have to download it live.

## Getting Started

Running or deploying this is out of the scope. Read any howto about express js if needed.
But we run this as a webservice on render.com without any problems

## API access point

GET /banned?wallets=tz1,tz2,...,tzN

If you have a large number of wallets to check, then do a JSON POST request to the same access point, but with +wallets+ containing an array of wallet address instead of a coma separated list string.

The result is a hash containing only banned wallets, to reduce size of the response (ie clean wallets are not returned)

## Security

To limit the use of this service to your own website, make sure to adatp CORS settings in the code

## Update restricted list

The restricted.json list is from teia-report repository, and it's update once per day through a github action worflow