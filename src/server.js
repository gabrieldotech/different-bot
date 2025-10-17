
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();


const app = express();


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));



app.get('/', (req, res) => {
    res.redirect('/login');
});


app.get('/login', (req, res) => {

    res.render('login');  
});

app.get('/chat', (req, res) => {
 
    res.render('chat', { username: 'Gabriel Ramos' });  
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
    
});