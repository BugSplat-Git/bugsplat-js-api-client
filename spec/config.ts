import dotenv from 'dotenv';
dotenv.config();

const host = <string>process.env.BUGSPLAT_HOST;
const email = <string>process.env.BUGSPLAT_USER;
const password = <string>process.env.BUGSPLAT_PASSWORD;
const database = <string>process.env.BUGSPLAT_DATABASE;
const clientId = <string>process.env.BUGSPLAT_CLIENT_ID;
const clientSecret = <string>process.env.BUGSPLAT_CLIENT_SECRET;

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

if (!clientId) {
    throw new Error('Please set BUGSPLAT_CLIENT_ID env variable');
}

if (!clientSecret) {
    throw new Error('Please set BUGSPLAT_CLIENT_SECRET env variable');
}

if (host.includes('octomore')) {
    // This allows us to use self-signed certificates, or out-of-date certs in our tests.
    // Without this, Node fetch rejects the requests to octomore.bugsplat.com when we map
    // it to a local IP address using /etc/hosts.
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export const config = {
    host,
    email,
    password,
    database,
    clientId,
    clientSecret
};