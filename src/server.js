import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import cors from 'cors';

import { initDB } from './models/init.js';
import router from './router.js';

config();

const allow_origin = `${process.env.FRONT_PROTOCOL}://${process.env.FRONT_URL}${process.env.FRONT_PORT ? process.env.FRONT_PORT : ''}`;

const app = express();
app.use(
  cors({
    origin: allow_origin,
    credentials: true
  })
);

// Configure session middleware
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set secure to true if using HTTPS
  })
);

// Use built-in middleware to parse JSON bodies && URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

process.on('uncaughtException', function (err) {
  console.error(err);
});

process.on('unhandledRejection', function (err) {
  console.error(err);
});

initDB()
  .then(() => {
    console.log('db init done');
  })
  .catch((err) => {
    console.error(err);
  });

app.use((req, res, next) => {
  // Log the route and method
  const mediaExtensions = /\.(css|jpg|jpeg|svg|png|gif|js|ico|woff|woff2|ttf|eot)(\?.*)?$/i;
  if (!mediaExtensions.test(req.originalUrl)) {
    console.log(
      `${req.method} ${req.originalUrl} ${req?.session?.user?.login ? req.session.user.login : req?.sessionID && req.sessionID} ${req.body && JSON.stringify(req.body)}`
    );
  }
  // Proceed to the next middleware
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, `../../${process.env.FRONT_DIR}/${process.env.FRONT_DIR_BUILD}`)));

app.use('/api', router);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, `../../${process.env.FRONT_DIR}/${process.env.FRONT_DIR_BUILD}`, 'index.html'));
});

app.listen(process.env.PORT, function () {
  console.log(`server up on PORT ${process.env.PORT}`);
});
