const mongoose = require("mongoose");

// Conenction to Database
const connectDB = async () => {
  await mongoose.connect(process.env.database_connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("MongoDB Connected");
};

module.exports = connectDB;