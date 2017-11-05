Contribute
==========

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
