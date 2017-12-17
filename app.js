const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser'); is not needed to require

const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

// Use native promises
mongoose.Promise = global.Promise;

// Connect to MongoDB on ATLAS Cloud
mongoose.connect('mongodb://restful-shop:' +
  process.env.MONGO_ATLAS_PSWD +
  '@cluster0-shard-00-00-oumiv.mongodb.net:27017,cluster0-shard-00-01-oumiv.mongodb.net:27017,cluster0-shard-00-02-oumiv.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin',
  {
    useMongoClient: true
  }
);

// Use Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Handling CORS(Cross-Origin-Resource-Sharing) Errors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-Width, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// Use Routes
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

// Errors Handling
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
