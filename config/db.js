const mongoose = require('mongoose');
//allows me to use the default.json
const config = require('config');
//pulls my variables from the default.json
const db = config.get('mongoURI');

//Async function for starting and connecting to the DB
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.log(err.message);
    //Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
