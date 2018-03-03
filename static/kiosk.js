var socket = io();

let ui_refresher;
const templates = {
  'default': `<h1>Order eggs</h1>
    <p>Hold your tag in front of the reader</p>`,
  'thank_you': `<h1>Order received</h1>
    <p>Thank you! You can cancel your order in the app.</p>`,
  'tag_not_found': `<h1>Oh noes!</h1>
    <p>Your tag hasn't been registered. Please contact Mattias.</p>`,
  'have_a_great_day': `<h1>Have a great day!</h1>`,
  'terminal_closed': `<h1>Terminal is closed</h1>
    <p>Welcome back next work day</p>`,
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
      if (response.status === true) {
        document.querySelector('.ui').innerHTML = templates.thank_you;

        ui_refresher = setTimeout(function(){
          document.querySelector('.ui').innerHTML = templates.default;
        }, 3000);
      } else {
        if (response.data === 'tag_not_found') {
          document.querySelector('.ui').innerHTML = templates.tag_not_found;

          ui_refresher = setTimeout(function(){
            document.querySelector('.ui').innerHTML = templates.default;
          }, 3000);
        } else if (response.data === 'terminal_closed') {
          document.querySelector('.ui').innerHTML = templates.terminal_closed;

          ui_refresher = setTimeout(function(){
            document.querySelector('.ui').innerHTML = templates.default;
          }, 3000);
        }
      }
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
