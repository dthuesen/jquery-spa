// let getUrl = '/todos';
// $.get(getUrl, (data) => {
//   console.log("data: ", data);
// })

$('#new-todo-form').submit( function (e) {    // Arrow function does not work because of the this keyword
  e.preventDefault();
  let newTodoItem = $(this).serialize(); // transforms the object into a string with all the data from the form
  $.post('/todos', newTodoItem, (data) => { // instead of 'data' as keyword 'response' is also often used
    console.log("New item successfully submitted to the DB: ", data);
    
    $('#todo-list').append(
      `
      <li class="list-group-item">
        <span class="lead">
          ${data.text}
        </span>
        <div class="pull-right">
          <a href="/todos/${data._id}/edit" class="btn btn-sm btn-warning">Edit</a>
          <form style="display: inline" method="POST" action="/todos/${data._id}">
            <button type="submit" class="btn btn-sm btn-danger">Delete</button>
          </form>
        </div>
        <div class="clearfix"></div>
      </li>
      `
    )
    $('#new-todo-form').find('#new-item-input').val('');
  });
});



$('form.delete-item').submit( function (e) {    // Arrow function does not work because of the this keyword
  e.preventDefault();
  let formAction = $(this).attr('action') // getting the id of the actual item, e.g. /todos/592d9e63e1f8601e87c83684
  $.ajax({
    url: formAction,
    type: 'DELETE',
    success: function(data) {
      console.log("You have deleted data from the DB: ", data);
    } 
  });
});

$('#todo-list').on('click', '.edit-button', function(e) {
  e.preventDefault()
  $(this).parent().siblings('.edit-item-form').toggle();
});

$('#todo-list').on('submit', '.edit-item-form', function (e) {    // Arrow function does not work because of the this keyword
    e.preventDefault();
    let formData = $(this).serialize();                           // transforms the object into a string with all the data from the form
    let actionUrl = $(this).attr('action')                        // getting the id of the actual item, e.g. /todos/592d9e63e1f8601e87c83684
    let $originalItem = $(this).parent('.list-group-item');
    $.ajax({
      url: actionUrl,
      data: formData,
      type: 'PUT',
      originalItem: $originalItem,
      success: function(data) {
        console.log("You have written data to the DB: ", data);
        this.originalItem.html(
          `
          <form action="/todos/${data._id}" method="POST" class="edit-item-form">
						<div class="form-group">
							<label>Item Text</label>
							<input type="text" value="${data.text}" name="todo[text]" class="form-control">
						</div>
						<button class="btn btn-primary">Update Item</button>
					</form>
					
					<span class="lead">
						${data.text}
					</span>
					<div class="pull-right">
						<button class="btn btn-sm btn-warning edit-button">Edit</button>
						<form id="delete-item" style="display: inline" method="POST" action="/todos/${data._id}">
							<button type="submit" class="btn btn-sm btn-danger">Delete</button>
						</form>
					</div>
					<div class="clearfix"></div>
          `
        )
      } 
    });
  });

