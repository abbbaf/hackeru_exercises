const flights = require('./routes/flights');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const mongoose = require('mongoose');
const cors = require('cors');

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3900;
const url = `http://${host}:${port}/flights`

mongoose.connect(`mongodb://${host}/flights`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => console.log('Connected to MongoDB...'))
  .catch(() => console.error('Could not connect to MongoDB...'));

app.use(cors())
app.use(express.json());

const errorHandler = (_,res) => {

    const details = {
      [`${url}/all`]: 'Get all flights',
      [`${url}/flight_number/[flight_number]`] : 'Get flight details for [flight_numebr]',
      [`${url}/destination/[destination]`]: 'Get all flights to [desination]',
      [`${url}/takeoff_date/[date]`]: 'Get all flights on [date]'
    }
    res.json(details)
}

app.use('/flights', flights);
app.use(errorHandler);


http.listen(port, () => console.log(`Listening on port ${port}...`));
