/** Helper functions */

/**
  onCSSAnimationEnd, trigger callback when CSS animation has ended on a element
  onCSSTransitionEnd, trigger callback when CSS transition has ended on a element
*/
;( function ( document, window, index ) {
  var s = document.body || document.documentElement, s = s.style, prefixAnimation = '', prefixTransition = '';

  if( s.WebkitAnimation == '' ) prefixAnimation  = '-webkit-';
  if( s.MozAnimation == '' )    prefixAnimation  = '-moz-';
  if( s.OAnimation == '' )    prefixAnimation  = '-o-';

  if( s.WebkitTransition == '' )  prefixTransition = '-webkit-';
  if( s.MozTransition == '' )   prefixTransition = '-moz-';
  if( s.OTransition == '' )   prefixTransition = '-o-';

  Object.prototype.onCSSAnimationEnd = function( callback )
  {
    var runOnce = function( e ){ callback(); e.target.removeEventListener( e.type, runOnce ); };
    this.addEventListener( 'webkitAnimationEnd', runOnce );
    this.addEventListener( 'mozAnimationEnd', runOnce );
    this.addEventListener( 'oAnimationEnd', runOnce );
    this.addEventListener( 'oanimationend', runOnce );
    this.addEventListener( 'animationend', runOnce );
    if( ( prefixAnimation == '' && !( 'animation' in s ) ) || getComputedStyle( this )[ prefixAnimation + 'animation-duration' ] == '0s' ) callback();
    return this;
  };

  Object.prototype.onCSSTransitionEnd = function( callback )
  {
    var runOnce = function( e ){ callback(); e.target.removeEventListener( e.type, runOnce ); };
    this.addEventListener( 'webkitTransitionEnd', runOnce );
    this.addEventListener( 'mozTransitionEnd', runOnce );
    this.addEventListener( 'oTransitionEnd', runOnce );
    this.addEventListener( 'transitionend', runOnce );
    this.addEventListener( 'transitionend', runOnce );
    if( ( prefixTransition == '' && !( 'transition' in s ) ) || getComputedStyle( this )[ prefixTransition + 'transition-duration' ] == '0s' ) callback();
    return this;
  };
}(document, window, 0));

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
    function whichTransitionEvent(){
      var t;
      var el = document.createElement('fakeelement');
      var transitions = {
        'transition':'transitionend',
        'OTransition':'oTransitionEnd',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd'
      }

      for(t in transitions){
        if( el.style[t] !== undefined ){
          return transitions[t];
        }
      }
    }
    var transitionEvent = whichTransitionEvent();

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
        console.log('hejsan');
      });

      console.log('moving forward');
    } else {

      current_block_element.classList.add('fade_out_to_right');
      target_block_element.classList.remove('application__block--hidden');
      target_block_element.classList.add('fade_in_from_left');

      current_block_element.onCSSAnimationEnd( function()
      {
        current_block_element.classList.remove('fade_out_to_right');
        current_block_element.classList.add('application__block--hidden');
        target_block_element.classList.remove('fade_in_from_left');
        console.log('hejsan2');
      });


      console.log('moving backwards');
    }

    this.block = target_block;
  }

  let eggup = new Eggup();

  eggup.initialize();
});
