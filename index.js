const express = require('express');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');
const app = express();

//config variables in dotenv
require('dotenv').config();

//Setup mongoose
const mongoose = require('mongoose');

//Connection to MongoDB
var mongoDB = process.env.monglDBLocalURL;
mongoose.connect(mongoDB, { useNewUrlParser: true }); //To avoid deprecated messages

mongoose.connection.on('error', console.error.bind(console, 'MongoDB Database Connection Error: '));
mongoose.connection.once('open', () => {
	console.log('Connection established to MongoDB..');
});

//refer to the schema
schema = require('./schema/mongoDBSchema'); 

// ****** allow cross-origin requests code START ****** //
app.use(cors()); // uncomment this to enable all CORS and delete cors(corsOptions) in below code
/*var allowedOrigins = process.env.allowedOrigins.split(',');
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));*/

// bind express with graphql
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: false
}));

app.use('/', (req, res) => res.send("Welcome Backend Server Services..."));
app.listen(process.env.PORT, () => console.log('Backend Server is ready on localhost:' + process.env.PORT));