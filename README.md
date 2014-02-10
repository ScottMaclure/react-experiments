# React Experiments

Live demo: <http://scottmaclure.github.io/react-experiments/>

## Goals

* Learn how to use React, Facebook's "new" view/rendering framework.
* Learn how to integrate Backbone with React, essentially replacing Backbone.View with React.
* Render a large table with Backbone + React, adding in some behaviours (TBC).
* Compare against other framework implementations, measure performance using Chrome devtools etc.

## Requirements

* node/npm
* bower
* git
* CouchDB

## Installation and running these experiments


From your terminal/git bash console:

```sh
git clone git@github.com:ScottMaclure/react-experiments.git
cd react-experiments
bower install
npm install
npm start
```

### CouchDB
* Install CouchDB if you don't have it already (http://docs.couchdb.org/en/latest/install/index.html) and configure it to run on port :5984 (default. or alter scritps/couchdb.sh otherwise)
* Enable CORS: https://wiki.apache.org/couchdb/CORS#Enabling_CORS
* Now you have to create `users` database, db view, and populate it with initial mock data.
* Make sure CouchDB is running, then from your terminal/git bash console run:
```sh
    . scripts/couchdb.sh
```
Followong links should show you list of databases you have and list of users
`http://localhost:5984/_utils/`
`http://localhost:5984/_utils/database.html?users/`

### Fire up

The index.html page on <http://localhost:3000> has links to each experiment.

## Offline JSX compiling

All of the experiments use JSX, if making changes, you need to compile `src/` into `public/build/`.

You can use React's jsx program in watch mode:

```sh
node ./node_modules/react-tools/bin/jsx --watch src/ public/build/
```

## React Developer Tools for Google Chrome

Useful for debugging:

<https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi/related>

## Generating mock json data

Check out the `scripts/` folder for some JSON generator programs. Typical use:

```
node scripts/usersTableDataGenerator.js  > public/data/users-table.json
```

## Publishing to gh-pages

For now, I've published the `public/` folder to gh-pages branch.

I've done this by cloning the repo to `react-experiments-gh-pages/` (next to `react-experiments/`), and checking out the `gh-pages` branch.

To sync, there's a script to do this:

```
./scripts/deploy-gh-pages.sh
```

## TODO

### general

* Find a nice solution for JSHint + JSX (https://github.com/CondeNast/JSXHint?) (dangerouslySetInnerHTML={{__html: rawMarkup}})
* Add Foundation v5 or Twitter bootstrap to the project, get things looking pretty. JS integration?
* Go through our components, and make use of propTypes (http://facebook.github.io/react/docs/component-specs.html)

### react-tutorial

* Consider Websocket for comment updates - socket.io mixin? - github.com/Enome/react.io
* Consider a FormErrors component, for nice display of error messages (Foundation Abide?)
* Consider pouchdb or simliar, for offline storage of comments.
* Add a date field to comments, perhaps invert render order

### react-table

* Code review on ReactTabe.js
* Add "delete row" support
* Add "delete row" support
* Implement "marionette-table" and "angular-table" for comparison! Within this repo is fine.

## Further Reading

http://blog.whn.se/post/69621609605/writing-good-react-components

http://www.reddit.com/r/javascript/comments/1oo1y8

https://github.com/usepropeller/react.backbone

http://eldar.djafarov.com/2013/11/reactjs-mixing-with-backbone/