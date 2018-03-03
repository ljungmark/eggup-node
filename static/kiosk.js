const templates = {
  'default': `<h1>Order eggs</h1>
    <p>Hold your tag in front of the reader</p>`,
  'thank_you': `<h1>Order received</h1>
    <p>Thank you! You can cancel your order in the app.</p>`,
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.tag').focus();

  document.addEventListener('keydown', (event) => {
    document.querySelector('.tag').focus();
  })

  document.querySelector('.form').addEventListener('submit', (event) => {
    event.preventDefault();

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', _ => {
      document.querySelector('.tag').value = '';
      document.querySelector('.ui').innerHTML = templates.thank_you;

      setTimeout(function(){
        document.querySelector('.ui').innerHTML = templates.default;
      }, 3000);
    });
    xhr.open('POST', '/request');

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    const data = `tag=${document.querySelector('.tag').value}`;

    xhr.send(data);
  });

  document.querySelector('.tag').focus();
});
