
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

