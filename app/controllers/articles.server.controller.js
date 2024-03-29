var mongoose = require('mongoose');
Article = mongoose.model('Article');

var getErrorMessage = function(err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].
            message;
        }
    } else {
        return 'Unknown server error';
    }
};
exports.create = function(req,res){
    console.log('hit create');
	var article = new Article(req.body);
    console.log(req.body);
		article.creator = req.user;

		article.save(function(err){
			if(err){
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			}else{
				res.json(article);
			}
		});
};

exports.list = function(req, res) {
    Article.find().sort('-created').populate('creator', 'firstName lastName fullName ').exec(function(err, articles) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(articles);
        }
    });
};



exports.read = function(req, res) {console.log('read');
    res.json(req.article);
};

exports.update = function(req, res) {
    var article = req.article;
    article.title = req.body.title;

    article.content = req.body.content;
    article.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};

exports.delete = function(req, res) {
    var article = req.article;
    article.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};
exports.articleByID = function(req, res, next, id) {console.log('articleByid');
    Article.findById(id).populate('creator', 'firstName lastName fullName ').exec(function(err, article) {
        if (err) return next(err);
        if (!article) return next(new Error('Failed to load article ' + id)); 
        req.article = article; 
        next();
    });
};
exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({
            message: 'User is not logged in'
        });
    }
    next();
};	

exports.hasAuthorization = function(req, res, next) {
    if (req.article.creator.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};