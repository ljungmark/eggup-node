document.addEventListener("DOMContentLoaded", function() {
  let Eggup = function() {

    /**
      this.identifier: Unique client identifier (String(32))
      Used to connect the user to an action, such as an placed order

      Example:
      this.identifier = 'fojdpzu2kodx95lh75zbl0rmef1d81acm'
    */
    this.identifier = JSON.parse(localStorage.getItem('identifier')) || (function() {
      let identifier = '';
      for (let i = 3; i > 0; --i) identifier += Math.random().toString(36).slice(2);

      localStorage.setItem('identifier', JSON.stringify(identifier));

      return identifier;
    })();

    /**
      this.cache: Get previous orders to populate input fields (Object)
      We expect an object here, with class and quantity properties
      The class defines the boiling time for the eggs, eg. soft- or hard-boiled
      The quantity deines the amount of eggs the user wishes to order

      Example:
      this.cache = {
        class: 1 || 2,
        quantity: 1 || 2
      }
    */
    this.cache = JSON.parse(localStorage.getItem('cache')) || (function() {
      let cache =  { 'class': 1, 'quantity': 1 };

      localStorage.setItem('cache', JSON.stringify(cache));

      return cache;
    })();
  }

  Eggup.prototype.initialize = function() {

    fetch('/synchronize', {
      method: 'post'
    }).then(function(response) {
      return response.json().then(function(json) {
        console.log(json);
        if (json['available']) {
          console.log('available')
        } else {
          console.log(json['date']);
        }
        });
    });
  }

  let eggup = new Eggup().initialize();
});
