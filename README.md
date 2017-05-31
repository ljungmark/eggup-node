Eggup Node
==========


* [About the app](#user-content-about-the-app)
  * [Terminology](#user-content-terminology)
* [Settings](#user-content-settings)
* [Hotkeys](#user-content-hotkeys)
* [Contribute](#user-content-contribute)
  * [General](#user-content-general)
  * [CSS](#user-content-js)
  * [Tools](#user-content-tools)


# About the app

This app is used by the office to order eggs in the morning.


## Terminology

The application has a local storage cache and application thread. The purpose of the thread is to keep a application state so even if a user reloads their applicaiton, the state will be persitent. On each load, a syncronization with the server is performed, providing the latest state to the client.


# Settings

```javascript
set_notify();
```
Turn on or off the notification sound for your device.


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
* ID attribute has first priority.
* Class attribute has second priority.
* All other attributes are attached in a alphabetical order.

## CSS

* Keep class names consitent
* -element is a element in a component
* _state is a state
* Use data attributes where applicable

Example selectors:
```css
.review.-cancel:not(.process):disabled + .-gate
```

## Tools

* Node.js & Express
* Body Parser
* Node.js MySQL
* Socket.io
