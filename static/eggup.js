/** Helper functions */

/**
  onCSSAnimationEnd, trigger callback when CSS animation has ended on a element
  Originally by Osvaldas Valutis, www.osvaldas.info
*/
(function() {
  var scope = document.body || document.documentElement,
    scope = scope.style,
    prefixAnimation = '';

  if(scope.WebkitAnimation == '') prefixAnimation = '-webkit-';
  if(scope.MozAnimation == '') prefixAnimation = '-moz-';
  if(scope.OAnimation == '') prefixAnimation = '-o-';

  Object.prototype.onCSSAnimationEnd = function(callback)
  {
    let runOnce = function(e) { callback(); e.target.removeEventListener(e.type, runOnce); };
    this.addEventListener('webkitAnimationEnd', runOnce);
    this.addEventListener('mozAnimationEnd', runOnce);
    this.addEventListener('oAnimationEnd', runOnce);
    this.addEventListener('oanimationend', runOnce);
    this.addEventListener('animationend', runOnce);
    if ((prefixAnimation == '' && !('animation' in scope)) || getComputedStyle(this)[ prefixAnimation + 'animation-duration' ] == '0s') callback();
    return this;
  };
}());

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
    const block_array = [
      'loading',
      'order',
      'observe',
      'operation',
      'closed'
    ];

    const current_block_element = document.querySelector('.application__block--' + current_block),
      target_block_element = document.querySelector('.application__block--' + target_block),
      current_block_index = block_array.indexOf(current_block),
      target_block_index = block_array.indexOf(target_block);

    /** If target is the same as current block */
    if (target_block_index == current_block_index) return false;

    /** If target is not in block_array */
    if (target_block_index == -1) return false;

    /** Decide animatin direction */
    if (current_block_index < target_block_index) {
      current_block_element.classList.add('fade_out_to_left');
      target_block_element.classList.remove('application__block--hidden');
      target_block_element.classList.add('fade_in_from_right');

      current_block_element.onCSSAnimationEnd( function()
      {
        current_block_element.classList.remove('fade_out_to_left');
        current_block_element.classList.add('application__block--hidden');
        target_block_element.classList.remove('fade_in_from_right');
      });
    } else {
      current_block_element.classList.add('fade_out_to_right');
      target_block_element.classList.remove('application__block--hidden');
      target_block_element.classList.add('fade_in_from_left');

      current_block_element.onCSSAnimationEnd( function()
      {
        current_block_element.classList.remove('fade_out_to_right');
        current_block_element.classList.add('application__block--hidden');
        target_block_element.classList.remove('fade_in_from_left');
      });
    }

    this.block = target_block;
  }

  let eggup = new Eggup();

  eggup.initialize();
});
