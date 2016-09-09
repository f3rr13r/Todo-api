module.exports = function (database) {

	return {

		requireAuthentication: function (request, response, next) {

			var token = request.get('Auth');

			database.user.findByToken(token).then(function (user) {
				request.user = user;
				next();

			}, function (error) {
				response.status(401).send();

			});

		}

	};

};