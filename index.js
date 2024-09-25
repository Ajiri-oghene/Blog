const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./routes/users');
const auth = require('./routes/auth');
const posts = require('./routes/posts');
const likes = require('./routes/likes');
const comments = require('./routes/comments');
const verification = require('./routes/verification');
const isAdmin = require('./routes/admin');
const errorHandler = require('./middleware/errorHandler');
const app = express();


dotenv.config();
const api = process.env.API_URL || '/api';
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DataBase connection is successful!!!"))
.catch((err) =>{
    console.log(err);
});

app.use(express.json());
app.use(`${api}/users`, users);
app.use(`${api}/auth`, auth);
app.use(`${api}/posts`, posts);
app.use(`${api}/likes`, likes);
app.use(`${api}/comments`, comments);
app.use(`${api}/verify-email`, verification);
app.use(`${api}/make-admin`, isAdmin);


app.use(errorHandler)



const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`LISTENING ON PORT ${port}...`));