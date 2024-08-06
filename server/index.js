const express = require('express');
const cors = require('cors');
const connectMongo = require('./configs/database.connect');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const OauthRoute = require('./routes/Oauth')
const passport = require('passport');
const app = express();
connectMongo();
const cookieSession = require('cookie-session')

app.use(cookieSession({
  keys: [process.env.COOKIE_KEY],
  maxAge: 24 * 60 * 60 * 1000}));

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/v1/auth', authRoute);
app.use('/v1/user',userRoute)
app.use('/api/v1/auth',OauthRoute)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(passport.initialize());
app.use(passport.session());


app.get('/api/v1/user/me', (req, res) => {
    return res.json(req.user);
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
