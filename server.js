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

	var queryParams = request.query;
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {
			completed: true
		});

	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {
			completed: false
		});

	}


	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function(todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;

		});
	}


	response.json(filteredTodos);

});




// GET /todos/:<your todo id here>
app.get('/todos/:id', function(request, response) {

	var todoID = request.params.id;
	var matchedTodo = _.findWhere(todos, {
		id: parseInt(todoID)
	});


	if (matchedTodo) {

		response.json(matchedTodo);

	} else {

		response.status(404).send();

	}

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

	// Search through todos array for the matching item.
	var matchedTodo = _.findWhere(todos, {
		id: todoID
	});


	if (matchedTodo) {

		// Update the todos array with the matchedTodo removed.
		todos = _.without(todos, matchedTodo);

		response.status(200).send(matchedTodo);


	} else {

		response.status(404).json({

			"error": "no todo item found matching that id"

		});

	}


});






// PUT (UPDATE) /todos/:id

app.put('/todos/:id', function(request, response) {

	// Register the inputted id.
	var todoID = parseInt(request.params.id, 10);

	// Search through todos array for the matching item.
	var matchedTodo = _.findWhere(todos, {
		id: todoID
	});

	var body = _.pick(request.body, 'description', 'completed');

	var validAttributes = {};


	if (!matchedTodo) {

		return response.status(404).send();

	}



	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {

		validAttributes.completed = body.completed;

	} else if (body.hasOwnProperty('completed')) {

		return response.status(400).send();

	} else {

		// Never provided attribute, no problem here.

	}



	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {

		validAttributes.description = body.description;

	} else if (body.hasOwnProperty('description')) {

		return response.status(400).send();

	}



	_.extend(matchedTodo, validAttributes);

	response.json(matchedTodo);


});


db.sequelize.sync().then(function () {

	app.listen(PORT, function() {

	console.log('Express listening on port ' + PORT + '.');

	});

});
