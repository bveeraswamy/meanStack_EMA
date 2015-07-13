module.exports = function (app){
	var EMAindex = require('../controllers/EMA.server.controller');
	app.get ('/',EMAindex.render);
}

