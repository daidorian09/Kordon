import https from 'https';

const options = {
    keepAlive: true,
    maxSockets: 35,
    keepAliveMsecs: 1500
};

const agent = new https.Agent(options);

export const REQUEST_GLOBALS = Object.freeze({
    gzip: true,
    json: true,
    strictSSL: false,
    agent
});