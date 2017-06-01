// let getUrl = '/todos';
// $.get(getUrl, (data) => {
//   console.log("data: ", data);
// })



/** ADDING A NEW ITEM */

$('#new-todo-form').submit( function (e) {    // Arrow function does not work because of the this keyword
  e.preventDefault();
  let newTodoItem = $(this).serialize(); // transforms the object into a string with all the data from the form
  $.post('/todos', newTodoItem, (data) => { // instead of 'data' as keyword 'response' is also often used
    console.log("New item successfully submitted to the DB: ", data);
    
    $('#todo-list').append(
      `
      <li class="list-group-item">
        
        <form action="/todos/${data._id}" method="POST" class="edit-item-form">
          <div class="form-group">
            <label for="${data._id}">Item Text</label>
            <input type="text" value="${data.text}" name="todo[text]" class="form-control" id="${data._id}">
          </div>
          <button class="btn btn-primary">Update Item</button>
        </form>
        
        <span class="lead">
          ${data.text}
        </span>
        <div class="pull-right">
          <button class="btn btn-sm btn-warning edit-button">Edit</button>
          <form style="display: inline" method="POST" action="/todos/${data._id}" class="delete-item-form">
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




/** TOGGLE EDIT FORM FOR ITEMS */

$('#todo-list').on('click', '.edit-button', function(e) {
  e.preventDefault()
  $(this).parent().siblings('.edit-item-form').toggle();
});




/** EDITING AN ITEM */

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
            <label for="${data._id}">Item Text</label>
            <input type="text" value="${data.text}" name="todo[text]" class="form-control" id="${data._id}">
          </div>
          <button class="btn btn-primary">Update Item</button>
        </form>
        
        <span class="lead">
          ${data.text}
        </span>
        <div class="pull-right">
          <button class="btn btn-sm btn-warning edit-button">Edit</button>
          <form id="delete-item" style="display: inline" method="POST" action="/todos/${data._id}" class="delete-item-form">
            <button type="submit" class="btn btn-sm btn-danger">Delete</button>
          </form>
        </div>
        <div class="clearfix"></div>
        `
      )
    } 
  });
});




/** DELETING AN ITEM */

$('#todo-list').on('submit', '.delete-item-form', function (e) {    // Arrow function does not work because of the this keyword
  e.preventDefault();
  let confirmResponse = confirm("Are you sure?");
  
  if(confirmResponse) {
    let actionURL = $(this).attr('action'); // getting the id of the actual item, e.g. /todos/592d9e63e1f8601e87c83684
    let $itemToDelete = $(this).closest('.list-group-item');
    
    $.ajax({
      url: actionURL,
      type: 'DELETE',
      itemToDelete: $itemToDelete,
      success: function(data) {
        console.log("You have deleted data from the DB: ", data);
        console.log('this: ', this)
        this.itemToDelete.remove();
      } 
    });
  } else {
    $(this).find('button').blur();
  }
});



/** SEARCHING FOR ITEMS IN LIST */

$('#search').on('input', (e) => {
  e.preventDefault();
  $.get(`/todos?keyword=${e.target.value}`, (data) => {
    $('#todo-list').html('');
    data.forEach( (todo) => {
      $('#todo-list').append(
        `
        <li class="list-group-item">
          <form action="/todos/${todo._id}" method="POST" class="edit-item-form">
            <div class="form-group">
              <label for="${todo._id}">Item Text</label>
              <input type="text" value="${todo.text} name="todo[text] class="form-control" id="todo._id" >
            </div>
            <button class="btn btn-primary">Update Item</button>
          </form>
          <span class="lead">
            ${todo.text}
          </span>
          <div class="pull-right">
            <button class="btn btn-sm btn-warning edit-button">Edit</button>
            <form style="display: inline" method="POST" action="/todos/${todo._id}" class="delete-item-form">
              <button type="submit" class="btn btn-sm btn-danger">Delete</button>
            </form>
          </div>
          <div class="clear-fix"></div>
        </li>
        `
        )
    })
  })
})



