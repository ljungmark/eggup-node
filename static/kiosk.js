
document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('keydown', (event) => {
    document.querySelector('.tag').focus();
  })

  document.querySelector('.form').addEventListener('submit', (event) => {
    event.preventDefault();

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', _ => document.querySelector('.tag').value = '');
    xhr.open('POST', '/request');

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    const data = `tag=${document.querySelector('.tag').value}`;

    xhr.send(data);
  })
});
