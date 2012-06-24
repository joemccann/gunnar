Gunnar
=

A desktop app/widget to upload files to your Rackspace Cloud Files server.

Requirements
--

- node 0.4.8+
- Titanium Desktop 1.2

Installation
--

First, clone the repo.

```npm install -d```

```cd gunnar```

You are now ready to start hacking.

Hacking
-

Node.js and Express were and are used extensively for improving the speed and efficiency of the development process.  It is _not_ required for Titanium desktop app development, but I used it because it made things easier and faster for me. 


Configuration
--

While hacking/debugging, make sure you set the 


```DEBUG``` value to 

```true``` inside the 

```app.json``` 


file.


 
When you are ready to create a build version of the app for "production" (minified, concatenated, etc.) change the 

```DEBUG``` value to 

```false``` inside the 

```app.json``` 


file.


And then run

```smoosh -c app.json```


from the project's root directory (where the `app.json` file is located).


[Smoosh](http://github.com/fat/smoosh), if you didn't know, is a stellar node module for compressing and concatenating JavaScript and CSS files for when you are ready to deploy an app or site to production.  


 
Aliases
--



Here are some aliases that I added to my zsh/bash profile that I use to assist me in start/stopping/restarting node:


```alias nodeon='node app.js &; echo $! > node.pid'```


```alias nodeoff='cat node.pid | xargs kill & rm -f node.pid'```


```alias renode='nodeoff && nodeon'```


So, instead of typing 
```node app.js``` 
or even
```node app.js &``` 
and having to keep track of the process id (pid), just type ```nodeon```
If you want to kill it, type ```nodeoff```  

**NOTE:** this must be called from the same directory as the 
```app.js``` 
file.

If you want to restart the Express app, simply type, 
```renode```

 
### CSS Generation with Stylus #



When changing up the style of Gunnar inside your [Stylus](http://learnboost.github.com/stylus) files, be sure to run this command first:

 
```stylus -w ./public/css &```

This tells Stylus to watch the `css` directory and automatically compile any `.styl` files when they have changed.


You can of course pull the site up in the browser at


```http://127.0.0.1:3000```


but it is not necessary (and you obviously won't get the same experience as the Titanium app).

 
Inside the ```app.js``` there are a few shell commands that are called such as `wget` to create the `*.html` files needed for the Titanium app.  


Because Titanium only knows about your `.html` files, we need to have the Express views be saved as the proper `.html` files.  


So note, that anytime you start or restart the Express app, the necessary HTML files are ready to go.  You can also set this so that anytime your browse to `http://127.0.0.1:3000` the `index.html` is automagically generated.

***


 
Building for Titanium
--

In the `build` directory there is a `ti_build.sh` file and a `mac_app_store.md`.  One is a bash script for building the Titanium app and compressing it into a zip file while that other is step by step instructions on how to package the application specifically for the Mac App Store.


To simply build the Titanium app for testing (or you don't want to pay for it on the Mac App Store), import the `gunnar_app` directory into Titanium Developer or Titanium Studio and then build from there.


***



 
Docs
--

To generate the documentation:

```dox --title "Gunnar" --private public/js/code.js public/js/filesystem.js public/js/menu.js public/js/network.js public/js/properties.js public/js/setup.js public/js/utils.js > docs/index.html
```

***

 
Roadmap
--

* Add About menu item with link to subprint.com
* Add growl notification option when file has finished uploading.
* Show progress of files uploading (this is actually trivial and was left as a possible exercise for you, yes you.)