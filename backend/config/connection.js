const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/videoApp';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect()
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = client;
