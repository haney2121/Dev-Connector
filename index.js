const express = require('express');
const connectDB = require('./config/db');
//Setup Express Server
const app = express();
//Connecting Database
connectDB();

//Init Middelware - bodyparser built with express
app.use(express.json({ extended: true }));

app.get('/', (req, res) => res.send('API RUNNING'));

//Defined Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

//Server starting up
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
