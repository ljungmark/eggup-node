var socket = io();

function updateList() {
    fetch('/orders', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: 'include'
      }).then(function(response) {
            return response.json().then(function(json) {
                console.log(json);
                if (!Array.isArray(json.orders) || !json.orders.length) {
                    //document.querySelector('.list').innerHTML = 'No orders yet';
                } else {
                    //document.querySelector('.list').innerHTML = '';

                    json.orders.forEach(order => {
                        const item = document.createElement('div');
                        item.classList.add('order');
                        const checkbox = document.createElement('input');
                        checkbox.setAttribute('type', 'checkbox');
                        checkbox.setAttribute('onclick', `update(${order.token})`);
                        checkbox.id = order.token;
                        checkbox.dataset.token = order.token;
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
    console.log(token.dataset.token);
}

socket.on('heap', function(heap) {
    updateList();
});
