Eggup Node
==========


* [Documentation](#user-content-documentation)
* [About the app](#user-content-about-the-app)
  * [Modules](#user-content-modules)
  * [Technical](#user-content-technical)
    * [State management](#user-content-state-management)
    * [Cache](#user-content-cache)
    * [Thread](#user-content-thread)
    * [Environment](#user-content-environment)
* [Settings](#user-content-settings)
  * [UI Sounds](#user-content-ui-sounds)
  * [Internationalization and localization](#user-content-internationalization-and-localization)
  * [Login](#user-content-login)
  * [Logout](#user-content-logout)
* [Kiosk setup](#user-content-kiosk-setup)
* [Hotkeys](#user-content-hotkeys)
  * [Konami](#user-content-konami)


# Documentation
[Changelog](docs/CHANGELOG.markdown) | [Contributing](docs/CONTRIBUTING.markdown) | [License: CC BY-NC-SA 4.0](docs/LICENSE.markdown) | [Privacy](docs/PRIVACY.markdown) | [TOS](docs/TOS.markdown)


# About the app

This app is used by the office to order eggs in the morning.


## Modules
* Init
  * Loads cache or creates new one
  * Loads thread or creates new one
    * Performs synchronization to fetch the latest application state
  * Sets input threshold
* Order
* Review
* Cooking
* Docket


## Technical

### State management

The application has a local storage cache and application thread. The purpose of the thread is to keep a application state so even if a user reloads their applicaiton, the state will be persitent. On each load, a syncronization with the server is performed, providing the latest state to the client.

### Cache

| Key      | Type    | Values          | Default value | Description                       |
| -------- | ------- | --------------- | ------------- | --------------------------------- |
| variant  | String  | `1`, `2`        | `1`           | What variant does the user perfer |
| quantity | Integer | `1`, `2`        | `1`           | What quanity does the user perfer |
| notify   | Boolean | `TRUE`, `FALSE` | `TRUE`        | Receive sound notifications       |

### Thread

| Key                       | Type    | Values           | Default value | Description                                  |
| ------------------------- | ------- | ---------------- | ------------- | -------------------------------------------- |
| tokenstamp *[DEPRECATED]* | Date    | `DATE`, `NULL`   | `NULL`        | At which date was the user's order requested |
| variant                   | Integer | `1`, `2`, `NULL` | `NULL`        | User's perfered variant                      |
| quantity                  | Integer | `1`, `2`, `NULL` | `NULL`        | User's perfered quantity                     |
| heap_1                    | Integer | `0`-`N`          | `0`           | Egg pool for soft boiled eggs                |
| heap_2                    | Integer | `0`-`N`          | `0`           | Egg pool for hard boiled eggs                |
| gateway                   | Boolean | `TRUE`, `FALSE`  | `TRUE`        | Can new orders be requested?                 |

### Environment

The application is runned on a Ubuntu machine with Nginx and Process Manager 2. Given that there are other applications (that is not built on Nodejs) on the same IP address, a reverse proxy is utilized for routing.

* [Nginx](https://nginx.org/en/)
* [pm2](http://pm2.keymetrics.io/)


# Settings

## Debug console

We print all server respones in the JS console, append `?debug=true` to the URI.

## UI Sounds

```javascript
eggup.settings('notify', false);
```
Turn on or off the UI sounds for your device. This setting is not cross-device. If this is set to true, the app will send a sound notification when your eggs are done (when soft boiled are done if that's what you chose, or when hard boiled are done if that's your perference). As a controller, you'll always get a sound for both soft- and hard boiled eggs.

## Internationalization and localization

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

## Login

Navigate to /login to login with your social media account.

The following services are available:
* Facebook
* Twitter
* ~~Instagram~~ *[DEACTIVATED]*
* Spotify
* Github
* Steam
* Reddit
* ~~Google+~~ *[DEACTIVATED]*
* LinkedIn

## Logout

Navigate to /logout to logout from the application.


# Hotkeys

Eggup listens to hotkeys to perform actions.
The actions differ depending on the current module.


# Kiosk setup

Edit with content from `autostart` file:
```sh
sudo nano ~/.config/lxsession/LXDE/autostart
```

Reboot:
```sh
sudo reboot
```


## Module: Order

**Set to one soft-boiled:** <kbd>1</kbd>+<kbd>1</kbd> or <kbd>1</kbd>+<kbd>L</kbd>

**Set to one hard-boiled:** <kbd>1</kbd>+<kbd>2</kbd> or <kbd>1</kbd>+<kbd>H</kbd>

**Set to two soft-boiled:** <kbd>2</kbd>+<kbd>1</kbd> or <kbd>2</kbd>+<kbd>L</kbd>

**Set to two hard-boiled:** <kbd>2</kbd>+<kbd>2</kbd> or <kbd>2</kbd>+<kbd>H</kbd>

**Confirm/send order:** <kbd>Space</kbd> or <kbd>Return</kbd>

## Module: Review

**Revert order:** <kbd>Backspace</kbd>

## Konami

<kbd>p</kbd>+<kbd>a</kbd>+<kbd>r</kbd>+<kbd>t</kbd>+<kbd>y</kbd>

<kbd>s</kbd>+<kbd>n</kbd>+<kbd>o</kbd>+<kbd>o</kbd>+<kbd>k</kbd>


# File extension declaration

## .markdown

*"We no longer live in a 8.3 world, so we should be using the most descriptive file extensions. It’s sad that all our operating systems rely on this stupid convention instead of the better creator code or a metadata model, but great that they now support longer file extensions."*
Hilton Lipschitz ([via](http://hiltmon.com/blog/2012/03/07/the-markdown-file-extension/))

*"…the only file extension I would endorse is “.markdown”, for the same reason offered by Hilton Lipschitz"*
John Gruber, creator of Markdown ([via](http://daringfireball.net/linked/2014/01/08/markdown-extension))
