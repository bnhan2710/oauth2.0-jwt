const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')

const app = express();

app.use(express.json());

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Could not connect to MongoDB...', err);
    }
})();

app.use(cookieParser());
app.use(cors());
app.use('/v1/auth', authRoute);
app.use('/v1/user',userRoute)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
