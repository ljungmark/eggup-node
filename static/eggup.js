document.addEventListener('DOMContentLoaded', function() {

  /** Helper functions */
  function serialize(object) {
    let str = [];

    for (let property in object) {
      if (object.hasOwnProperty(property)) {
        str.push(encodeURIComponent(property) + "=" + encodeURIComponent(object[property]));
      }
    }

    return str.join("&");
  }


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

    /**
      this.block: Current active block (String)
      Used to calculate animation direction when loading blocks
    */
    this.block = 'loading';
  }


  Eggup.prototype.initialize = function() {

    fetch('/synchronize', {
      method: 'post'
    }).then(function(response) {
      return response.json().then(function(json) {
        console.log(json);
        if (json['available']) {
          console.log('available');
        } else {
          console.log(json['date']);
        }
      });
    });
  }


  Eggup.prototype.load = function(target_block) {
    let current_block = this.block;

    /** Allowed targets */
    let block_array = [
      'loading',
      'order',
      'observe',
      'operation',
      'closed'
    ];

    current_block_index = block_array.indexOf(current_block);
    target_block_index = block_array.indexOf(target_block);

    /** If target is the same as current block */
    if (target_block_index == current_block_index) return false;

    /** If target is not in block_array */
    if (target_block_index == -1) return false;

    /** Decide animatin direction */
    if (current_block_index < target_block_index) {
      document.querySelector('.application__block--' + current_block).classList.add('application__block--hidden');
      document.querySelector('.application__block--' + target_block).classList.remove('application__block--hidden');
      console.log('moving forward');
    } else {
      document.querySelector('.application__block--' + current_block).classList.add('application__block--hidden');
      document.querySelector('.application__block--' + target_block).classList.remove('application__block--hidden');
      console.log('moving backwards');
    }

    this.block = target_block;
  }

  let eggup = new Eggup();

  eggup.initialize();
});
