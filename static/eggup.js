/**
  EGGUP

  1. Helper Functions
    - serialize()
    - Object.watch()

  2. The Constructor

  3. Prototypes
    - syncronize
    - load
    - error
    - map

  4. DOMContentLoaded
    - event listeners
*/


/**
  HELPER FUNCTIONS
*/

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

/**
  Object.watch polyfill
  From: https://gist.github.com/flackjap/f318e6a2b316e4d9fa44
  Based on: https://gist.github.com/eligrey/384583

  Used to watch the Eggup object for value changes, triggering functions when changes occurs

  Example (listen for changes/updates on eggup.module):
  window.eggup.watch('module', function (id, oldval, newval) {
    console.log(JSON.stringify(oldval)+' '+ JSON.stringify(newval));
    return newval;
  });
*/
if (!Object.prototype.watch) {
  Object.defineProperty(Object.prototype, 'watch', {
    enumerable: false,
    configurable: true,
    writable: false,
    value: function (prop, handler) {
      let oldval = this[prop],
        getter = function () {
          return oldval;
        },
        setter = function (newval) {
          if (oldval !== newval) {
            handler.call(this, prop, oldval, newval);
            oldval = newval;
          } else {
            return false;
          }
      };

      if (delete this[prop]) {
        Object.defineProperty(this, prop, {
          get: getter,
          set: setter,
          enumerable: true,
          configurable: true
        });
      }
    }
  });
}


/**
  The Eggup constructor
*/
const Eggup = function() {
  const instance = this;


  /**
    Don't allow more than one Eggup instance
  */
  if (window.eggup) {
    console.log('Eggup is already instantiated, will not create a new instance.');

    return false;
  }


  /**
    instance.token: Unique client identifier (String(32))
    Used to associate the user to an action, such as an placed order

    Example:
    instance.token = 'fojdpzu2kodx95lh75zbl0rmef1d81acm'
  */
  instance.token = '';

  let get_token = new Promise(function(resolve, reject) {
    let token = JSON.parse(localStorage.getItem('token'));

    if (token) {
      instance.token = token;

      resolve(token);
    } else {
      token = '';

      fetch('/token', {
        method: 'post'
      }).then(function(response) {
        return response.json().then(function(json) {
          token = json['token'];
          localStorage.setItem('token', JSON.stringify(token));

          instance.token = token;

          resolve(token);
        });
      });
    }
  });


  /**
    instance.cache: Get previous orders to populate input fields (Object)
    We expect an object here, with variant and quantity properties
    The variant defines the boiling time for the eggs, eg. soft- or hard-boiled
    The quantity deines the amount of eggs the user wishes to order

    Example:
    instance.cache = {
      variant: 1 || 2,
      quantity: 1 || 2
    }
  */
  instance.cache = JSON.parse(localStorage.getItem('cache')) || (function() {
    const cache =  { 'variant': 'Löskokt', 'quantity': 1 };

    localStorage.setItem('cache', JSON.stringify(cache));

    return cache;
  })();


  /**
    instance.thread: Main application thread replica (Object)

    Example:
    instance.thread = {
      'last_known_order': '2017-03-09 08:45:04',
      'variant': 1,
      'quantity': 2,
      'heap_1': 11,
      'heap_2': 4
    }
  */
  instance.thread = JSON.parse(localStorage.getItem('thread')) || (function() {
    const thread =  {
      'tokenstamp': null,
      'variant': null,
      'quantity': null,
      'heap_1': 0,
      'heap_2': 0
    };

    localStorage.setItem('thread', JSON.stringify(thread));

    return thread;
  })();


  /**
    instance.module: Current active module (String)
    Used to calculate animation direction when loading modules
  */
  instance.module = 'init';


  /**
    instance.input_threshold: Don't fire input when the application is already
    processing a input

    Will prevent race condition between module transitions
  */
  instance.input_threshold = true;


  /**
    Wait until instantiation is complete before synchronizing
  */
  get_token.then(_ => {
    instance.synchronize();
  });
}


