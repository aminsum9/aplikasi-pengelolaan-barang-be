const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticated = (req, res, next) => {
	let authHeader = req.headers['authorization'];

	if (!authHeader) {
		// console.log('need header');
		res.status(403).send({ message: 'Need header.' });
		return;
	}
	let token = authHeader.split('Bearer ')[1];

	jwt.verify(token, process.env.BEARER_TOKER, (err, decoded) => {
		if (err) {
			return res.status(403).send({ message: 'Your Token is Longer Valid' });
		}

		userId = decoded.id;
		next();
	});
};