
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

//=========================
var mongoose = require('mongoose');
//=========================
const app = express();


// Middleware
app.use(cors({ origin: '*' }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static folders
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Serve static files from .next (buildd) - like CSS/JS
app.use('/_next', express.static(path.join(__dirname, 'buildd'))); // required for Next.js static assets

// ✅ Optional - explicitly serve static files (safe fallback)
app.use('/static', express.static(path.join(__dirname, 'buildd/static')));
app.use('/css', express.static(path.join(__dirname, 'buildd/static/css')));
app.use('/chunks', express.static(path.join(__dirname, 'buildd/static/chunks')));
app.use('/pages', express.static(path.join(__dirname, 'buildd/static/chunks/pages')));

// Routes
//=========================
console.log("Mongo URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB is Connected"))
  .catch((error) => console.log(error));

app.use(cors({
  origin: "*"
}));

//=========================
app.use('/', indexRouter);
app.use('/users', usersRouter);





// ✅ Catch-all route: return index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'buildd', 'server', 'pages', 'index.html'));
});

// Error handling
app.use((req, res, next) => {
  const createError = require('http-errors');
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Start server
const port = process.env.PORT || 2556;
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});

module.exports = app;
