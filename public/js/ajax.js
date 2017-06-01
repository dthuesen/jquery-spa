'use strict';

// let getUrl = '/todos';
// $.get(getUrl, (data) => {
//   console.log("data: ", data);
// })


/** ADDING A NEW ITEM */

$('#new-todo-form').submit(function (e) {
  // Arrow function does not work because of the this keyword
  e.preventDefault();
  var newTodoItem = $(this).serialize(); // transforms the object into a string with all the data from the form
  $.post('/todos', newTodoItem, function (data) {
    // instead of 'data' as keyword 'response' is also often used
    console.log("New item successfully submitted to the DB: ", data);

    $('#todo-list').append('\n      <li class="list-group-item">\n        \n        <form action="/todos/' + data._id + '" method="POST" class="edit-item-form">\n          <div class="form-group">\n            <label for="' + data._id + '">Item Text</label>\n            <input type="text" value="' + data.text + '" name="todo[text]" class="form-control" id="' + data._id + '">\n          </div>\n          <button class="btn btn-primary">Update Item</button>\n        </form>\n        \n        <span class="lead">\n          ' + data.text + '\n        </span>\n        <div class="pull-right">\n          <button class="btn btn-sm btn-warning edit-button">Edit</button>\n          <form style="display: inline" method="POST" action="/todos/' + data._id + '" class="delete-item-form">\n            <button type="submit" class="btn btn-sm btn-danger">Delete</button>\n          </form>\n        </div>\n        <div class="clearfix"></div>\n      </li>\n      ');
    $('#new-todo-form').find('#new-item-input').val('');
  });
});

/** TOGGLE EDIT FORM FOR ITEMS */

$('#todo-list').on('click', '.edit-button', function (e) {
  e.preventDefault();
  $(this).parent().siblings('.edit-item-form').toggle();
});

/** EDITING AN ITEM */

$('#todo-list').on('submit', '.edit-item-form', function (e) {
  // Arrow function does not work because of the this keyword
  e.preventDefault();
  var formData = $(this).serialize(); // transforms the object into a string with all the data from the form
  var actionUrl = $(this).attr('action' // getting the id of the actual item, e.g. /todos/592d9e63e1f8601e87c83684
  );var $originalItem = $(this).parent('.list-group-item');
  $.ajax({
    url: actionUrl,
    data: formData,
    type: 'PUT',
    originalItem: $originalItem,
    success: function success(data) {
      console.log("You have written data to the DB: ", data);
      this.originalItem.html('\n          <form action="/todos/' + data._id + '" method="POST" class="edit-item-form">\n\t\t\t\t\t\t<div class="form-group">\n\t\t\t\t\t\t\t<label for="' + data._id + '">Item Text</label>\n\t\t\t\t\t\t\t<input type="text" value="' + data.text + '" name="todo[text]" class="form-control" id="' + data._id + '">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<button class="btn btn-primary">Update Item</button>\n\t\t\t\t\t</form>\n\t\t\t\t\t\n\t\t\t\t\t<span class="lead">\n\t\t\t\t\t\t' + data.text + '\n\t\t\t\t\t</span>\n\t\t\t\t\t<div class="pull-right">\n\t\t\t\t\t\t<button class="btn btn-sm btn-warning edit-button">Edit</button>\n\t\t\t\t\t\t<form id="delete-item" style="display: inline" method="POST" action="/todos/' + data._id + '" class="delete-item-form">\n\t\t\t\t\t\t\t<button type="submit" class="btn btn-sm btn-danger">Delete</button>\n\t\t\t\t\t\t</form>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="clearfix"></div>\n          ');
    }
  });
});

/** DELETING AN ITEM */

$('#todo-list').on('submit', '.delete-item-form', function (e) {
  // Arrow function does not work because of the this keyword
  e.preventDefault();
  var confirmResponse = confirm("Are you sure?");

  if (confirmResponse) {
    var actionURL = $(this).attr('action'); // getting the id of the actual item, e.g. /todos/592d9e63e1f8601e87c83684
    var $itemToDelete = $(this).closest('.list-group-item');

    $.ajax({
      url: actionURL,
      type: 'DELETE',
      itemToDelete: $itemToDelete,
      success: function success(data) {
        console.log("You have deleted data from the DB: ", data);
        console.log('this: ', this);
        this.itemToDelete.remove();
      }
    });
  } else {
    $(this).find('button').blur();
  }
});