/**
  Eggup.prototype.synchronize: Syncronize the local application with the server
*/
Eggup.prototype.synchronize = function() {
  const instance = this;

  fetch('/synchronize', {
    method: 'post'
  }).then(function(response) {
    return response.json().then(function(json) {
      console.log(json);

      document.querySelector('.review-text__total').innerHTML = parseInt(JSON.parse(localStorage.getItem('thread'))['heap_1']) + parseInt(JSON.parse(localStorage.getItem('thread'))['heap_2']);
      document.querySelector('.review-text__heap_1').innerHTML = JSON.parse(localStorage.getItem('thread'))['heap_1'] + (JSON.parse(localStorage.getItem('thread'))['heap_1'] == 1 ? ' löskokt' : ' löskokta');
      document.querySelector('.review-text__heap_2').innerHTML = JSON.parse(localStorage.getItem('thread'))['heap_2'] + (JSON.parse(localStorage.getItem('thread'))['heap_2'] == 1 ? ' hårdkokt' : ' hårdkokta');

      if (json['available']) {
        document.querySelector('.order-quantity__data').value = JSON.parse(localStorage.getItem('cache'))['quantity'];
        document.querySelector('.order-variant__data').value = JSON.parse(localStorage.getItem('cache'))['variant'];

        instance.load('order');
      } else {
        instance.load(json['status']);

        /** Show when the eggs were started */
        //document.querySelector('.module-closed__timer').innerHTML = json['date'].slice(11,16);
      }
    });
  });
}


/**
  Eggup.prototype.load: Load a specific module

  Example:
  eggup.load('docket');
*/
Eggup.prototype.load = function(target_module) {
  const instance = this;
  const current_module = instance.module;

  /** Allowed targets */
  const module_array = [];
  document.querySelectorAll('.module').forEach((element) => {
    module_array.push(element.dataset.module);
  });

  const current_module_element = document.querySelector('div[data-module="' + current_module + '"]'),
    target_module_element = document.querySelector('div[data-module="' + target_module + '"]'),
    current_module_index = module_array.indexOf(current_module),
    target_module_index = module_array.indexOf(target_module);

  /**
    Deny load if the target is the same as current module,
    if the target module doesn't exist
    or if the application is closed
  */
  if (target_module_index == current_module_index
    || target_module_index == -1
    || current_module === 'closed') {
    instance.error();

    return false;
  }

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

      instance.input_threshold = false;
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

      instance.input_threshold = false;
    });
  }

  /** Finish all map nodes when orders are done */
  (target_module == 'docket') ? eggup.map(target_module_index + 1) : eggup.map(target_module_index);

  /** Never load a module while not scrolled to the top */
  document.querySelector('.container').scrollTop = 0;

  instance.module = target_module;
};


/**
  Eggup.prototype.error: Visual feedback to indicate an error in the application
*/
Eggup.prototype.error = function() {
  const instance = this,
    current_module = document.querySelector('.application');

  /** Abort any ongoing animation */
  if (current_module.classList.contains('application--error')) {
    current_module.classList.remove('application--error');
    void current_module.offsetWidth;
  }

  current_module.classList.add('application--error');

  /** Remove module-error modifier when animation is complete */
  current_module.addEventListener('webkitAnimationEnd', function(event) {
    event.target.removeEventListener(event.type, arguments.callee);

    current_module.classList.remove('application--error');

    instance.input_threshold = false;
  });

  return false;
};


Eggup.prototype.map = function(node) {
  current_node = 0;

  document.querySelectorAll('.node').forEach(function(element) {
    let current_element = element;
    if (current_element.classList.contains('done')) { current_element.classList.remove('done'); }
    if (current_element.classList.contains('active')) { current_element.classList.remove('active'); }

    current_node++;

    if (current_node < node) {
      current_element.classList.add('done');
      current_element.innerHTML = '<img src="assets/tick.svg" />';
    } else if (current_node == node) {
      current_element.classList.add('active');
      current_element.innerHTML = current_node;
    } else if (current_node > node) {
      current_element.innerHTML = current_node;
    }
  });
};


