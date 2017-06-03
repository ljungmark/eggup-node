Eggup Node
==========


* [About the app](#user-content-about-the-app)
  * [Technical](#user-content-technical)
    * [State management](#user-content-state-management)
    * [Cache](#user-content-cache)
    * [Thread](#user-content-thread)
    * [Token](#user-content-token)
    * [Environment](#user-content-environment)
* [Settings](#user-content-settings)
* [Hotkeys](#user-content-hotkeys)
* [Contribute](#user-content-contribute)
  * [General](#user-content-general)
  * [CSS](#user-content-js)
  * [Tools](#user-content-tools)
* [License](#user-content-license)


# About the app

This app is used by the office to order eggs in the morning.


## Technical

### State management

The application has a local storage cache and application thread. The purpose of the thread is to keep a application state so even if a user reloads their applicaiton, the state will be persitent. On each load, a syncronization with the server is performed, providing the latest state to the client.


### Cache

| Key      | Type    | Values                                 | Default value |
| -------- | ------- | -------------------------------------- | ------------- |
| variant  | String  | Löskokt, Löskokta, Hårdkokt, Hårdkokta | Löskokt       |
| quantity | Integer | 1, 2                                   | 1             |

### Thread

| Key        | Type    | Values                                 | Default value |
| ---------- | ------- | -------------------------------------- | ------------- |
| tokenstamp | Date    | DATE, NULL                             | NULL          |
| variant    | Integer | 1, 2, NULL                             | NULL          |
| quantity   | Integer | 1, 2, NULL                             | NULL          |
| heap_1     | Integer | 0-N                                    | 0             |
| heap_2     | Integer | 0-N                                    | 0             |
| gateway    | Boolean | TRUE, FALSE                            | TRUE          |
| notify     | Boolean | TRUE, FALSE                            | TRUEokt       |

### Token

| Key   | Type   | Values  | Default value |
| ----- | ------ | ------- | ------------- |
| token | String | {token} | {token}       |

### Environment

* [Nginx Reverse Proxy](https://nginx.org/en/)
* [pm2](http://pm2.keymetrics.io/)


# Settings

```javascript
set_notify();
```
Turn on or off the notification sounds for your device.


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

I welcome any contribution that you can think off. Just fork the code, make your changes and then pull request back again.
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

Example selectors:
```css
.review.-cancel:not(._processing):disabled + .-gate
```

## Tools

* [Node.js](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [Body Parser](https://github.com/expressjs/body-parser)
* [MySQL](https://github.com/mysqljs/mysql)
* [Socket.io](https://socket.io/)
* [Path](https://nodejs.org/api/path.html)



# Contribute
[CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/)
