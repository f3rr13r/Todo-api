var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: 'Do Laundry',
	completed: false
	},
	{
	id: 2,
	description: 'Email Kevin Seal',
	completed: false
	},
	{
	id: 3,
	description: 'Cook Dinner',
	completed: false
	}
	];




app.get('/', function (request, response) {

	response.send('Todo API Root');

});




// GET /todos
app.get('/todos', function (request, response) {

	response.json(todos);

});




// GET /todos/:<your todo id here>
app.get('/todos/:id', function (request, response) {

	var todoID = request.params.id;
	var matchedItem;

	// Iterate through each of the todo object models.
	todos.forEach(function (todo) {

		if (todo.id == todoID) {

			matchedItem = todo;

		}

	});

	if (typeof matchedItem === 'undefined') {

		response.status(404).send();

	} else {

		response.json(matchedItem);

	}

});




app.listen(PORT, function () {

	console.log('Express listening on port ' + PORT + '.');

});








