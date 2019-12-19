var socket = io();

let ui_refresher;
const templates = {
  'default': '<h1>Order eggs</h1><p>Hold your tag in front of the reader</p>',
  'inserted': '<h1>Order confirmed</h1><p>Thank you and have a great day!</p>',
  'updated': '<h1>Order already placed</h1><p>If you wanted to cancel your order, you can do so in the app.</p>',
  'tag_not_found': '<h1>Oh noes!</h1><p>Your tag hasn\'t been registered. Please use the app!</p><p>Ref: ' + tag_id + '</p>',
  'have_a_great_day': '<h1>You\'re great!</h1>',
  'closed_terminal': '<h1>Terminal is closed</h1><p>Welcome back next work day</p>',
  'too_large_quantity': '<h1>Invalid params</h1><p>Please provide valid input</p>',
}

function switchmessages(input, revert, replacements) {
  document.querySelector('.queue').innerHTML = templates[input].replace(/{{(.*?)}}/g, replacements[0]);

  const direction = (input === 'default') ? 'downwards' : 'upwards';

  document.querySelector('body').classList.add(direction);
  setTimeout(function(){
    document.querySelector('.view').innerHTML = document.querySelector('.queue').innerHTML;
    document.querySelector('.queue').innerHTML = '';
    document.querySelector('body').classList.remove(direction);
  }, 300);

  if (revert) {
    ui_refresher = setTimeout(function(){
      switchmessages();
    }, 3000);
  }

  return false;
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.tag').focus();

  document.addEventListener('keydown', function(event) {
    document.querySelector('.tag').focus();
  })

  document.querySelector('.form').addEventListener('submit', function(event) {
    event.preventDefault();

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function(request) {
      clearTimeout(ui_refresher);
      document.querySelector('.tag').value = '';

      socket.emit('heap');

      const response = JSON.parse(request.target.response);
      switchmessages(response.data, true, [response.tag_id]);
    });

    xhr.open('POST', '/request');

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    const data = 'tag=' + document.querySelector('.tag').value;

    xhr.send(data);
  });

  document.querySelector('.tag').focus();
});

socket.on('gateway', function(open) {
  if (open == false) {
    switchmessages('have_a_great_day', false, []);
  } else {
    switchmessages('default', false, []);
  }
});
