
<!-- GitMind workflow create kora -->
<!-- draw.io database draw kora  -->
<!-- git init, git checkout -b "development" -->
<!-- git subbranch create kora , git checkout -b "project-setup"  -->
<!-- project start -->
npm init -y 
npm install -D typescript 
tsc --init <!-- tsconfig.json file rootDir text a ./src likhte hobe and outDir te likhte hobe ./dist -->
npm i express mongoose zod jsonwebtoken cors dotenv
npm i ts-node-dev @types/express @types/cors @types/dotenv @types/jsonwebtoken 
<!-- root folder a src folder create kora dist folder create kora, src maje server.ts app.ts and App folder create korte hobe. -->
<!-- 

=> app folder a modules folder create korbo , modules folder ar maje user,tour folder create korbo, user folder ar maje user.interface.ts user.model.ts user.controller.ts 3 ta file create korbo same vabe tour folder a model interface controller file create korbo.  

=> server.ts file code likhar por 
    package.json file scripts er maje ei code ta likhte hobe
    "dev": "ts-node-dev --respawn --transpile-only ./src/server.ts",
    then npm run dev diye server run korte hobe. 

=> extra kono code thakle oi gulo ke khuje ber korar jonno typescript eslint use korte hoy. 
    google theke typescript eslint search korte hobe
    termianal a install korte hobe
    npm install --save-dev eslint @eslint/js typescript typescript-eslint
    root folder a eslint.config.mjs ei file create korte hobe
    eslint.config.mjs file a // @ts-check

    import eslint from '@eslint/js';
    import { defineConfig } from 'eslint/config';
    import tseslint from 'typescript-eslint';

    export default defineConfig(
        eslint.configs.recommended,
    //   tseslint.configs.recommended,
        tseslint.configs.strict,
        tseslint.configs.stylistic,
        {
            rules: {
                "no-console": "error",
            }
        }
    );
    code likhte hobe 
    VS Code ESLint extension install korte hobe.






-->
<!-- amader joto status code ache oi gulo hate likhte hobe na default status deoya ache oi khan theke choice kore dilei hobe er jonn termianl a command ta run kore install korte hobe -->
npm i http-status-codes

# one module work setp by setp flow 
- route matching (app.ts -> routes to index.ts -> user.router.ts )
- controller 
- service
- model 
- DB

<!-- every part a amader ei koyta kaj korte hobe tobe routeing a app.ts file temon are kono kaj nai -->

password has(#) tag korar jonno terminal a nicher command use korte hobe.
- npm i bcryptjs
- npm i -D @types/bcryptjs

password kaj ses hoyar por user ken akta token dite hobe. token set krorar jonno nicher 2 ta install korte hobe terminal a 
- npm i jsonwebtoken
- npm i -D @ types/jsonwebtoken

cookie set korar jonno install korte hobe 
- npm i cookie-parser
- npm i -D @types/cookie-parser

google authenticaton korar jonno 
=> google search a giye passport js search korte hobe . ei khan theke passport authentication document paoya jabe.
=> google search a giye google cloud search korte hobe. Google Cloud: Cloud Computing Services click kore top right side a Console button a click korte hobe. left side toggole button a click kore API & service a click korte hobe . left side a auth and client service a clcik korte hobe. left side client clcik korle create app ta paoya jabe . App ta ke click korle GOOGLE_CLIENT_SECRET= and GOOGLE_CLIENT_ID= right side paoya jabe ja kina .env file likha hoiche . tobe GOOGLE_CLIENT_SECRET ta first time copy kore nite hobe jodi copy korte vule jai ta hole new create kore age copy kore ager ta delete kore dite hobe. first a disable kore then delete korte hobe. then .env file a id and secret ta bosaite hobe. 

=> are o kicho pacage install korte hobe
- npm i passport passport-local passport-google-oauth20
- npm i -D @types/passport @types/passport-local @types/passport-google-oauth20





