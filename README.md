Eggup Node
==========


* [About the app](#user-content-about-the-app)
  * [Modules](#user-content-modules)
  * [Technical](#user-content-technical)
    * [State management](#user-content-state-management)
    * [Cache](#user-content-cache)
    * [Thread](#user-content-thread)
    * [Environment](#user-content-environment)
* [Settings](#user-content-settings)
  * [i18n](#user-content-i18n)
* [Hotkeys](#user-content-hotkeys)
* [Contribute](#user-content-contribute)
  * [General](#user-content-general)
  * [CSS](#user-content-js)
  * [Comments](#user-content-comments)
  * [Tools](#user-content-tools)
* [License](#user-content-license)


# About the app

This app is used by the office to order eggs in the morning.


## Modules
* Init
* Order
* Review
* Cooking
* Docket


## Technical

### State management

The application has a local storage cache and application thread. The purpose of the thread is to keep a application state so even if a user reloads their applicaiton, the state will be persitent. On each load, a syncronization with the server is performed, providing the latest state to the client.


### Cache

| Key      | Type    | Values                                 | Default value | Description                       |
| -------- | ------- | -------------------------------------- | ------------- | --------------------------------- |
| variant  | String  | Löskokt, Löskokta, Hårdkokt, Hårdkokta | Löskokt       | What variant does the user perfer |
| quantity | Integer | 1, 2                                   | 1             | What quanity does the user perfer |
| notify   | Boolean | TRUE, FALSE                            | TRUE          | Receive sound notifications       |

### Thread

| Key        | Type    | Values                                 | Default value | Description                                  |
| ---------- | ------- | -------------------------------------- | ------------- | -------------------------------------------- |
| tokenstamp | Date    | DATE, NULL                             | NULL          | At which date was the user's order requested |
| variant    | Integer | 1, 2, NULL                             | NULL          | User's perfered variant                      |
| quantity   | Integer | 1, 2, NULL                             | NULL          | User's perfered quantity                     |
| heap_1     | Integer | 0-N                                    | 0             | Egg pool for soft boiled eggs                |
| heap_2     | Integer | 0-N                                    | 0             | Egg pool for hard boiled eggs                |
| gateway    | Boolean | TRUE, FALSE                            | TRUE          | Can new orders be requested?                 |

### Environment

The application is runned on a Ubuntu machine with Nginx and Process Manager 2. Given that there are other applications (that is not built on Nodejs) on the same IP address, a reverse proxy is utilized for routing.

* [Nginx Reverse Proxy](https://nginx.org/en/)
* [pm2](http://pm2.keymetrics.io/)


# Settings

```javascript
eggup.settings('notify', false);
```
Turn on or off the notification sounds for your device. If this is set to true, the app will send a sound notification when your eggs are done (when soft boiled are done if that's what you chose, or when hard boiled are done if that's your perference). As a controller, you'll always get a sound for both soft- and hard boiled eggs.


# i18n

```javascript
eggup.i18n('set', 'en');
```
Will change the application language internally. 'sv' and 'en' available.

```javascript
eggup.i18n('get', 'pointer.to.key');
```
Will get a translated string from the langmap.

```javascript
eggup.i18n('update');
```
Will update the DOM with whatever language is chosen internally. Is called within 'set'.


# Hotkeys

Eggup can listen to hotkeys to perform actions.
The actions differ depending on the current module.

### Module: Order

| Key combination  | Action               |
| ---------------- |:--------------------:|
| 1, 1 or 1, L     | Set to 1 soft-boiled |
| 1, 2 or 1, H     | Set to 1 hard-boiled |
| 2, 1 or 2, L     | Set to 2 soft-boiled |
| 2, 2 or 2, H     | Set to 2 hard-boiled |
| Space or Return  | Confirm/send order   |

### Module: Review

| Key combination  | Action       |
| ---------------- |:------------:|
| Backspace        | Revert order |



# Contribute

To contribute to this project; fork the code, make your changes and then create a pull request detailing the changes and their pros.
To keep the project clean, please strive to forfill the following:

## General

* Tabs are two spaces.
* ID attribute has first priority on a element.
* Class attribute has second priority on a element.
  * All other attributes are attached in a alphabetical order.

## CSS

* Keep class names consitent
* A components name should be as descriptive as possible
* -element is a element in a component
* _state is a state
* Use data attributes where applicable
* CSS properties are in alphabetical order

Example selectors:
```css
.review.-cancel:not(._processing):disabled + .-gate
```

## Comments

Inline comments:
```js
/** Comment */
```

Multi-line comments:
```js
/**
 * Comment
 */
```

## Tools

* [Node.js](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [Passport](https://github.com/jaredhanson/passport)
* [Body Parser](https://github.com/expressjs/body-parser)
* [MySQL](https://github.com/mysqljs/mysql)
* [Socket.io](https://socket.io/)
* [Path](https://nodejs.org/api/path.html)



# License
[CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/)
