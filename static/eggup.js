/**
  EGGUP

  1. Helper Functions
    - get_date()
    - serialize()
    - controller()
    - gateway()
    - Object.watch()

  2. The Constructor

  3. Prototypes
    - synchronize
    - load
    - error
    - map
    - start
    - notify
    - i18n

  4. DOMContentLoaded
    - web sockets
    - event listeners
*/


/**
  Web sockets
*/
var socket = io.connect('');


/**
  HELPER FUNCTIONS
*/

/**
  Returns date in format YYYY-MM-DD
*/
function get_date(date) {
  current_date = new Date(),
  year = current_date.getFullYear(),
  month = ('0' + (current_date.getMonth() + 1)).slice(-2),
  day = ('0' + current_date.getDate()).slice(-2),
  date = year + '-' + month + '-' + day;

  return date;
}

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
  Returns true or false depending on if the sending token is also the current controller
*/
function controller() {
  const instance = this;

  return new Promise(function (resolve, reject) {
    fetch('/controller', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      credentials: 'include'
    }).then(function(response) {
      return response.json().then(function(json) {
        resolve(json.result);
      });
    });
  });
}


/**
  Object.watch polyfill
  From: https://github.com/melanke/Watch.JS
  Based on: https://gist.github.com/eligrey/384583

  Used to watch the Eggup object for value changes, triggering functions when changes occurs

  Example (listen for changes/updates on eggup.module):
  watch('module', function (id, oldval, newval) {
    console.log(JSON.stringify(oldval)+' '+ JSON.stringify(newval));
    return newval;
  });
*/
"use strict";!function(a){"object"==typeof exports?module.exports=a():"function"==typeof define&&define.amd?define(a):(window.WatchJS=a(),window.watch=window.WatchJS.watch,window.unwatch=window.WatchJS.unwatch,window.callWatchers=window.WatchJS.callWatchers)}(function(){function x(){w=null;for(var a=0;a<v.length;a++)v[a]();v.length=0}var a={noMore:!1,useDirtyCheck:!1},b=[],c=[],d=[],e=!1;try{e=Object.defineProperty&&Object.defineProperty({},"x",{})}catch(a){}var f=function(a){var b={};return a&&"[object Function]"==b.toString.call(a)},h=function(a){return"[object Array]"===Object.prototype.toString.call(a)},i=function(a){return"[object Object]"==={}.toString.apply(a)},j=function(a,b){var c=[],d=[];if("string"!=typeof a&&"string"!=typeof b){if(h(a)&&b)for(var e=0;e<a.length;e++)void 0===b[e]&&c.push(e);else for(var e in a)a.hasOwnProperty(e)&&b&&void 0===b[e]&&c.push(e);if(h(b)&&a)for(var f=0;f<b.length;f++)void 0===a[f]&&d.push(f);else for(var f in b)b.hasOwnProperty(f)&&a&&void 0===a[f]&&d.push(f)}return{added:c,removed:d}},k=function(a){if(null==a||"object"!=typeof a)return a;var b=a.constructor();for(var c in a)b[c]=a[c];return b},l=function(a,b,c,d){try{Object.observe(a,function(a){a.forEach(function(a){a.name===b&&d(a.object[a.name])})})}catch(e){try{Object.defineProperty(a,b,{get:c,set:function(a){d.call(this,a,!0)},enumerable:!0,configurable:!0})}catch(e){try{Object.prototype.__defineGetter__.call(a,b,c),Object.prototype.__defineSetter__.call(a,b,function(a){d.call(this,a,!0)})}catch(c){n(a,b,d)}}}},m=function(a,b,c){try{Object.defineProperty(a,b,{enumerable:!1,configurable:!0,writable:!1,value:c})}catch(d){a[b]=c}},n=function(a,b,d){c[c.length]={prop:b,object:a,orig:k(a[b]),callback:d}},o=function(){f(arguments[1])?p.apply(this,arguments):h(arguments[1])?q.apply(this,arguments):r.apply(this,arguments)},p=function(a,b,c,d){if("string"!=typeof a&&(a instanceof Object||h(a))){if(h(a)){if(D(a,"__watchall__",b,c),void 0===c||c>0)for(var f=0;f<a.length;f++)p(a[f],b,c,d)}else{var f,g=[];for(f in a)"$val"==f||!e&&"watchers"===f||Object.prototype.hasOwnProperty.call(a,f)&&g.push(f);q(a,g,b,c,d)}d&&R(a,"$$watchlengthsubjectroot",b,c)}},q=function(a,b,c,d,e){if("string"!=typeof a&&(a instanceof Object||h(a)))for(var f=0;f<b.length;f++){var g=b[f];r(a,g,c,d,e)}},r=function(a,b,c,d,e){"string"!=typeof a&&(a instanceof Object||h(a))&&(f(a[b])||(null!=a[b]&&(void 0===d||d>0)&&p(a[b],c,void 0!==d?d-1:d),D(a,b,c,d),e&&(void 0===d||d>0)&&R(a,b,c,d)))},s=function(){f(arguments[1])?t.apply(this,arguments):h(arguments[1])?u.apply(this,arguments):I.apply(this,arguments)},t=function(a,b){if(!(a instanceof String)&&(a instanceof Object||h(a)))if(h(a)){for(var c=["__watchall__"],d=0;d<a.length;d++)c.push(d);u(a,c,b)}else{var e=function(a){var c=[];for(var d in a)a.hasOwnProperty(d)&&(a[d]instanceof Object?e(a[d]):c.push(d));u(a,c,b)};e(a)}},u=function(a,b,c){for(var d in b)b.hasOwnProperty(d)&&I(a,b[d],c)},v=[],w=null,y=function(){return w||(w=setTimeout(x)),w},z=function(a){null==w&&y(),v[v.length]=a},A=function(){var a=f(arguments[2])?C:B;a.apply(this,arguments)},B=function(a,b,c,d){var i,e=null,f=-1,g=h(a),j=function(c,d,h,i){var j=y();if(f!==j&&(f=j,e={type:"update"},e.value=a,e.splices=null,z(function(){b.call(this,e),e=null})),g&&a===this&&null!==e){if("pop"===d||"shift"===d)h=[],i=[i];else if("push"===d||"unshift"===d)h=[h],i=[];else if("splice"!==d)return;e.splices||(e.splices=[]),e.splices[e.splices.length]={index:c,deleteCount:i?i.length:0,addedCount:h?h.length:0,added:h,deleted:i}}};i=1==c?void 0:0,p(a,j,i,d)},C=function(a,b,c,d,e){a&&b&&(r(a,b,function(a,b,f,g){var j={type:"update"};j.value=f,j.oldvalue=g,(d&&i(f)||h(f))&&B(f,c,d,e),c.call(this,j)},0),(d&&i(a[b])||h(a[b]))&&B(a[b],c,d,e))},D=function(b,c,d,e){var f=!1,g=h(b);b.watchers||(m(b,"watchers",{}),g&&H(b,function(a,d,f,g){if(N(b,a,d,f,g),0!==e&&f&&(i(f)||h(f))){var j,k,l,m,n=b.watchers[c];for((m=b.watchers.__watchall__)&&(n=n?n.concat(m):m),l=n?n.length:0,j=0;j<l;j++)if("splice"!==d)p(f,n[j],void 0===e?e:e-1);else for(k=0;k<f.length;k++)p(f[k],n[j],void 0===e?e:e-1)}})),b.watchers[c]||(b.watchers[c]=[],g||(f=!0));for(var j=0;j<b.watchers[c].length;j++)if(b.watchers[c][j]===d)return;if(b.watchers[c].push(d),f){var k=b[c],o=function(){return k},q=function(d,f){var g=k;if(k=d,0!==e&&b[c]&&(i(b[c])||h(b[c]))&&!b[c].watchers){var j,l=b.watchers[c].length;for(j=0;j<l;j++)p(b[c],b.watchers[c][j],void 0===e?e:e-1)}return K(b,c)?void L(b,c):void(a.noMore||g!==d&&(f?N(b,c,"set",d,g):E(b,c,"set",d,g),a.noMore=!1))};a.useDirtyCheck?n(b,c,q):l(b,c,o,q)}},E=function(a,b,c,d,e){if(void 0!==b){var f,g,h=a.watchers[b];(g=a.watchers.__watchall__)&&(h=h?h.concat(g):g),f=h?h.length:0;for(var i=0;i<f;i++)h[i].call(a,b,c,d,e)}else for(var b in a)a.hasOwnProperty(b)&&E(a,b,c,d,e)},F=["pop","push","reverse","shift","sort","slice","unshift","splice"],G=function(a,b,c,d){m(a,c,function(){var f,g,h,i,e=0;if("splice"===c){var j=arguments[0],k=j+arguments[1];for(h=a.slice(j,k),g=[],f=2;f<arguments.length;f++)g[f-2]=arguments[f];e=j}else g=arguments.length>0?arguments[0]:void 0;return i=b.apply(a,arguments),"slice"!==c&&("pop"===c?(h=i,e=a.length):"push"===c?e=a.length-1:"shift"===c?h=i:"unshift"!==c&&void 0===g&&(g=i),d.call(a,e,c,g,h)),i})},H=function(a,b){if(f(b)&&a&&!(a instanceof String)&&h(a))for(var d,c=F.length;c--;)d=F[c],G(a,a[d],d,b)},I=function(a,b,c){if(b){if(a.watchers[b])if(void 0===c)delete a.watchers[b];else for(var d=0;d<a.watchers[b].length;d++){var e=a.watchers[b][d];e==c&&a.watchers[b].splice(d,1)}}else delete a.watchers;S(a,b,c),T(a,b)},J=function(a,b){if(a.watchers){var c="__wjs_suspend__"+(void 0!==b?b:"");a.watchers[c]=!0}},K=function(a,b){return a.watchers&&(a.watchers.__wjs_suspend__||a.watchers["__wjs_suspend__"+b])},L=function(a,b){z(function(){delete a.watchers.__wjs_suspend__,delete a.watchers["__wjs_suspend__"+b]})},M=null,N=function(a,b,c,e,f){d[d.length]={obj:a,prop:b,mode:c,newval:e,oldval:f},null===M&&(M=setTimeout(O))},O=function(){var a=null;M=null;for(var b=0;b<d.length;b++)a=d[b],E(a.obj,a.prop,a.mode,a.newval,a.oldval);a&&(d=[],a=null)},P=function(){for(var a=0;a<b.length;a++){var d=b[a];if("$$watchlengthsubjectroot"===d.prop){var e=j(d.obj,d.actual);(e.added.length||e.removed.length)&&(e.added.length&&q(d.obj,e.added,d.watcher,d.level-1,!0),d.watcher.call(d.obj,"root","differentattr",e,d.actual)),d.actual=k(d.obj)}else{var e=j(d.obj[d.prop],d.actual);if(e.added.length||e.removed.length){if(e.added.length)for(var f=0;f<d.obj.watchers[d.prop].length;f++)q(d.obj[d.prop],e.added,d.obj.watchers[d.prop][f],d.level-1,!0);E(d.obj,d.prop,"differentattr",e,d.actual)}d.actual=k(d.obj[d.prop])}}var g,h;if(c.length>0)for(var a=0;a<c.length;a++)g=c[a],h=g.object[g.prop],Q(g.orig,h)||(g.orig=k(h),g.callback(h))},Q=function(a,b){var c,d=!0;if(a!==b)if(i(a)){for(c in a)if((e||"watchers"!==c)&&a[c]!==b[c]){d=!1;break}}else d=!1;return d},R=function(a,c,d,e){var f;f=k("$$watchlengthsubjectroot"===c?a:a[c]),b.push({obj:a,prop:c,actual:f,watcher:d,level:e})},S=function(a,c,d){for(var e=0;e<b.length;e++){var f=b[e];f.obj==a&&(c&&f.prop!=c||d&&f.watcher!=d||b.splice(e--,1))}},T=function(a,b){for(var d,e=0;e<c.length;e++){var f=c[e],g=f.object.watchers;d=f.object==a&&(!b||f.prop==b)&&g&&(!b||!g[b]||0==g[b].length),d&&c.splice(e--,1)}};return setInterval(P,50),a.watch=o,a.unwatch=s,a.callWatchers=E,a.suspend=J,a.onChange=A,a});


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
   * Clear legacy storage
   */
  if (localStorage.getItem('storedvalues')) localStorage.removeItem('storedvalues');
  if (localStorage.getItem('token')) localStorage.removeItem('token');
  if (localStorage.getItem('cache')) {
    const cache = JSON.parse(localStorage.getItem('cache'));

    if (!cache.language) {
      localStorage.removeItem('cache');
    }
  }


  /**
   * Refresh thread
   */
  if (localStorage.getItem('thread')) localStorage.removeItem('thread');


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
    const cache =  {
      'language': 'sv',
      'notify': true,
      'quantity': 1,
      'variant': 1
    };

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
      'heap_2': 0,
      'gateway': true
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
  instance.synchronize();
}


