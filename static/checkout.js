var socket = io();

socket.on('heap', function(heap) {
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
                        var checkbox = document.createElement('input');
                        checkbox.setAttribute('type', 'checkbox');
                        checkbox.dataset.token = order.token;
                        item.appendChild(checkbox);
                        item.insertAdjacentHTML('beforeend', order.token);

                        document.querySelector('.list').appendChild(item);
                    });
                }
        });
    });
});
