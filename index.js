const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
require('express-group-routes');
const { authenticated } = require('./authMiddleware');


//import controllers
const controllerUser = require("./controllers/users");
const controllerCategory = require("./controllers/categories");
const controllerSubCategory = require("./controllers/sub-categories");
const controllerWarehouse = require("./controllers/warehouses");
const controllerProduct = require("./controllers/products");

const app = express();

app.use(cors())

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
routerUser.delete('/delete/:id', authenticated, controllerUser.deleteUser);

const routerCategory = express.Router();

routerCategory.post('/add',authenticated, controllerCategory.addCategory);
routerCategory.get('/get-all', authenticated, controllerCategory.getAllCategory);
routerCategory.put('/update', authenticated, controllerCategory.updateCategory);
routerCategory.delete('/delete/:id', authenticated, controllerCategory.deleteCategory);

const routerSubCategory = express.Router();

routerSubCategory.post('/add',authenticated, controllerSubCategory.addSubCategory);
routerSubCategory.get('/get-all', authenticated, controllerSubCategory.getAllSubCategory);
routerSubCategory.put('/update', authenticated, controllerSubCategory.updateSubCategory);
routerSubCategory.delete('/delete', authenticated, controllerSubCategory.deleteSubCategory);

const routerWarehouse = express.Router();

routerWarehouse.post('/add',authenticated, controllerWarehouse.addWarehouse);
routerWarehouse.get('/get-all', authenticated, controllerWarehouse.getAllWarehouse);
routerWarehouse.put('/update', authenticated, controllerWarehouse.updateWarehouse);
routerWarehouse.delete('/delete', authenticated, controllerWarehouse.deleteWarehouse);

const routerProduct = express.Router();

routerProduct.get('/get-all', authenticated, controllerProduct.getAllProducts);


//REST API
app.use('/api/user', routerUser);
app.use('/api/category', routerCategory);
app.use('/api/sub-category', routerSubCategory);
app.use('/api/warehouse', routerWarehouse);
app.use('/api/product', routerProduct);

if (require.main === module) {
	app.listen(process.env.PORT || 5000, () => {
		console.log(`listen on port ${port}!`)
	});
}

module.exports = app;


//server harus update db:migrate setelah aplikasi diupdate kembali