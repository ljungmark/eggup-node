var socket = io();

let ui_refresher;
const templates = {
  'default': `<h1>Order eggs</h1>
    <p>Hold your tag in front of the reader</p>`,
  'inserted': `<h1>Order received</h1>
    <p>Thank you! You can cancel your order in the app.</p>`,
  'updated': `<h1>Order updated</h1>
    <p>Thank you! You can cancel your order in the app.</p>`,
  'tag_not_found': `<h1>Oh noes!</h1>
    <p>Your tag hasn't been registered.</p>`,
  'have_a_great_day': `<h1>Have a great day!</h1>`,
  'terminal_closed': `<h1>Terminal is closed</h1>
    <p>Welcome back next work day</p>`,
}

function switchmessages(input = 'default', revert = false) {
  document.querySelector('.queue').innerHTML = templates[input];

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

  document.addEventListener('keydown', (event) => {
    document.querySelector('.tag').focus();
  })

  document.querySelector('.form').addEventListener('submit', (event) => {
    event.preventDefault();

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (request) => {
      clearTimeout(ui_refresher);
      document.querySelector('.tag').value = '';

      const response = JSON.parse(request.target.response);
      switchmessages(response.data, response.status);
    });

    xhr.open('POST', '/request');

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    const data = `tag=${document.querySelector('.tag').value}`;

    xhr.send(data);
  });

  document.querySelector('.tag').focus();
});

socket.on('gateway', function(open) {
  if (open == false) {
    document.querySelector('.ui').innerHTML = templates.have_a_great_day;
  }
});
