const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');

const app = express();

app.use(
  cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [keys.cookieKey]
  })
);

app.use (passport.initialize());
app.use (passport.session());
app.use (bodyParser.json());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);

mongoose.connect(
  keys.mongoURI,
  {useNewUrlParser: true}
);

const PORT = process.env.PORT || 5000;
app.listen(PORT);