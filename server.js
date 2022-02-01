const app = require('./app')

const mongoose = require('mongoose');

const DB_HOST = "mongodb+srv://Vladimir:1151020Pp@cluster0.0fzje.mongodb.net/db-contacts?retryWrites=true&w=majority"

mongoose.connect(DB_HOST)
  .then(() => console.log("database connect success"))
  .catch(error => console.log(error.message))

// app.listen(3000, () => {
//   console.log(`Server running. Use our API on port: ${3000}`)
// })
