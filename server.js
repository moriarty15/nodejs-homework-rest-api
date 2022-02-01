const app = require('./app')
const dotenv = require("dotenv")
dotenv.config()

const { DB_HOST } = process.env;

const mongoose = require('mongoose');

mongoose.connect(DB_HOST)
  .then(() => console.log("database connect success111"))
  .catch(error => console.log(error.message))

// app.listen(3000, () => {
//   console.log(`Server running. Use our API on port: ${3000}`)
// })
