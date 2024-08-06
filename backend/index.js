const express = require('express');
const cors = require('cors');
const connectMongo = require('./configs/database.connect');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const OauthRoute = require('./routes/Oauth')
const app = express();
connectMongo();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/v1/auth', authRoute);
app.use('/v1/user',userRoute)
app.use('/api/v1/auth',OauthRoute)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/v1/user/me', (req, res) => {
    return res.json(req.user);
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
