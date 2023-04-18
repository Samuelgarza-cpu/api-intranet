const express = require('express')
const routes = require('./routes/routes.index')
const app = express();
const cors = require('cors')
require('dotenv').config();
const morgan = require('morgan');

app.set('puerto', process.env.PORT || 5050)

app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(express.text());
app.use(morgan('dev'));
app.use(cors());

app.use('/api', routes);
app.use((req, res, next) => {
  res.status(404).json({
    message: "endpoint not found",
  });
});


app.listen(app.get("puerto"), () => {
  console.log("SERVIDOR CORRIENDO EN EL PUERTO", app.get("puerto"));
});
