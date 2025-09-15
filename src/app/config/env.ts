import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
    PORT: string;
    DB_URL: string;
    NODE_ENV: "development" | "production";
}

const loadEnvVariables = () : EnvConfig => {

    const loadEnvVariables : string[] = [
        "PORT",
        "DB_URL",
        "NODE_ENV", 
    ];
    loadEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Environment variable ${key} is not set`);
        }
    });

    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production", 
    }
}

export const envVars : EnvConfig = loadEnvVariables();

// export const envVars : EnvConfig = {
//     PORT: process.env.PORT,
//     DB_URL: process.env.DB_URL,
//     NODE_ENV: process.env.NODE_ENV,  
     
// }