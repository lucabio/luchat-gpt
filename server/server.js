const express = require('express');

require('dotenv').config({
    path: process.env.NODE_ENV === 'production' ? '.env.production'
         : process.env.NODE_ENV === 'stage' ? '.env.stage'
         : '.env.development'
  });


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const protectedRoutes = require('./routes/protected/protectedRoutes');
const openaiRoutes = require('./routes/protected/openaiRoutes');
const cors = require('cors');


const app = express();
const port = 3000;
app.use(cors());

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/api', protectedRoutes);
app.use('/api/openai', openaiRoutes);


// Route base - Solo per scopi di test
app.get('/', (req, res) => {
    res.send('Benvenuto al Server di IntelAIGen');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${port}`);
});