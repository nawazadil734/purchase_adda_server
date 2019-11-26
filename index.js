const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const router = require('./router');
const cors = require('cors');
app.use(cors());
require('./database/db');

app.use(bodyParser.json());
// app.use(bodyParser.json({ type: '*/*' }));
app.use(bodyParser.urlencoded({extended: true}))
router(app);
require('dotenv').config();
require('./updatePasswordViaEmail')(app);
require('./resetPassword')(app);
require('./forgotPassword')(app);
require('./image_router')(app);

require('./uploadProfilePhoto')(app);

const port = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(port);
console.log('Server listining on: ', port);