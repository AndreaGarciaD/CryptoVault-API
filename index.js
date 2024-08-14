const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

//cors
const corsOptions = {
    origin: 'http://localhost:5173',
}

app.use(cors(corsOptions))

//body parser para leer los datos del formulario
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//file upload
const fileUpload = require('express-fileupload');
app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 },
}));


//carpetas estaticas
app.use(express.static('public'));

const db = require("./models");
db.sequelize.sync(/*{ force: true }*/).then(() => {
    console.log("db resync");
});

require("./routes")(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});