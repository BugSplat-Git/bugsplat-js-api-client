import dotenv from 'dotenv';
dotenv.config();

const host = <string>process.env.BUGSPLAT_HOST;
const email = <string>process.env.BUGSPLAT_USER;
const password = <string>process.env.BUGSPLAT_PASSWORD;
const database = <string>process.env.BUGSPLAT_DATABASE;

if (!host) {
    throw new Error('Please set BUGSPLAT_HOST env variable');
}

if (!email) {
    throw new Error('Please set BUGSPLAT_USER env variable');
}

if (!password) {
    throw new Error('Please set BUGSPLAT_PASSWORD env variable');
}

if (!database) {
    throw new Error('Please set BUGSPLAT_DATABASE env variable');
}

export const config = {
    host,
    email,
    password,
    database
};