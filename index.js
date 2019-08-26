const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const home = require('./routes/home');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const rentals = require('./routes/rental');
const movies = require('./routes/movies');
const morgan = require('morgan');
const helmet = require('helmet');

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
.then(() => console.log('Connected to MongoDB'))
.catch( err => console.log('Couldn not connect to MongoDB... '));

app.use(morgan('tiny'));
app.use(express.json());
app.use(helmet());


app.use('/', home);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);


const port = process.env.PORT || 3000;
app.listen(port, (req , res) => {
    console.log(`listening to port ${port}`);
});