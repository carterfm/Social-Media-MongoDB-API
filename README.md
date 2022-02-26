# Social-Media-MongoDB-APIs

## Table of Contents

1. [Description](#description)

2. [Installation](#installation)

3. [Usage](#usage)

4. [Questions](#questions)

## Description <a id="description"></a>

A simple back-end framework for managing data for a hypothetical social media app. Built with MySQL MongoDB and Mongoose. This database has the following structure:

###User:

* `username`
  * String
  * Unique
  * Required
  * Trimmed

* `email`
  * String
  * Required
  * Unique
  * Must match a valid email address

* `thoughts`
  * Array of `_id` values referencing the `Thought` model

* `friends`
  * Array of `_id` values referencing the `User` model (self-reference)

* **virtual:** `friendCount`--retrieves the length of the user's `friends` array on query


###Thought:

* `thoughtText`
  * String
  * Required
  * Must be between 1 and 280 characters

* `createdAt`
  * Date
  * Set default value to the current timestamp
  * Use a getter method to format the timestamp on query

* `username` (The user that created this thought)
  * String
  * Required

* `reactions`: An array of reactions to a thought (subdocument, not a separate model on its own)

## Installation <a id="installation"></a>

First, clone this repository to your local system. Then, navigate to it in the terminal and type "npm install" to install its required dependencies. After that, type "node server.js" to initialize the server. Open http://localhost:3001/ in Insomnia or your browser to begin accessing routes (you'll need to use Insomnia if you wish to make requests besides GET).

## Usage <a id="usage"></a>

Video Demonstration: [pt 1](https://youtu.be/yW3duWCz5pM), [pt 2](https://youtu.be/OCftfzzl-8I) (split in two due to the limitations of the free version of screencastify)

This backend features the following routes:

###Users:

* GET '/api/users': returns all users 

* GET '/api/users/:userId': returns a single user with given ID with populated thought and friend data

* POST '/api/users': posts a new user 

* PUT 'api/users/:userId': updates a single user with given ID (and updates username field of associated thoughts if username changed)

* DELETE 'api/users/:userId': deletes a single user with given ID (and deletes associated thoughts)

* POST 'api/users/:userId/friends/:friendId': Add a friend with given id to user with given id

* DELETE 'api/users/:userId/friends/:friendId': Remove a friend with given id from user with given id

###Thoughts:

**`/api/thoughts`**

* GET 'api/thoughts': returns all thoughts 

* POST 'api/thoughts': posts a new thought

* GET 'api/thoughts/:thoughtId': returns a single thought with given id

* PUT 'api/thoughts/:thoughtId': updates a single thought with given id

* DELETE 'api/thoughts/:thoughtId': deletes a single thought with given id

* POST 'api/thoughts/:thoughtId/reactions': posts a reaction to a thought's reaction array field

* DELETE 'api/thoughts/:thoughtId/reactions/:reactionId': deletes a reaction with given reactionId from the reactions array of the thought with given id

## Questions <a id="questions"></a>

My GitHub profile is [carterfm](https://github.com/carterfm), and I can be reached for questions via email at [carterf.morfitt@gmail.com](mailto:carterf.morfitt@gmail.com).
