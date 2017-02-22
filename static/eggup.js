/** Helper functions */

/**
  Serialize from object to URIEncoded string
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


document.addEventListener('DOMContentLoaded', function() {

  let Eggup = function() {

    /**
      this.token: Unique client identifier (String(32))
      Used to connect the user to an action, such as an placed order

      Example:
      this.token = 'fojdpzu2kodx95lh75zbl0rmef1d81acm'
    */
    this.token = JSON.parse(localStorage.getItem('token')) || (function() {
      let token = '';

      fetch('/token', {
        method: 'post'
      }).then(function(response) {
        return response.json().then(function(json) {
          console.log(json);
          token = json['token'];
          localStorage.setItem('token', JSON.stringify(token));
        });
      });


      return token;
    })();

    /**
      this.cache: Get previous orders to populate input fields (Object)
      We expect an object here, with variant and quantity properties
      The variant defines the boiling time for the eggs, eg. soft- or hard-boiled
      The quantity deines the amount of eggs the user wishes to order

      Example:
      this.cache = {
        variant: 1 || 2,
        quantity: 1 || 2
      }
    */
    this.cache = JSON.parse(localStorage.getItem('cache')) || (function() {
      let cache =  { 'variant': 1, 'quantity': 1 };

      localStorage.setItem('cache', JSON.stringify(cache));

      return cache;
    })();

    /**
      this.module: Current active module (String)
      Used to calculate animation direction when loading modules
    */
    this.module = 'loading';
  }


  Eggup.prototype.initialize = function() {

    fetch('/synchronize', {
      method: 'post'
    }).then(function(response) {
      return response.json().then(function(json) {
        console.log(json);
        if (json['available']) {
          //document.querySelector('#order-quantity__data').value = JSON.parse(localStorage.getItem('cache'))['quantity']
          document.querySelector('#order-variant__data').value = JSON.parse(localStorage.getItem('cache'))['variant']
          eggup.load('order');
        } else {
          /** Show when the eggs were started */
          document.querySelector('.module-closed__timer').innerHTML = json['date'].slice(11,16);
          eggup.load('closed');
        }
      });
    });
  }


  Eggup.prototype.load = function(target_module) {
    const current_module = this.module;

    /** Allowed targets */
    const module_array = [
      'loading',
      'order',
      'observe',
      'operation',
      'closed'
    ];

    const current_module_element = document.querySelector('.module-' + current_module),
      target_module_element = document.querySelector('.module-' + target_module),
      current_module_index = module_array.indexOf(current_module),
      target_module_index = module_array.indexOf(target_module);

    /**
      Deny load if the target is the same as current module,
      if the target module it's not in the module_array
      or if the application is closed
    */
    if (target_module_index == current_module_index
      || target_module_index == -1
      || current_module === 'closed') return false;

    /** Decide animation direction and perform navigation */
    if (current_module_index < target_module_index) {
      current_module_element.classList.add('fade_out_to_left');
      target_module_element.classList.remove('module--hidden');
      target_module_element.classList.add('fade_in_from_right');

      current_module_element.addEventListener('webkitAnimationEnd', function(e) {
        e.target.removeEventListener(e.type, arguments.callee)
        current_module_element.classList.remove('fade_out_to_left');
        current_module_element.classList.add('module--hidden');
        target_module_element.classList.remove('fade_in_from_right');
      });
    } else {
      current_module_element.classList.add('fade_out_to_right');
      target_module_element.classList.remove('module--hidden');
      target_module_element.classList.add('fade_in_from_left');

      current_module_element.addEventListener('webkitAnimationEnd', function(e) {
        e.target.removeEventListener(e.type, arguments.callee)
        current_module_element.classList.remove('fade_out_to_right');
        current_module_element.classList.add('module--hidden');
        target_module_element.classList.remove('fade_in_from_left');
      });
    }

    this.module = target_module;
  }

  document.querySelector('.order-submit').onclick = () => {
    if (!document.querySelector('#order-quantity__data').value.length > 0
      || !document.querySelector('#order-variant__data').value.length > 0) {

      /** Abort any ongoing animation */
      document.querySelector('.module-order').classList.remove('module-order--error');
      void document.querySelector('.module-order').offsetWidth;

      document.querySelector('.order-quantity').classList.add('quantity--error');
      document.querySelector('.order-variant').classList.add('variant--error');
      document.querySelector('.module-order').classList.add('module-order--error');

      document.querySelector('.module-order').addEventListener('webkitAnimationEnd', function(event) {
        event.target.removeEventListener(event.type, arguments.callee);

        document.querySelector('.module-order').classList.remove('module-order--error');
        document.querySelector('.order-quantity').classList.remove('quantity--error');
        document.querySelector('.order-variant').classList.remove('variant--error');
      });

      return false
    }
  }

  let eggup = new Eggup();

  eggup.initialize();
});