/**
 * Eggup.prototype.synchronize: Synchronize the local application with the server
 */
Eggup.prototype.synchronize = function() {
  const instance = this;

  fetch('/synchronize', {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    credentials: 'include'
  }).then(function(response) {
    return response.json().then(function(json) {
      instance.thread.tokenstamp = json.tokenstamp;
      instance.thread.variant = json.variant;
      instance.thread.quantity = json.quantity;
      instance.thread.heap_1 = json.heap_1;
      instance.thread.heap_2 = json.heap_2;
      instance.thread.gateway = json.gateway;
      localStorage.setItem('thread', JSON.stringify(instance.thread));

      /**
       * Update cache if there's a update in the thread
       */
      let cache = JSON.parse(localStorage.getItem('cache'));
      eggup.cache.variant = (json.variant) ? json.variant : cache.variant;
      eggup.cache.quantity = (json.quantity) ? json.quantity : cache.quantity;
      cache.variant = eggup.cache.variant;
      cache.quantity = eggup.cache.quantity;
      localStorage.setItem('cache', JSON.stringify(cache));

      document.querySelector('.order-quantity__data').value = JSON.parse(localStorage.getItem('cache'))['quantity'];

      if (JSON.parse(localStorage.getItem('cache'))['variant'] == 2 && JSON.parse(localStorage.getItem('cache'))['quantity'] == 1) {
        document.querySelector('.order-variant__data').value = eggup.i18n('get', 'order.hardboiled.singular');
      } else if (JSON.parse(localStorage.getItem('cache'))['variant'] == 2 && JSON.parse(localStorage.getItem('cache'))['quantity'] == 2) {
        document.querySelector('.order-variant__data').value = eggup.i18n('get', 'order.hardboiled.plural');
      } else if (JSON.parse(localStorage.getItem('cache'))['variant'] == 1 && JSON.parse(localStorage.getItem('cache'))['quantity'] == 1) {
        document.querySelector('.order-variant__data').value = eggup.i18n('get', 'order.softboiled.singular');
      } else {
        document.querySelector('.order-variant__data').value = eggup.i18n('get', 'order.softboiled.plural');
      }

      let soft_minutes = (Math.floor(json.past_soft / 60)),
        soft_seconds = (json.past_soft - soft_minutes * 60),
        hard_minutes = (Math.floor((json.past_soft + json.past_hard) / 60)),
        hard_seconds = ((json.past_soft + json.past_hard) - hard_minutes * 60);

      soft_minutes = ('0' + soft_minutes).substr(-2);
      soft_seconds = ('0' + soft_seconds).substr(-2);
      hard_minutes = ('0' + hard_minutes).substr(-2);
      hard_seconds = ('0' + hard_seconds).substr(-2);

      document.querySelector('.soft-timer').value = `${soft_minutes}:${soft_seconds}`;
      document.querySelector('.hard-timer').value = `${hard_minutes}:${hard_seconds}`;

      if (json['available']) {
        if (json.quantity == 0) {
          instance.load('order');
        } else {
          document.querySelector('.review-text__order').innerHTML = `${eggup.cache['quantity']} ${document.querySelector('.order-variant__data').value.toLowerCase()}`;

          eggup.heap(JSON.parse(localStorage.getItem('thread'))['heap_1'], JSON.parse(localStorage.getItem('thread'))['heap_2']);

          instance.load('review');
        }

        if (json.gateway === false) {
          gateway('lock');
        }

      } else {
        if (json.startdate) {
          let startdate = new Date(json.startdate),
            current_date = new Date();

          /** Add timers */
          startdate.setSeconds(startdate.getSeconds() + json.softboiled + json.hardboiled);

          if (startdate < current_date) {
            /** Countdown is finished */
            instance.load('docket');
          } else {
            /** There's still time left on the timer */
            let left_diff = (json.softboiled + json.hardboiled) - Math.trunc((startdate - current_date) / 1000),
              left_softboiled = (json.softboiled - left_diff < 0) ? 0 : json.softboiled - left_diff,
              left_hardboiled = (json.softboiled + json.hardboiled) - (left_softboiled + left_diff);

            instance.start(left_softboiled, left_hardboiled, json.softboiled, json.hardboiled);
            instance.load('cooking');
          }

        } else if (json.lockdate) {
          /** Application is locked, but boiling hasn't commenced yet */
          eggup.thread.heap_1 = response.heap_1;
          eggup.thread.heap_2 = response.heap_2;

          document.querySelector('.lock-button').innerHTML = 'Tillåt fler beställningar';
          document.querySelector('.lock-button').classList.add('locked');

          if (eggup.thread.quantity) {
            document.querySelector('.review-text__order').innerHTML = `${eggup.cache['quantity']} ${document.querySelector('.order-variant__data').value.toLowerCase()}`;
          } else {
            document.querySelector('.review-text__order').innerHTML = eggup.i18n('get', 'review.empty');
          }

          instance.gateway('lock');
          instance.load('review');
        }
      }
    });
  });

  console.log('%c Eggup 2.1 ', [
    'background: linear-gradient(-180deg, #44b1e8, #3098de)',
    'border-radius: 3px',
    'box-shadow: 0 1px 0 0 rgba(46,86,153,.15), inset 0 1px 0 0 rgba(46,86,153,.1), inset 0 -1px 0 0 rgba(46,86,153,.4);',
    'color: white',
    'display: block',
    'font-family: "Roboto Slab", serif',
    'font-size: 40px',
    'font-weight: bold',
    'line-height: 80px',
    'padding: 10px',
    'text-align: center',
    'text-shadow: 0 -1px 0 rgba(0,0,0,.12)'
  ].join(';'));

  console.log('%c  by @ljungmark, 2017 ', [,
    'font-family: "Roboto Slab", serif',
    'font-size: 20px',
    'font-weight: bold'
  ].join(';'));

  console.log('%c   https://www.github.com/ljungmark ', [,
    'font-family: "Roboto Slab", serif',
    'font-size: 13px',
    'font-weight: bold'
  ].join(';'));

  console.log('%c   https://www.twitter.com/ljungmark ', [,
    'font-family: "Roboto Slab", serif',
    'font-size: 13px',
    'font-weight: bold'
  ].join(';'));

  console.log('%c 2017 Ljungmark, CC BY-NC-SA 3.0 ', [,
    'background: linear-gradient(-180deg, #FB7928, #EE5B32)',
    'border-radius: 3px',
    'box-shadow: 0 1px 0 0 rgba(46,86,153,.15), inset 0 1px 0 0 rgba(46,86,153,.1), inset 0 -1px 0 0 rgba(46,86,153,.4);',
    'color: white',
    'display: block',
    'font-family: "Roboto Slab", serif',
    'font-size: 13px',
    'line-height: 30px',
    'margin-left: 8px',
    'padding: 3px 4px',
    'text-align: center',
    'text-shadow: 0 -1px 0 rgba(0,0,0,.12)'
  ].join(';'));

  console.log('%c   (https://creativecommons.org/licenses/by-nc-sa/3.0/) ', [,
    'font-family: "Roboto Slab", serif',
    'font-size: 11px'
  ].join(';'));
}


