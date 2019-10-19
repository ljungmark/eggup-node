var socket = io();

/**
  Serialize from object to URIEncoded string

  Used for fetcH) to convert the data objects to something the receving node can interpret

  Example:
  { property1: 'value1',
    property2: 'value2' }

  becomes

  property1=value1&property2=value2
*/
function serialize(object) {
  let str = [];

  for (let property in object) {
    if (object.hasOwnProperty(property)) {
      str.push(encodeURIComponent(property) + "=" + encodeURIComponent(object[property]));
    }
  }

  return str.join("&");
}

function updateList() {
    fetch('/orders', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: 'include'
    }).then(function(response) {
            return response.json().then(function(json) {
                if (!Array.isArray(json.orders) || !json.orders.length) {
                    document.querySelector('.list').innerHTML = 'No orders yet';
                } else {
                    document.querySelector('.list').innerHTML = '';

                    json.orders.forEach(order => {
                        const item = document.createElement('div');
                        item.classList.add('order');
                        item.dataset.token = order.token;
                        item.dataset.collected = order.checkout;
                        const span = document.createElement('span');
                        span.classList.add('collected')
                        item.appendChild(span);
                        item.insertAdjacentHTML('beforeend', order.name ? order.name : order.email);

                        document.querySelector('.list').appendChild(item);
                    });
            }
        });
    });
}

document.querySelector('.list').addEventListener('click', event => {
    if (event.target.classList.contains('order')) {
        const target = event.target;
        if (target.dataset.collected == 1) {
            target.dataset.collected = 0;
        } else {
            target.dataset.collected = 1;
        }

        update(target.dataset.token, target.dataset.collected);
     }
});

function update(token, collected) {
    fetch('/checkout', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: serialize({ 'collected': collected, 'token': token }),
        credentials: 'include'
    }).then(function(response) {
            return response.json().then(function(json) {
                //
            });
    });
}

updateList();

socket.on('heap', function(heap) {
    updateList();
});
