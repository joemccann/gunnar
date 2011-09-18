# Gunnar #

A desktop app/widget to upload files to your Rackspace Cloud Files server.

<br>
## Requirements #
- node 0.4.8+
- Titanium Desktop 1.2


<br>
## Installation #

Clone the repo.

<pre>npm install -d</pre>

<pre>cd gunnar</pre>

You are now ready to start hacking.

<br>
## Hacking#



Node.js and Express were and are used extensively for improving the speed and efficiency of the development process.  It is _not_ required for Titanium desktop app development, but I used it because it made things easier and faster for me. 

<br>
### Configuration #

While hacking/debugging, make sure you set the 


<pre>DEBUG</pre> value to 
<pre>true</pre> inside the 
<pre>app.json</pre> 


file.


<br>
When you are ready to create a build version of the app for "production" (minified, concatenated, etc.) change the 

<pre>DEBUG</pre> value to 
<pre>false</pre> inside the 
<pre>app.json</pre> 


file.


And then run

<pre>smoosh -c app.json</pre>


from the project's root directory (where the `app.json` file is located).


[Smoosh](http://github.com/fat/smoosh), if you didn't know, is a stellar node module for compressing and concatenating JavaScript and CSS files for when you are ready to deploy an app or site to production.  


<br>
### Aliases #


Here are some aliases that I added to my zsh/bash profile that I use to assist me in start/stopping/restarting node:


<pre>alias nodeon='node app.js &; echo $! > node.pid'</pre>


<pre>alias nodeoff='cat node.pid | xargs kill & rm -f node.pid'</pre>


<pre>alias renode='nodeoff && nodeon'</pre>


So, instead of typing 
<pre>node app.js</pre> 
or even
<pre>node app.js &</pre> 
and having to keep track of the process id (pid), just type <pre>nodeon</pre>
If you want to kill it, type <pre>nodeoff</pre>  

**NOTE:** this must be called from the same directory as the 
<pre>app.js</pre> 
file.

If you want to restart the Express app, simply type, 
<pre>renode</pre>

<br>
### CSS Generation with Stylus #



When changing up the style of Gunnar inside your [Stylus](http://learnboost.github.com/stylus) files, be sure to run this command first:

 
<pre>stylus -w ./public/css &</pre>

This tells Stylus to watch the `css` directory and automatically compile any `.styl` files when they have changed.


You can of course pull the site up in the browser at


<pre>http://127.0.0.1:3000</pre>


but it is not necessary (and you obviously won't get the same experience as the Titanium app).

<br>
Inside the <pre>app.js</pre> there are a few shell commands that are called such as `wget` to create the `*.html` files needed for the Titanium app.  


Because Titanium only knows about your `.html` files, we need to have the Express views be saved as the proper `.html` files.  


So note, that anytime you start or restart the Express app, the necessary HTML files are ready to go.  You can also set this so that anytime your browse to `http://127.0.0.1:3000` the `index.html` is automagically generated.

***


<br>
## Building for Titanium

In the `build` directory there is a `ti_build.sh` file and a `mac_app_store.md`.  One is a bash script for building the Titanium app and compressing it into a zip file while that other is step by step instructions on how to package the application specifically for the Mac App Store.


To simply build the Titanium app for testing (or you don't want to pay for it on the Mac App Store), import the `gunnar_app` directory into Titanium Developer or Titanium Studio and then build from there.


***



<br>
##Docs


To generate the documentation:

<pre>
dox --title "Gunnar" --private public/js/code.js public/js/filesystem.js public/js/menu.js public/js/network.js public/js/properties.js public/js/setup.js public/js/utils.js > docs/index.html
</pre>

***



<br>
##Roadmap

* Add About menu item with link to subprint.com
* Add growl notification option when file has finished uploading.
* Show progress of files uploading (this is actually trivial and was left as a possible exercise for you, yes you.)