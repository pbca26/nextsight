## Komodo Token Explorer rewrite in NextJS

Previous version of the explorer was implemented based on KMD version of Insight Explorer. While previous version had quite wide range of various features like standard blocks/transactions lookup it's code is dated and written in ES5 w/o any support for bundlers or code checkers.

Current version is a boiled down version of Insight Explorer with tokens support only, no extra features and is written using modern NextJS framework and MongoDB as main storage.

## Env
Add the following to your .env.local file

```
NEXT_PUBLIC_NODE_ENV=development
NEXT_PUBLIC_DEV_URL=http://localhost:3000

MONGODB_URI=mongodb://localhost
MONGODB_NAME=explorer_TKLTEST

KMD_RPC_USER=123
KMD_RPC_PASS=123
KMD_RPC_SERVER=127.0.0.1
KMD_RPC_PORT=19260
```