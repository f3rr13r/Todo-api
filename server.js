var express = require('express');
var _ = require('underscore');
var app = express();
var bodyParser = require('body-parser');




var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;




app.use(bodyParser.json());





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
	var matchedTodo = _.findWhere(todos, {id: parseInt(todoID)});


	if (matchedTodo) {

		response.json(matchedTodo);

	} else {

		response.status(404).send();

	}

});




// POST /todos
app.post('/todos', function (request, response) {

	var body = _.pick(request.body, 'description', 'completed');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {

		return response.status(400).send();

	}

	// Set body.description to be trimmed value.
	body.description = body.description.trim();

	// Add id and set it to todoId.
	body.id = todoNextId;

	// Add 1 to todo id.
	todoNextId += 1;

	//Add body to todos array.
	todos.push(body);


	response.json(body);

});






app.listen(PORT, function () {

	console.log('Express listening on port ' + PORT + '.');

});