/**
 * Eggup.prototype.load: Load a specific module
 *
 * Example:
 * eggup.load('docket');
 */
Eggup.prototype.load = function(target_module) {
  const instance = this;
  const current_module = instance.module;


  /**
   * Open popup if the URL contains #start and the application has an open gateway
   * or if the user is the author of the closed gate.
   *
   * Otherwise, remove the #start from the URL
   */
  if (window.location.hash == '#start') {
    controller().then(function(result) {
      if (current_module == 'init'
        && (target_module == 'order' || target_module == 'review')
        && (eggup.thread.gateway == true || result)) {
        const wrapper = document.querySelector('.wrapper'),
            initiate = document.querySelector('.initiate');

          if (!wrapper.classList.contains('_open')) {
            wrapper.classList.add('_open');
            initiate.classList.add('_opening');

            document.querySelector('.initiate').addEventListener('webkitAnimationEnd', function(e) {
              e.target.removeEventListener(e.type, arguments.callee);
              document.querySelector('.initiate').classList.remove('_opening');
            });

            history.replaceState('', document.title, window.location.pathname + '#start');

            if (document.querySelector('.background')) document.querySelector('.background').pause();
          }

      } else {
        history.replaceState('', document.title, window.location.pathname);
      }
    });
  }

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
   * Deny load if the target is the same as current module,
   * if the target module doesn't exist
   * or if the application is closed
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
    target_module_element.classList.remove('_hidden');
    target_module_element.classList.add('fade_in_from_right');

    current_module_element.addEventListener('webkitAnimationEnd', function(e) {
      e.target.removeEventListener(e.type, arguments.callee)
      current_module_element.classList.remove('fade_out_to_left');
      current_module_element.classList.add('_hidden');
      target_module_element.classList.remove('fade_in_from_right');

      instance.input_threshold = false;
    });
  } else {
    current_module_element.classList.add('fade_out_to_right');
    target_module_element.classList.remove('_hidden');
    target_module_element.classList.add('fade_in_from_left');

    current_module_element.addEventListener('webkitAnimationEnd', function(e) {
      e.target.removeEventListener(e.type, arguments.callee)
      current_module_element.classList.remove('fade_out_to_right');
      current_module_element.classList.add('_hidden');
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
 * Eggup.prototype.error: Visual feedback to indicate an error in the application
 */
Eggup.prototype.error = function() {
  const instance = this;
  let current_module;

  if (document.querySelector('.wrapper._open')) {
    current_module = document.querySelector('.initiate');
  } else {
    current_module = document.querySelector('.application');
  }

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


/**
 * Eggup.prototype.map: Remap application when needed
 * Usually triggered inside eggup.load() to match current module
 */
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


Eggup.prototype.heap = function(soft, hard) {
  document.querySelector('.-soft').innerHTML = `${soft}`;
  document.querySelector('.-hard').innerHTML = `${hard}`;
  document.querySelector('.review-text__total').innerHTML = parseInt(soft) + parseInt(hard);
  document.querySelector('.review-text__heap_1').innerHTML = soft + (soft == 1 ? ` ${eggup.i18n('get', 'review.softboiled_singular')}` : ` ${eggup.i18n('get', 'review.softboiled_plural')}`);
  document.querySelector('.review-text__heap_2').innerHTML = hard + (hard == 1 ? ` ${eggup.i18n('get', 'review.hardboiled_singular')}` : ` ${eggup.i18n('get', 'review.hardboiled_plural')}`);
}


/**
 * Update UI to reflect gateway status
 */
Eggup.prototype.gateway = function(action) {
  const instance = this,
    review_button = document.querySelector('.review-button__cancel'),
    initiate_button = document.querySelector('.initiate-button');

  if (action === 'lock') {
    review_button.disabled = true;
    initiate_button.disabled = false;

    if (instance.module == 'order') {
      if (instance.thread.quantity) {
        document.querySelector('.review-text__order').innerHTML = `${instance.cache['quantity']} ${instance.cache['variant'].toLowerCase()}`;
      } else {
        document.querySelector('.review-text__order').innerHTML = `Du har inte beställt några`;
      }

      eggup.heap(JSON.parse(localStorage.getItem('thread'))['heap_1'], JSON.parse(localStorage.getItem('thread'))['heap_2']);

      instance.load('review');
    }
  } else if (action === 'unlock') {
    review_button.disabled = false;
    initiate_button.disabled = true;

    if (instance.module == 'review' && !instance.thread.variant) {
      instance.load('order');
    }
  }
}


Eggup.prototype.start = function(soft = 270, hard = 240, start_soft = null, start_hard = null) {
  let timer = soft + hard,
    countdown = new Countdown(timer),
    time = Countdown.parse(timer);

  Countdown.format(time.minutes, time.seconds);

  /** Static background for progress bars */
  const barwidth = document.querySelector('.progress-bar__v1').offsetWidth,
    barheight = document.querySelector('.progress-bar__v1').offsetHeight;
  document.querySelector('.progress-bar__variant_1').style.backgroundSize = `${barwidth}px ${barheight}px`;
  document.querySelector('.progress-bar__variant_2').style.backgroundSize = `${barwidth}px ${barheight}px`;

  countdown.onTick(Countdown.format).start(soft, hard, start_soft, start_hard);
};


Eggup.prototype.notify = function(sound = null) {
  const instance = this;

  if (instance.cache.notify && sound !== null && ['done', 'start'].includes(sound)) {
    const audio = document.querySelector('.audio'),
      source = document.querySelector('.audio-source');

    source.src = `assets/${sound}.mp3`;
    audio.load();
    audio.play();
  }

  return false;
};


Eggup.prototype.settings = function(setting = null, value = null) {
  const instance = this;

  if (setting === 'notify') {
    let cache = JSON.parse(localStorage.getItem('cache'));
    eggup.cache.notify = value;
    cache.notify = eggup.cache.notify;
    localStorage.setItem('cache', JSON.stringify(cache));

    return true;
  }

  return false;
};


Eggup.prototype.i18n = function(operation = 'get', pointer = null) {
  const instance = this,
    language = instance.cache.language,
    translations = {
      /** English */
      'en' : {
        'egg': {
          'back': 'Hübsch! I\'m back! <3',
          'bubble': {
            '0': 'What an amazing day!',
            '1': 'This is going to be sooo tasty!',
            '2': 'Aren\'t eggs the best ever?',
            '3': 'For every egg I become stronger!',
            '4': 'The most important meal of the day!',
            '5': 'Om nom nom nam nam!'
          }
        },
        'map': {
          '1': 'Order eggs',
          '2': 'Preparing',
          '3': 'Boiling',
          '4': 'All done',
        },
        'order': {
          'quantity': '# of eggs',
          'variant': 'Boiling time',
          'button': 'Order <img class="order-button__image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUCAMAAABYi/ZGAAAAclBMVEUAAAAAAAAEBAQBAQEAAAAJCQliYmL///8AAACOjo7////p6eny8vIiIiL////4+Pj///9DQ0Pw8PD///+2tranp6f////Gxsb+/v739/f7+/vs7Oz39/fj4+Ph4eH19fXy8vJubm5GRkYjIyOgoKD////gy5wGAAAAJXRSTlMPABQdJRkUBAQZ+hwTEALAJBMiHhwaFRL008+xqZ2YkowzLCQj8f+kPwAAAK1JREFUGNNNkFkShCAMBQPIoiA6brPvw/2vODERyveTStOBCiDWOKmqqlLSUUdMYwsAeKA35pSGHK0cMXIo5K5MMipQCnB58JnHHRQr3Q6bCbqw1NUssvdqUpNSuvzYo5wSp+O2BcyDvfObCV28bobWBzBI6vLG9UsVyTGzu+KKxGYxo9qCCAb2MQH3jd7skY/IhPVzQbO3/KdxGSbTQmumYYmCGaph7Pt+DJa6P73VCGq32yoQAAAAAElFTkSuQmCC">',
          'softboiled': {
            'singular': 'Soft boiled',
            'plural': 'Soft boiled'
          },
          'hardboiled': {
            'singular': 'Hard boiled',
            'plural': 'Hard boiled'
          }
        },
        'review': {
          'header': 'Lovely! Eggs for breakfast today!',
          'yourorder': 'Your order:',
          'eggs_singular': 'egg',
          'eggs_plural': 'eggs',
          'softboiled_singular': ' soft boiled egg',
          'softboiled_plural': ' soft boiled eggs',
          'hardboiled_singular': ' hard boiled egg',
          'hardboiled_plural': ' hard boiled eggs',
          'summary': '<span class="review-text__total">[total]</span> ordered today, <span class="review-text__heap_1">[soft]</span> and <span class="review-text__heap_2">[hard]</span>.',
          'cancel': '<img class="review-button__image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUCAMAAABYi/ZGAAAAYFBMVEUBAQEAAAAFBQUBAQH///8AAAAJCQliYmIAAACOjo7////4+Pivr6/y8vL4+Pj///9CQkL5+fny8vLi4uLp6eno6Oj////Gxsb+/v719fXy8vJvb29GRkYkJCSgoKD///8yNr5lAAAAH3RSTlMPABQdAyUZFAQZ+iAbE8AkE9GtmxwcFRL0kowzLCQjg3Jp6gAAAKJJREFUGNNNz90WwxAQBOANggRN27Tpf73/W3aspZkLh8/goKHEKz2Oo1aeV2wWSyLChhXz2lKL1Z4NHQl3iymhhmog3w4+2nFP0jqesxik1qZD7mZr73vKOc95ftYeBy3Onf55SW+Vy3l8o1l+V2Uizqe/C7nJTK8ygZipYasZGpKjfVzCf83V7eliYMDYKYJgwC1EVzoxbCA2aArLsoQEQX4BRgcYZ8kYeQAAAABJRU5ErkJggg=="> Change/cancel',
          'gate': 'The cooking is commencing shortly and you cannot place or change any of todays orders! :)',
          'empty': 'You haven\'t placed any order'
        },
        'controller': {
          'soft': 'soft boiled',
          'hard': 'hard boiled'
        },
        'boiling': {
          'softboiled': 'Soft boiled',
          'hardboiled': 'Hard boiled',
          'done': 'All done'
        },
        'docket': {
          'done': 'The eggs are done, enjoy!'
        }
      },
      /** Swedish */
      'sv' : {
        'egg': {
          'back': 'Hübsch! Jag är tillbaka! <3',
          'bubble': {
            '0': 'Vilken fantastisk dag!',
            '1': 'Det här kommer bli sååå smarrigt!',
            '2': 'Är inte ägg det bästa som finns?',
            '3': 'För varje ägg så blir jag starkare!',
            '4': 'Frukost är dagens viktigaste måltid!',
            '5': 'Om nom nom nam nam!'
          }
        },
        'map': {
          '1': 'Beställ ägg',
          '2': 'Invänta kokning',
          '3': 'Äggen kokar',
          '4': 'Klart',
        },
        'order': {
          'quantity': 'Antal ägg',
          'variant': 'Koktid',
          'button': 'Beställ <img class="order-button__image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUCAMAAABYi/ZGAAAAclBMVEUAAAAAAAAEBAQBAQEAAAAJCQliYmL///8AAACOjo7////p6eny8vIiIiL////4+Pj///9DQ0Pw8PD///+2tranp6f////Gxsb+/v739/f7+/vs7Oz39/fj4+Ph4eH19fXy8vJubm5GRkYjIyOgoKD////gy5wGAAAAJXRSTlMPABQdJRkUBAQZ+hwTEALAJBMiHhwaFRL008+xqZ2YkowzLCQj8f+kPwAAAK1JREFUGNNNkFkShCAMBQPIoiA6brPvw/2vODERyveTStOBCiDWOKmqqlLSUUdMYwsAeKA35pSGHK0cMXIo5K5MMipQCnB58JnHHRQr3Q6bCbqw1NUssvdqUpNSuvzYo5wSp+O2BcyDvfObCV28bobWBzBI6vLG9UsVyTGzu+KKxGYxo9qCCAb2MQH3jd7skY/IhPVzQbO3/KdxGSbTQmumYYmCGaph7Pt+DJa6P73VCGq32yoQAAAAAElFTkSuQmCC">',
          'softboiled': {
            'singular': 'Löskokt',
            'plural': 'Löskokta'
          },
          'hardboiled': {
            'singular': 'Hårdkokt',
            'plural': 'Hårdkokta'
          }
        },
        'review': {
          'header': 'Härligt! I dag blir det ägg till frukost!',
          'yourorder': 'Din beställning:',
          'eggs_singular': 'ägg',
          'eggs_plural': 'ägg',
          'softboiled_singular': ' löskokt ägg',
          'softboiled_plural': ' löskokta ägg',
          'hardboiled_singular': ' hårdkokt ägg',
          'hardboiled_plural': ' hårdkokta ägg',
          'summary': 'Totalt har det beställts <span class="review-text__total">[total]</span> idag, varav <span class="review-text__heap_1">[soft]</span> och <span class="review-text__heap_2">[hard]</span>.',
          'cancel': '<img class="review-button__image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUCAMAAABYi/ZGAAAAYFBMVEUBAQEAAAAFBQUBAQH///8AAAAJCQliYmIAAACOjo7////4+Pivr6/y8vL4+Pj///9CQkL5+fny8vLi4uLp6eno6Oj////Gxsb+/v719fXy8vJvb29GRkYkJCSgoKD///8yNr5lAAAAH3RSTlMPABQdAyUZFAQZ+iAbE8AkE9GtmxwcFRL0kowzLCQjg3Jp6gAAAKJJREFUGNNNz90WwxAQBOANggRN27Tpf73/W3aspZkLh8/goKHEKz2Oo1aeV2wWSyLChhXz2lKL1Z4NHQl3iymhhmog3w4+2nFP0jqesxik1qZD7mZr73vKOc95ftYeBy3Onf55SW+Vy3l8o1l+V2Uizqe/C7nJTK8ygZipYasZGpKjfVzCf83V7eliYMDYKYJgwC1EVzoxbCA2aArLsoQEQX4BRgcYZ8kYeQAAAABJRU5ErkJggg=="> Ändra/avbeställ',
          'gate': 'Äggkokning är på gång och du kan inte längre ändra dagens order! :)',
          'empty': 'Du har inte beställt några ägg'
        },
        'controller': {
          'soft': 'löskokta',
          'hard': 'hårdkokta'
        },
        'boiling': {
          'softboiled': 'Löskokta',
          'hardboiled': 'Hårdkokta',
          'done': 'Färdiga'
        },
        'docket': {
          'done': 'Äggen är klara, hugg in!'
        }
      }
    };

  if (operation === 'set' && ['sv', 'en'].includes(pointer)) {
    let cache = JSON.parse(localStorage.getItem('cache'));
    eggup.cache.language = pointer;
    cache.language = eggup.cache.language;
    localStorage.setItem('cache', JSON.stringify(cache));

    eggup.i18n('update');

    return true;

  } else if (operation === 'get') {
    if (!pointer) return false;

    let langmap = translations;
    /** Construct path to langmap */
    pointer = (`${language}.${pointer}`).split('.');

    /** Iterate through langmap to find the translation string */
    for (let index = 0, n = pointer.length; index < n; ++index) {
      let key = pointer[index];
      if (key in langmap) {
        langmap = langmap[key];
      } else {
        return false;
      }
    }

    return langmap;

  } else if (operation === 'update') {
    /** HTML Elements */
    document.querySelectorAll('[data-lang]').forEach(function(element) {
      let pointer = element.getAttribute('data-lang');

      /**
       * Set the translation content on something else than innerHTML
       * Eg. on a data-* attribute
       */
      if (element.hasAttribute('data-lang-target')) {
        element.setAttribute(element.getAttribute('data-lang-target'), eggup.i18n('get', pointer));
      } else {
        element.innerHTML = eggup.i18n('get', pointer);
      }
    });

    /** Variant text handled separately */
    let variant_text = document.querySelector('.order-variant__data');
    if (eggup.cache.quantity === 1 && eggup.cache.variant === 1) {
      variant_text.value = eggup.i18n('get', 'order.softboiled.singular');
    } else if (eggup.cache.quantity === 2 && eggup.cache.variant === 1) {
      variant_text.value = eggup.i18n('get', 'order.softboiled.plural');
    } else if (eggup.cache.quantity === 1 && eggup.cache.variant === 2) {
      variant_text.value = eggup.i18n('get', 'order.hardboiled.singular');
    } else {
      variant_text.value = eggup.i18n('get', 'order.hardboiled.plural');
    }

    /** Handle review order text separately */
    if (JSON.parse(localStorage.getItem('thread'))['variant'] && JSON.parse(localStorage.getItem('thread'))['quantity']) {
      document.querySelector('.review-text__order').innerHTML = `${eggup.cache['quantity']} ${document.querySelector('.order-variant__data').value.toLowerCase()} ${(eggup.cache['quantity'] == 1) ? eggup.i18n('get', 'review.eggs_singular') : eggup.i18n('get', 'review.eggs_plural')}`;
    } else {
      document.querySelector('.review-text__order').textContent = eggup.i18n('get', 'review.empty');
    }

    eggup.heap(JSON.parse(localStorage.getItem('thread'))['heap_1'], JSON.parse(localStorage.getItem('thread'))['heap_2']);

    return true;
  }

  return false;
};


/**
  Set up default Countdown object

  this.duration defines for how long the countdown should run
  this.function appends functions to be run every tick
*/
function Countdown(duration, granularity) {
  this.duration = duration;
  this.granularity = granularity || 1000; /** Defines the tick frequency */
  this.functions = [];
}

Countdown.prototype.start = function(soft, hard, start_soft = 240, start_hard = 270) {
  let start = Date.now(),
    instance = this,
    difference, object;

  (function runtime() {
    const barwidth = document.querySelector('.progress-bar__v1').offsetWidth,
      barheight = document.querySelector('.progress-bar__v1').offsetHeight;
    document.querySelector('.progress-bar__variant_1').style.backgroundSize = `${barwidth}px ${barheight}px`;
    document.querySelector('.progress-bar__variant_2').style.backgroundSize = `${barwidth}px ${barheight}px`;

    difference = instance.duration - (((Date.now() - start) / 1000) | 0)
    let date = Date.now();

    let current_soft = (soft - (soft - (difference - hard))),
      current_hard = ((soft + hard) - ((soft + hard) - difference));

    if (current_soft == 3 && eggup.thread.variant == '1') eggup.notify('done');

    if (current_hard == 3) {
      controller().then(function(result) {
        if (result) {
          eggup.notify('done');
        } else if (!result && eggup.thread.variant == '2') {
          eggup.notify('done');
        }
      });
    }

    if (difference > 0) {
      setTimeout(runtime, (instance.granularity - 1) - (date % (instance.granularity - 1)));
    } else {
      difference = 0;
      eggup.load('docket');
    }

    let soft_bar = ((start_soft - (difference - start_hard)) / start_soft) * 100,
      soft_percent = soft_bar.toFixed(1),
      hard_bar = ((start_soft + start_hard) - difference) / (start_soft + start_hard) * 100,
      hard_percent = hard_bar.toFixed(1);

    const bar_variant_1 = document.querySelector('.progress-bar__variant_1'),
      bar_text_1 = document.querySelector('.progress-bar__text_1'),
      bar_variant_2 = document.querySelector('.progress-bar__variant_2'),
      bar_text_2 = document.querySelector('.progress-bar__text_2');


    if(soft_percent < 100) {
      bar_variant_1.style.width = `${soft_percent}%`;
      bar_text_1.textContent =  `${JSON.parse(localStorage.getItem('thread'))['heap_1']} ${eggup.i18n('get', 'boiling.softboiled')}: ${soft_percent}%`;
    } else {
      bar_variant_1.style.width = `100%`;
      bar_text_1.textContent = `${eggup.i18n('get', 'boiling.done')}: ${JSON.parse(localStorage.getItem('thread'))['heap_1']}`;
    }

    if(hard_percent < 100) {
      bar_variant_2.style.width = `${hard_percent}%`;
      bar_text_2.textContent =  `${JSON.parse(localStorage.getItem('thread'))['heap_2']} ${eggup.i18n('get', 'boiling.hardboiled')}: ${hard_percent}%`;
    } else {
      bar_variant_2.style.width = `100%`;
      bar_text_2.textContent = `${eggup.i18n('get', 'boiling.done')}: ${JSON.parse(localStorage.getItem('thread'))['heap_2']}`;
    }

    time = Countdown.parse(difference);

    instance.functions.forEach(function(functions) {
      functions.call(this, difference, time.minutes, time.seconds)
    }, instance);
  }());
}

Countdown.prototype.onTick = function(functions) {
  if (typeof functions === 'function') {
    this.functions.push(functions)
  }

  return this;
}

Countdown.parse = function(seconds) {
  return {
    'minutes': (seconds / 60) | 0,
    'seconds': (seconds % 60) | 0
  }
}

Countdown.format = function(difference, minutes, seconds) {
  const cooking_countdown = document.querySelector('.cooking-text__countdown');

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  cooking_countdown.textContent = `${minutes}:${seconds}`;
}


document.addEventListener('DOMContentLoaded', function() {
  /**
   * Eggup is attached to window since we want it globally accessible and we'll never run more than one instance
   */
  window.eggup = new Eggup();

  /**
   * Update DOM
   */
  eggup.i18n('update');

  socket.on('gateway', function(action) {
    let thread = JSON.parse(localStorage.getItem('thread'));
    eggup.thread.gateway = action;
    thread.gateway = eggup.thread.gateway;
    localStorage.setItem('thread', JSON.stringify(thread));

    if (document.querySelector('.wrapper').classList.contains('_open')) document.querySelector('.close-start').click();

    action = (action == true) ? 'unlock' : 'lock';
    eggup.gateway(action);
  });

  socket.on('start', function(timers) {
    eggup.load('cooking');
    eggup.start(timers.timer1_tot, timers.timer2_tot, timers.timer1_tot, timers.timer2_tot);
  });

  socket.on('heap', function(heap) {
    eggup.heap(heap.heap_1, heap.heap_2);
  });

  let sequence  = [];

  /** Append video background if on desktop */
  if (window.innerWidth >= 960) {
    const video_markup = `<video class="background" playsinline autoplay muted loop>
      <source src="assets/background.mp4" type="video/mp4">
    </video>`,
      egg_markup = `
      <div class="egg">
        <div class="bubble" data-lang="egg.back"></div>
        <div class="yolk">
          <div class="face">
            <div class="eyes"></div>
            <div class="mouth"></div>
          </div>
        </div>
      </div>`;

    document.querySelector('body').insertAdjacentHTML('afterbegin', video_markup);
    document.querySelector('.wrapper').insertAdjacentHTML('afterbegin', egg_markup);

    document.querySelector('.bubble').textContent = eggup.i18n('get', 'egg.back');

    document.querySelector('.bubble').textContent = eggup.i18n('get', 'egg.back');

    window.bubble = setInterval(function(){
      document.querySelector('.bubble').textContent = eggup.i18n('get', 'egg.bubble.' + Math.floor(Math.random() * Object.keys(eggup.i18n('get', 'egg.bubble')).length));
    }, 20000);
  }

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
      variant_value = eggup.cache.variant;
      variant_text = quantity_element.value;

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
      if (variant_value == 2) {
        variant_text = eggup.i18n('get', 'order.hardboiled.plural');
      } else {
        variant_text = eggup.i18n('get', 'order.softboiled.plural');
      }
    } else {
      quantity_value = 1
      if (variant_value == 2) {
        variant_text = eggup.i18n('get', 'order.hardboiled.singular');
      } else {
        variant_text = eggup.i18n('get', 'order.softboiled.singular');
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

    variant_element.value = variant_text;

    const cache =  {
      'language': eggup.cache.language,
      'notify': eggup.cache.notify,
      'quantity': quantity_value,
      'variant': variant_value
    };

    eggup.cache = cache;
    localStorage.setItem('cache', JSON.stringify(cache));

    return false;
  };


  document.querySelector('.order-variant').onclick = function() {
    let quantity_element = document.querySelector('.order-quantity__data'),
      variant_element = document.querySelector('.order-variant__data'),
      quantity_value = quantity_element.value,
      variant_value = eggup.cache.variant;
      variant_text = variant_element.value;

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

    if (variant_value == 2 && quantity_value == 1) {
      variant_text = eggup.i18n('get', 'order.softboiled.singular');
      variant_value = 1;
    } else if (variant_value == 2 && quantity_value == 2) {
      variant_text = eggup.i18n('get', 'order.softboiled.plural');
      variant_value = 1;
    } else if (variant_value == 1 && quantity_value == 1) {
      variant_text = eggup.i18n('get', 'order.hardboiled.singular');
      variant_value = 2;
    } else {
      variant_text = eggup.i18n('get', 'order.hardboiled.plural');
      variant_value = 2;
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

    variant_element.value = variant_text;

    const cache =  {
      'language': eggup.cache.language,
      'notify': eggup.cache.notify,
      'quantity': quantity_value,
      'variant': variant_value,
    };

    eggup.cache = cache;
    localStorage.setItem('cache', JSON.stringify(cache));

    return false;
  }


  document.onkeydown = (event) => {
    if (!document.querySelector('.initiate__open'))
    {
      const sequences = [
        [49, 49], /** 1 + 1 */
        [49, 50], /** 1 + 2 */
        [50, 49], /** 2 + 1 */
        [50, 50], /** 2 + 2 */
        [49, 76], /** 1 + L */
        [49, 72], /** 1 + H */
        [50, 76], /** 2 + L */
        [50, 72],  /** 2 + H */
        [80, 65, 82, 84, 89] /** p + a + r + t + y */
      ];

      if (eggup.module == 'order') {
        if (event.keyCode == '13' || event.keyCode == '32') { /** Return & Space keys */
          document.querySelector('.order-button__submit').click();

          return false;
        }

        if (event.keyCode == '49' || event.keyCode == '50' || event.keyCode == '72' || event.keyCode == '76') {
          sequence.push(event.keyCode);

          let eq = function(a, b) { return !(a < b || b < a) }
          for (let sequence_index = 0; sequence_index < sequences.length; sequence_index++) {
            if (eq(sequence, sequences[sequence_index].slice(0, sequence.length))) {
              if (eq(sequence, sequences[sequence_index])) {
                const quantity_element = document.querySelector('.order-quantity__data'),
                  variant_element = document.querySelector('.order-variant__data');
                let quantity_value, variant_value, variant_data;

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

                if (sequence_index === 0 || sequence_index === 4) {
                  quantity_value = 1;
                  variant_value = eggup.i18n('get', 'order.softboiled.singular');
                  variant_data = 1;
                } else if (sequence_index === 1 || sequence_index === 5) {
                  quantity_value = 1;
                  variant_value = eggup.i18n('get', 'order.hardboiled.singular');
                  variant_data = 2;
                } else if (sequence_index === 2 || sequence_index === 6) {
                  quantity_value = 2;
                  variant_value = eggup.i18n('get', 'order.softboiled.plural');
                  variant_data = 1;
                } else if (sequence_index === 3 || sequence_index === 7) {
                  quantity_value = 2;
                  variant_value = eggup.i18n('get', 'order.hardboiled.plural');
                  variant_data = 2;
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

                const cache =  {
                  'language': eggup.cache.language,
                  'notify': eggup.cache.notify,
                  'quantity': quantity_value,
                  'variant': variant_data
                };

                eggup.cache = cache;
                localStorage.setItem('cache', JSON.stringify(cache));

                sequence = [];
              }

              return false;
            }
          }

          sequence = [];
        }
      }

      if (eggup.module == 'review') {
        if (event.keyCode == '8' /** Backspace key */
          && (document.querySelector('.start-input.soft-timer') != document.activeElement
            || document.querySelector('.start-input.soft-timer') != document.activeElement)) {
          document.querySelector('.review-button__cancel').click();

          return false;
        }
      }

      if (event.keyCode == 27 && document.querySelector('.wrapper').classList.contains('_open')) {
        document.querySelector('.close-start').click();
      }

      if (event.keyCode == '80' || event.keyCode == '65' || event.keyCode == '82' || event.keyCode == '84' || event.keyCode == '89') { /** p, a, r, t, y */
        sequence.push(event.keyCode);

        let eq = function(a, b) { return !(a < b || b < a) }
        for (let sequence_index = 0; sequence_index < sequences.length; sequence_index++) {
          if (eq(sequence, sequences[sequence_index].slice(0, sequence.length))) {
            if (eq(sequence, sequences[sequence_index])) {
              const body = document.querySelector('body');

              if (body.classList.contains('_party')) {
                body.classList.remove('_party');
              } else {
                body.classList.add('_party');
              }

              sequence = [];
            }

            return false;
          }
        }

        sequence = [];
      }
    }
  };

  document.querySelectorAll('.start-input').forEach((element) => element.onkeyup = (event) => {

    /** Repalce HHMM with HH:MM */
    if (event.target.value.length === 4 && event.target.value.charAt(2) !== ':') {
      if (event.target.value.substr(0,2).indexOf(':') == -1) event.target.value = `${event.target.value.substr(0,2)}:${event.target.value.substr(2,2)}`;
    }

    /** Repalce HHXMM with HH:MM */
    if (event.target.value.length === 5 && event.target.value.charAt(2) !== ':') {
      event.target.value = `${event.target.value.substr(0,2)}:${event.target.value.substr(3,2)}`;
    }
  });

  document.querySelector('.order-button__submit').onclick = () => {
    if (eggup.input_threshold === true) return;
    eggup.input_threshold = true;

    const submit_button = document.querySelector('.order-button__submit'),
      quantity =document.querySelector('.order-quantity__data').value,
      variant = document.querySelector('.order-variant__data').value,
      variant_data = eggup.cache.variant;

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

    let set_request = new Promise(function(resolve, reject) {
      fetch('/request', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: serialize({ 'quantity': quantity, 'variant': variant_data }),
        credentials: 'include'
      }).then(function(response) {
        return response.json().then(function(json) {
          resolve(json);
        });
      });
    });

    set_request.then((response) => {
      if (response['status'] == true) {

        document.querySelector('.review-text__order').innerHTML = `${eggup.cache['quantity']} ${document.querySelector('.order-variant__data').value.toLowerCase()} ${(eggup.cache['quantity'] == 1) ? eggup.i18n('get', 'review.eggs_singular') : eggup.i18n('get', 'review.eggs_plural')}`;

        eggup.thread.tokenstamp = get_date();
        eggup.thread.variant = variant_data;
        eggup.thread.quantity = eggup.cache['quantity'];
        eggup.thread.heap_1 = response.heap_1;
        eggup.thread.heap_2 = response.heap_2;
        localStorage.setItem('thread', JSON.stringify(eggup.thread));

        socket.emit('heap');

        eggup.load('review');
      } else {
        eggup.error();
      }

      setTimeout(function() {
        submit_button.classList.remove('process');
        submit_button.disabled = false;
      }, 1000);
    });

    return false;
  };

  document.querySelector('.review-button__cancel').onclick = () => {
    if (eggup.input_threshold === true) return;
    eggup.input_threshold = true;

    cancel_button = document.querySelector('.review-button__cancel');

    let set_request = new Promise(function(resolve, reject) {
      cancel_button.classList.add('process');
      cancel_button.disabled = true;

      fetch('/delete', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: 'include'
      }).then(function(response) {
        return response.json().then(function(json) {
          resolve(json);
        });
      });
    });

    set_request.then((response) => {
      if (response.status == true) {

        let thread = JSON.parse(localStorage.getItem('thread'));
        eggup.thread.tokenstamp = response.tokenstamp;
        eggup.thread.variant = null;
        eggup.thread.quantity = null;
        eggup.thread.heap_1 = response.heap_1;
        eggup.thread.heap_2 = response.heap_2;
        eggup.thread.gateway = thread.gateway;
        localStorage.setItem('thread', JSON.stringify(eggup.thread));

        socket.emit('heap');

        eggup.load('order');
      } else {
        eggup.error();
      }

      setTimeout(function() {
        cancel_button.classList.remove('process');
        cancel_button.disabled = false;
      }, 500);
    });

    return false;
  };

  document.querySelector('.initiate-button').onclick = () => {
    if (eggup.input_threshold === true) return;
    eggup.input_threshold = true;

    const timer1 = document.querySelector('.soft-timer').value,
      timer2 = document.querySelector('.hard-timer').value;

    /** Declaring variables here to have them reachable outside of the promise below */
    let timer1_min,
      timer1_sec,
      timer1_tot,
      timer2_min,
      timer2_sec,
      timer2_tot,
      timers_tot;

    initiate_button = document.querySelector('.initiate-button');

    let init_request = new Promise(function(resolve, reject) {
      initiate_button.classList.add('process');
      initiate_button.disabled = true;

      timer1_min = parseInt(timer1.substr(0,2)),
      timer1_sec = parseInt(timer1.substr(3,2)),
      timer1_tot = (timer1_min * 60) + timer1_sec,
      timer2_min = parseInt(timer2.substr(0,2)),
      timer2_sec = parseInt(timer2.substr(3,2)),
      timer2_tot = ((timer2_min * 60) + timer2_sec) - timer1_tot,
      timers_tot = timer1_tot + timer2_tot;

      if (timer2_tot < 0 || !(/([0][0-9]:[0-5][0-9])/.test(timer1)) || !(/([0][0-9]:[0-5][0-9])/.test(timer2))) {
        reject();
      } else {
        resolve();
      }
    });

    init_request.then((response) => {
      let send_request = new Promise(function(resolve, reject) {

        fetch('/start', {
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: serialize({ 'softboiled': timer1_tot, 'hardboiled': timer2_tot }),
          credentials: 'include'
        }).then(function(response) {
          return response.json().then(function(json) {
            resolve(json);
          });
        });
      });

      send_request.then((response) => {
        if (response['status'] == true) {
          const wrapper = document.querySelector('.wrapper'),
            popup = document.querySelector('.initiate');

          if (wrapper.classList.contains('_open')) {
            wrapper.classList.remove('_open');
            if (document.querySelector('.background')) document.querySelector('.background').play();
          }

          history.replaceState('', document.title, window.location.pathname);

          eggup.load('cooking');
          eggup.start(timer1_tot, timer2_tot, timer1_tot, timer2_tot);

          socket.emit('start', {
            timer1_tot: timer1_tot,
            timer2_tot: timer2_tot
          });

           setTimeout(function() {
            initiate_button.classList.remove('process');
            initiate_button.disabled = false;
          }, 500);

        } else {
          eggup.error();
        }
      });
    }).catch((response) => {
      eggup.error();

      initiate_button.classList.remove('process');
      initiate_button.disabled = false;
    });

    return false;
  };

  document.querySelector('.close-start').onclick = () => {
    document.querySelector('.wrapper').classList.add('_closing');

    document.querySelector('.initiate').addEventListener('webkitAnimationEnd', function(e) {
      e.target.removeEventListener(e.type, arguments.callee);

      document.querySelector('.wrapper').classList.remove('_open');
      document.querySelector('.wrapper').classList.remove('_closing');
    });

    if (document.querySelector('.background')) document.querySelector('.background').play();

    history.replaceState('', document.title, window.location.pathname);

    return false;
  };

  document.querySelector('.lock-button').onclick = (event) => {
    eggup.notify('start');

      let lock_request = new Promise(function(resolve, reject) {
        fetch('/lock', {
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: serialize({ 'state': eggup.thread.gateway }),
          credentials: 'include'
        }).then(function(response) {
          return response.json().then(function(json) {
            resolve(json);
          });
        });
      });

      lock_request.then((response) => {
        if (response['status'] == true) {
          event.target.classList.toggle('locked', eggup.thread.gateway == true);

          let thread = JSON.parse(localStorage.getItem('thread'));
          eggup.thread.gateway = !eggup.thread.gateway;
          thread.gateway = eggup.thread.gateway;
          localStorage.setItem('thread', JSON.stringify(thread));


          action = (eggup.thread.gateway == true) ? 'unlock' : 'lock';
          eggup.gateway(action);

          socket.emit('gateway', eggup.thread.gateway);

        } else {
          eggup.error();
        }
      });

    if (eggup.thread.gateway == true) {
      event.target.innerHTML = 'Tillåt fler beställningar';
    } else {
      event.target.innerHTML = 'Ta inte emot fler beställningar';
    }

    return false;
  };

  /** Add shadow on containers when scrolled */
  document.querySelectorAll('.container').forEach(function(element) {
    let current_element = element;

    element.addEventListener('scroll', () => {
      current_element.classList.toggle('container__scrolled', current_element.scrollTop > 0);
    });
  });

  /**
    Watch changes in the thread's heaps and update the DOM accordingly
  */
  watch(eggup.thread, ['heap_1', 'heap_2'], function(){
    eggup.heap(JSON.parse(localStorage.getItem('thread'))['heap_1'], JSON.parse(localStorage.getItem('thread'))['heap_2']);
  });

  /**
    Append or remove video background based on inner width of window
  */
  window.addEventListener('resize', function(event) {
    if (window.innerWidth < 960) {
      if (document.querySelector('.background')) {
        document.querySelector('body').removeChild(document.querySelector('.background'));
      }
      if (document.querySelector('.egg')) {
        document.querySelector('.wrapper').removeChild(document.querySelector('.egg'));
        clearTimeout(window.bubble);
      }
    } else {
      if (!document.querySelector('.background')) {
        const video_markup = `<video class="background" playsinline autoplay muted loop>
            <source src="assets/background.mp4" type="video/mp4">
          </video>`,
          egg_markup = `
          <div class="egg">
            <div class="bubble" data-lang="egg.back"></div>
            <div class="yolk">
              <div class="face">
                <div class="eyes"></div>
                <div class="mouth"></div>
              </div>
            </div>
          </div>`;

        /** Append directly after the body tag */
        document.querySelector('body').insertAdjacentHTML('afterbegin', video_markup);
        document.querySelector('.wrapper').insertAdjacentHTML('afterbegin', egg_markup);

        document.querySelector('.bubble').textContent = eggup.i18n('get', 'egg.bubble.' + Math.floor(Math.random() * Object.keys(eggup.i18n('get', 'egg.bubble')).length));

        window.bubble = setInterval(function(){
          document.querySelector('.bubble').textContent = eggup.i18n('get', 'egg.bubble.' + Math.floor(Math.random() * Object.keys(eggup.i18n('get', 'egg.bubble')).length));
        }, 20000);
      }

      document.querySelector('video').play();
    }

    /** Static background for progress bars */
    const barwidth = document.querySelector('.progress-bar__v1').offsetWidth,
      barheight = document.querySelector('.progress-bar__v1').offsetHeight;
    document.querySelector('.progress-bar__variant_1').style.backgroundSize = `${barwidth}px ${barheight}px`;
    document.querySelector('.progress-bar__variant_2').style.backgroundSize = `${barwidth}px ${barheight}px`;
  });

  /**
    Long press click to fire popup to start cooking
  */
  let persistency;

  document.onmousedown = (event) => {
    if (event.which == 1 /** Only trigger on left clicks */
      && (eggup.module == 'order' || eggup.module == 'review')) {
      clearTimeout(persistency);

      persistency = window.setTimeout(function() {
        controller().then(function(result) {
          if (eggup.thread.gateway == true || result) {

            const wrapper = document.querySelector('.wrapper'),
              initiate = document.querySelector('.initiate');

            if (!wrapper.classList.contains('_open')) {
              wrapper.classList.add('_open');
              initiate.classList.add('_opening');

              document.querySelector('.initiate').addEventListener('webkitAnimationEnd', function(e) {
                e.target.removeEventListener(e.type, arguments.callee);
                document.querySelector('.initiate').classList.remove('_opening');
              });

              history.replaceState('', document.title, window.location.pathname + '#start');

              if (document.querySelector('.background')) document.querySelector('.background').pause();
            }
          }
        });

        return false;
      }, 2000);
    }
  };

  document.onmouseup = (event) => {
    clearTimeout(persistency);
  };

  document.ontouchstart = (event) => {
    if ((eggup.module == 'order' || eggup.module == 'review')) {
      clearTimeout(persistency);

      persistency = window.setTimeout(function() {

        controller().then(function(result) {
          if (eggup.thread.gateway == true || result) {
            const wrapper = document.querySelector('.wrapper'),
              initiate = document.querySelector('.initiate');

            if (!wrapper.classList.contains('_open')) {
              wrapper.classList.add('_open');
              initiate.classList.add('_opening');

              document.querySelector('.initiate').addEventListener('webkitAnimationEnd', function(e) {
                e.target.removeEventListener(e.type, arguments.callee);
                document.querySelector('.initiate').classList.remove('_opening');
              });

              history.replaceState('', document.title, window.location.pathname + '#start');

              if (document.querySelector('.background')) document.querySelector('.background').pause();
            }
          }
        });

        return false;
      }, 2000);
    }
  }

  document.ontouchend = (event) => {
    clearTimeout(persistency);
  };
});
