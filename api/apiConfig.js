//basic api config
//exported to app.js in the express config
const express = require('express');
const router = express.Router();

module.exports = (app) => {
	//api listens @ port 8080
	const port = process.env.PORT || 8080;
	//handle GET requests to root URI
	router.get('/', (req, res) => {
		res.json({ message: "Connected to nMESH-API"});
	});
	//...and only handle them w/api route
	app.use('/api', router);
	//start API router
	app.listen(port);
	console.log("We've started the nMESH-API!");
	console.log("API Listening on port " + port);
	//API routes
	router.route('/contact-submissions')
		.get(function(req, res) {		
	});
}

