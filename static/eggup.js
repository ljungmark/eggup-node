/** Helper functions */

/**
  Serialize from object to URIEncoded string

  Converts
  { property1: 'value1',
    property2: 'value2' }
  into
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
The Eggup constructor
*/
const Eggup = function() {
  /**
    instance.token: Unique client identifier (String(32))
    Used to connect the user to an action, such as an placed order

    Example:
    instance.token = 'fojdpzu2kodx95lh75zbl0rmef1d81acm'
  */
  const instance = this;
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
    instance.module: Current active module (String)
    Used to calculate animation direction when loading modules
  */
  instance.module = 'instantiate';

  /**
    Wait until instantiation is complete before synchronizing
  */
  get_token.then(() => {
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
      if (json['available']) {
        document.querySelector('.order-quantity__data').value = JSON.parse(localStorage.getItem('cache'))['quantity'];
        document.querySelector('.order-variant__data').value = JSON.parse(localStorage.getItem('cache'))['variant'];
        instance.load('application');
      } else {
        /** Show when the eggs were started */
        document.querySelector('.module-closed__timer').innerHTML = json['date'].slice(11,16);
        instance.load('docket');
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

  instance.module = target_module;
};


/**
  Eggup.prototype.error: Visual feedback to indicate an error in the application
*/
Eggup.prototype.error = function() {
  const instance = this,
    current_module = document.querySelector('.module[data-module="' + instance.module + '"]');

  /** Abort any ongoing animation */
  if (current_module.classList.contains('module--error')) {
    current_module.classList.remove('module--error');
    void current_module.offsetWidth;
  }

  current_module.classList.add('module--error');

  /** Remove module-error modifier when animation is complete */
  current_module.addEventListener('webkitAnimationEnd', function(event) {
    event.target.removeEventListener(event.type, arguments.callee);

    current_module.classList.remove('module--error');
  });

  return false;
};


document.addEventListener('DOMContentLoaded', function() {
  const eggup = new Eggup();

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
      quantity_element.classList.add('swap');

      quantity_element.addEventListener('webkitAnimationEnd', function(e) {
        e.target.removeEventListener(e.type, arguments.callee);

        quantity_element.classList.remove('swap');
      });

      quantity_element.value = quantity_value;
    }

    variant_element.classList.add('swap');

    variant_element.addEventListener('webkitAnimationEnd', function(e) {
      e.target.removeEventListener(e.type, arguments.callee);

      variant_element.classList.remove('swap');
    })

    variant_element.value = variant_value;

    const cache =  { 'variant': variant_value, 'quantity': quantity_value };

    localStorage.setItem('cache', JSON.stringify(cache));

    return false;
  }


  document.onkeydown = (event) => {
    if (eggup.module == 'application') {
      if (event.keyCode == '13' || event.keyCode == '32') { /** Return & Space keys */
        document.querySelector('.order-button__submit').click();

        return false;
      }
    }
  };

  document.querySelector('.order-button__submit').onclick = () => {
    const quantity =document.querySelector('.order-quantity__data').value,
      variant = document.querySelector('.order-variant__data').value;
    let variant_data;

    /** Ensure we have input data */
    if (!quantity.length > 0
      || !variant.length > 0) {

      eggup.error();

      return false;
    }

    /** Convert variant into integer */
    if (variant === 'Löskokt' || variant === 'Löskokta') {
      variant_data = 1;
    } else if (variant === 'Hårdkokt' || variant === 'Hårdkokta') {
      variant_data = 2;
    } else {
      eggup.error();

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
        eggup.load('docket');
      } else {
        eggup.error();
      }
    });

    return false;
  };

  document.querySelectorAll('.module-content').forEach(function(element) {
    let current_element = element;

    element.addEventListener('scroll', () => {
      if(current_element.scrollTop > 0) {
        current_element.classList.add('module-content__scrolled');
      } else {
        current_element.classList.remove('module-content__scrolled');
      }
    });
  });
});
