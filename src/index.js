const data = require('../data');
const port = process.env.PORT  || 4001;

/**
 * Like http, express is used for CRUD operations on given URLs.
 * Why we use express is because it is faster, secure, simple
 * and easily manageable.
 * Express is a part of npm.
 * Fast, unopinionated, minimalist web framework for node
 */

const express = require('express');
const app = express();

// let's add mniddleware
// TODO: cors and bodyparser

app.get('/', (req,resp) => resp.send('Hello World'));

app.listen(port, () => {
    console.log(`listening to port ${port}`);
});
