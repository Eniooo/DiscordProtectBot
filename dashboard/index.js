import express from 'express';
const app = express();
app.set('view engine', 'ejs');
app.set('views', './dashboard/views');
app.use(express.static('dashboard/public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () => {
  console.log('🌐 Dashboard lancé : http://localhost:3000');
});
