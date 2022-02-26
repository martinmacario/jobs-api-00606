require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// extra packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');


// connect db
const connectDB = require('./db/connect');

// routes
const authorizationRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// middlewares
const authenticateUser = require('./middleware/authentication')

app.use(express.json());
// extra packages
app.use(helmet());
app.use(cors());
app.use(xss());

app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// routes
app.use('/api/v1/auth', authorizationRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

app.use('/', (req,res)=>{
  res.send('Jobs api 6060 launch...')
})
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
