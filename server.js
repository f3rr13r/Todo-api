var express = require('express');
var _ = require('underscore');
var app = express();
var bodyParser = require('body-parser');
var db = require('./db.js');




var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;


app.use(bodyParser.json());





app.get('/', function(request, response) {

	response.send('Todo API Root');

});











// GET /todos?completed=true&q=house
app.get('/todos', function(request, response) {

	var query = request.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true

	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false

	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'

		}

	}

	db.todo.findAll({where: where}).then(function (todos) {
		response.json(todos);

	}, function (error) {
		response.status(500).send();

	});


});









// GET /todos/:<your todo id here>
app.get('/todos/:id', function(request, response) {

	var todoID = parseInt(request.params.id, 10);
	
	db.todo.findById(todoID).then(function (todo) {

		if (todo) {

			response.json(todo.toJSON());

		} else {

			response.status(404).send("Could not retrieve todo item with that id.");

		}
	}, function (error) {

		response.status(500).send();

	});

});









// POST /todos
app.post('/todos', function(request, response) {

	var body = _.pick(request.body, 'description', 'completed');

	db.todo.create(body).then(function (todo) {

		response.json(todo.toJSON());

	}, function (error) {

		response.status(400).json(error);

	}); 


});











// DELETE /todos/:id

app.delete('/todos/:id', function(request, response) {

	// Register the inputted id.
	var todoID = parseInt(request.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoID
		}
	}).then(function (rowsDeleted) {

		if (rowsDeleted === 0) {

			response.status(400).json({
				error: 'No todo with matched id'
			});

		} else {

			response.status(204).json({
				description: 'Todo item with id of ' + ' successfully deleted.'
			});

		}

	}, function (error) {

		response.status(500).send();

	})


});






// PUT (UPDATE) /todos/:id

app.put('/todos/:id', function(request, response) {

	// Register the inputted id.
	var todoID = parseInt(request.params.id, 10);
	var body = _.pick(request.body, 'description', 'completed');
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;

	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;

	}


	db.todo.findById(todoID).then(function (todo) {

	if (todo) {
			todo.update(attributes)
			.then(function (todo) {
			response.json(todo.toJSON());

	}, function (error) {
		response.status(400).json(error);

	});

		} else {

			response.status(400).send();
		}		

	}, function () {
			response.status(500).send();

	});

});










db.sequelize.sync().then(function () {

	app.listen(PORT, function() {

	console.log('Express listening on port ' + PORT + '.');

	});

});
