"use strict";

var socket = io();
var ui_refresher;
var templates = {
  'default': "<h1>Order eggs</h1><p>Hold your tag in front of the reader</p>",
  inserted: "<h1>Order confirmed</h1><p>Thank you and have a great day!</p>",
  updated: "<h1>Order already placed</h1><p>If you want to cancel your order, you can do so in the app.</p>",
  tag_not_found: "<h1>Oh noes!</h1><p>Your tag hasn't been registered.</p><p>Please use the app!</p><p>Ref: {{tag_id}}</p>",
  have_a_great_day: "<h1>Hello!</h1><p>Have a beautiful day!</p>",
  closed_terminal: "<h1>Terminal is closed</h1><p>Welcome back next work day</p>",
  too_large_quantity: "<h1>Invalid params</h1><p>Please provide valid input</p>"
};

function switchmessages() {
  var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
  var revert = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var replacements = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  document.querySelector('.queue').innerHTML = templates[input].replace(/{{(.*?)}}/g, replacements[0]);
  var direction = input === 'default' ? 'downwards' : 'upwards';
  document.querySelector('body').classList.add(direction);
  setTimeout(function () {
    document.querySelector('.view').innerHTML = document.querySelector('.queue').innerHTML;
    document.querySelector('.queue').innerHTML = '';
    document.querySelector('body').classList.remove(direction);
  }, 300);

  var delay = (input == 'tag_not_found') ? 10000 : 4500;
  if (revert) {
    ui_refresher = setTimeout(function () {
      switchmessages();
    }, delay);
  }

  return false;
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('.tag').focus();
  document.addEventListener('keydown', function (event) {
    document.querySelector('.tag').focus();
  });
  document.querySelector('.form').addEventListener('submit', function (event) {
    event.preventDefault();
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function (request) {
      clearTimeout(ui_refresher);
      document.querySelector('.tag').value = '';
      socket.emit('heap');
      var response = JSON.parse(request.target.response);
      switchmessages(response.data, true, [response.tag]);
    });
    xhr.open('POST', '/request');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var data = "tag=".concat(document.querySelector('.tag').value);
    xhr.send(data);
  });
  document.querySelector('.tag').focus();
});
socket.on('gateway', function (open) {
  if (open == false) {
    switchmessages('have_a_great_day');
  } else {
    switchmessages();
  }
});
