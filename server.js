var express = require('express');
var bodyParser = require('body-parser');
var app = express();
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
	var matchedItem;

	// Iterate through each of the todo object models.
	todos.forEach(function (todo) {

		if (todo.id == todoID) {

			matchedItem = todo;

		}

	});

	if (matchedItem) {

		response.json(matchedItem);

	} else {

		response.status(404).send();

	}

});




// POST /todos
app.post('/todos', function (request, response) {

	var body = request.body;

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