document.addEventListener('DOMContentLoaded', function() {
  window.eggup = new Eggup();

  /**
    Intercept attempts to submit the form through GET
  */
  const form = document.querySelector('form');
  form.addEventListener('submit', event => {
    event.preventDefault();
  });

  document.querySelector('.order-quantity').onclick = function() {
    let quantity_element = document.querySelector('.order-quantity__data'),
      variant_element = document.querySelector('.order-variant__data'),
      quantity_value = quantity_element.value,
      variant_value = variant_element.value;

    /**
      Firefox specific hack to remove input caret:
      http://stackoverflow.com/questions/5443952/remove-text-caret-pointer-from-focused-readonly-input
    */
    quantity_element.blur();

    if (quantity_element.classList.contains('swap')) {
      quantity_element.classList.remove('swap');
      void quantity_element.offsetWidth;
    }

    if (variant_element.classList.contains('swap')) {
      variant_element.classList.remove('swap');
      void variant_element.offsetWidth;
    }


    if (quantity_value == 1) {
      quantity_value = 2
      if (variant_value == 'Hårdkokt') {
        variant_value = 'Hårdkokta';
      } else {
        variant_value = 'Löskokta';
      }
    } else {
      quantity_value = 1
      if (variant_value == 'Hårdkokta') {
        variant_value = 'Hårdkokt';
      } else {
        variant_value = 'Löskokt';
      }
    }

    quantity_element.classList.add('swap');

    quantity_element.addEventListener('webkitAnimationEnd', function(e) {
      e.target.removeEventListener(e.type, arguments.callee);

      quantity_element.classList.remove('swap');
    });

    quantity_element.value = quantity_value;

    variant_element.classList.add('swap');

    variant_element.addEventListener('webkitAnimationEnd', function(e) {
      e.target.removeEventListener(e.type, arguments.callee);

      variant_element.classList.remove('swap');
    });

    variant_element.value = variant_value;

    const cache =  { 'variant': variant_value, 'quantity': quantity_value };

    eggup.cache = cache;
    localStorage.setItem('cache', JSON.stringify(cache));

    return false;
  };


  document.querySelector('.order-variant').onclick = function() {
    let quantity_element = document.querySelector('.order-quantity__data'),
      variant_element = document.querySelector('.order-variant__data'),
      quantity_value = quantity_element.value,
      variant_value = variant_element.value;

    /**
      Firefox specific hack to remove input caret:
      http://stackoverflow.com/questions/5443952/remove-text-caret-pointer-from-focused-readonly-input
    */
    variant_element.blur();

    if (quantity_element.classList.contains('swap')) {
      quantity_element.classList.remove('swap');
      void quantity_element.offsetWidth;
    }

    if (variant_element.classList.contains('swap')) {
      variant_element.classList.remove('swap');
      void variant_element.offsetWidth;
    }

    if (variant_value == 'Hårdkokt') {
      variant_value = 'Löskokt';
    } else if (variant_value == 'Hårdkokta') {
      variant_value = 'Löskokta';
    } else if (variant_value == 'Löskokt') {
      variant_value = 'Hårdkokt';
    } else {
      variant_value = 'Hårdkokta';
    }

    if (typeof quantity_value === 'undefined' || !quantity_value) {
      quantity_element.value = 1;

      quantity_element.classList.add('swap');

      quantity_element.addEventListener('webkitAnimationEnd', function(e) {
        e.target.removeEventListener(e.type, arguments.callee);

        quantity_element.classList.remove('swap');
      });
    }

    variant_element.classList.add('swap');

    variant_element.addEventListener('webkitAnimationEnd', function(e) {
      e.target.removeEventListener(e.type, arguments.callee);

      variant_element.classList.remove('swap');
    })

    variant_element.value = variant_value;

    const cache =  { 'variant': variant_value, 'quantity': quantity_value };

    eggup.cache = cache;
    localStorage.setItem('cache', JSON.stringify(cache));

    return false;
  }


  document.onkeydown = (event) => {
    if (eggup.module == 'order') {
      if (event.keyCode == '13' || event.keyCode == '32') { /** Return & Space keys */
        document.querySelector('.order-button__submit').click();

        return false;
      }
    }

    if (eggup.module == 'review') {
      if (event.keyCode == '8') { /** Backspace key */
        document.querySelector('.review-button__cancel').click();

        return false;
      }
    }
  };

  document.querySelector('.order-button__submit').onclick = () => {
    if (eggup.input_threshold === true) return;
    eggup.input_threshold = true;

    const submit_button = document.querySelector('.order-button__submit'),
      quantity =document.querySelector('.order-quantity__data').value,
      variant = document.querySelector('.order-variant__data').value;
    let variant_data;

    submit_button.classList.add('process');
    submit_button.disabled = true;

    /** Ensure we have input data */
    if (!quantity.length > 0
      || !variant.length > 0) {

      eggup.error();

      submit_button.classList.remove('process');
      submit_button.disabled = false;

      return false;
    }

    /** Convert variant into integer */
    if (variant === 'Löskokt' || variant === 'Löskokta') {
      variant_data = 1;
    } else if (variant === 'Hårdkokt' || variant === 'Hårdkokta') {
      variant_data = 2;
    } else {
      eggup.error();

      submit_button.classList.remove('process');
      submit_button.disabled = false;

      return false;
    }

    let set_request = new Promise(function(resolve, reject) {
      const token = JSON.parse(localStorage.getItem('token'));

      fetch('/request', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: serialize({ 'token': token, 'quantity': quantity, 'variant': variant_data })
      }).then(function(response) {
        return response.json().then(function(json) {
          resolve(json);
        });
      });
    });

    set_request.then((response) => {
      if (response['status'] == true) {

        document.querySelector('.review-text__order').innerHTML = eggup.cache['quantity'] + ' ' + eggup.cache['variant'].toLowerCase();

        let thread = JSON.parse(localStorage.getItem('thread'));
        thread.variant = eggup.cache['variant'];
        thread.quantity = eggup.cache['quantity'];
        localStorage.setItem('thread', JSON.stringify(thread));

        eggup.load('review');
      } else {
        eggup.error();
      }
    });

    setTimeout(function() {
      submit_button.classList.remove('process');
      submit_button.disabled = false;
    }, 1000);
    return false;
  };

  document.querySelector('.review-button__cancel').onclick = () => {
    if (eggup.input_threshold === true) return;
    eggup.input_threshold = true;

    cancel_button = document.querySelector('.review-button__cancel');

    let set_request = new Promise(function(resolve, reject) {
      const token = JSON.parse(localStorage.getItem('token'));

      cancel_button.classList.add('process');
      cancel_button.disabled = true;

      fetch('/delete', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: serialize({ 'token': token })
      }).then(function(response) {
        return response.json().then(function(json) {
          resolve(json);
        });
      });
    });

    set_request.then((response) => {
      if (response['status'] == true) {

        let thread = JSON.parse(localStorage.getItem('thread'));
        thread.variant = null;
        thread.quantity = null;
        localStorage.setItem('thread', JSON.stringify(thread));

        eggup.load('order');
      } else {
        eggup.error();
      }
    });

    setTimeout(function() {
      cancel_button.classList.remove('process');
      cancel_button.disabled = false;
    }, 1000);

    return false;
  };

  document.querySelectorAll('.container').forEach(function(element) {
    let current_element = element;

    element.addEventListener('scroll', () => {
      current_element.classList.toggle('container__scrolled', current_element.scrollTop > 0);
    });
  });
});
