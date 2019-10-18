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
        });
    });
});
