const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
require('express-group-routes');


//import controllers
const controllerUser = require("./controllers/users");

const { authenticated } = require('./middleware');

const app = express();

const port = process.env.PORT || 5000;

app.use(bodyParser.json());

const storage = multer.diskStorage({
	destination(req, file, callback) {
		// callback(null, '../images');
		callback(null, path.join(__dirname, '/images/'));
	},
	filename(req, file, callback) {
		authenticated(req, {}, (ress) => {
			callback(null, `${Date.now()}_${file.originalname}`);
		})
	},
});

const authUpload = multer({ storage });
// const upload = multer({ dest: './images' })

app.get('/', (req, res) => {
	console.log('node js server starting...');
	return res.status(500).send({
		success: true,
		message: 'OK',
	});
});

const routerUser = express.Router();

routerUser.post('/login', controllerUser.login);
routerUser.post('/register', controllerUser.register);
routerUser.post('/check-login', controllerUser.checkLogin);
routerUser.get('/get-all', authenticated, controllerUser.getAll);
routerUser.put('/update', authenticated, controllerUser.updateUser);
routerUser.delete('/delete', authenticated, controllerUser.deleteUser);


//REST API
app.use('/api/user', routerUser);

app.listen(process.env.PORT || 5000, () => {
	console.log(`listen on port ${port}!`)
});

//server harus update db:migrate setelah aplikasi diupdate kembali