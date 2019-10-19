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
                    //document.querySelector('.list').innerHTML = '';

                    json.orders.forEach(order => {
                        console.log(order.checkout == 1)
                        const item = document.createElement('div');
                        item.classList.add('order');
                        const checkbox = document.createElement('input');
                        checkbox.setAttribute('type', 'checkbox');
                        checkbox.setAttribute('onclick', `update(${order.token})`);
                        checkbox.id = order.token;
                        checkbox.dataset.token = order.token;
                        if (order.checkout == 1) checkbox.setAttribute('checked', 'checked');
                        const label = document.createElement('label');
                        label.setAttribute('for', order.token);
                        label.innerHTML = order.name;
                        item.appendChild(checkbox);
                        item.appendChild(label);

                        document.querySelector('.list').appendChild(item);
                    });
                }
        });
    });
}

function update(token) {
    fetch('/checkout', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: serialize({ 'collected': token.checked ? 1 : 0, 'token': token.dataset.token }),
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
