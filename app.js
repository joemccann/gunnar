// Required packages/modules
var express = require('express')
  , cluster = require('cluster')
  , exec = require('child_process').exec
  , fs = require('fs')
  , path = require('path')
  , colors = require('colors')
  , strings = require(__dirname +  '/utils/strings')
  
// For cluster...
var numCPUs = require('os').cpus().length

// Some setup variables and helpers.  
var isFirstRunComplete = false
  , auth_form = strings.authForm
  , cli = strings.cli
  
// We snag this from the smoosh config in "app.json"
var appConfig = JSON.parse( fs.readFileSync(__dirname + '/app.json', 'UTF-8') )

debug = appConfig.DEBUG  

var app = module.exports = express.createServer()

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('env', debug ? 'development' : 'production');  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(
    { 
      src: __dirname + '/public',
      compress: !debug 
    }));
  app.use(express.static(__dirname + '/public/'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Route for the index page.
app.get('/', function(req, res){
  res.render('index', {
    title: 'Gunnar',
    auth_form: auth_form,
    debugging: debug,
    version: appConfig.VERSION
  });
});

// Route for the results page.
app.get('/results', function(req, res){
  res.render('results', {
    layout: 'layout_results',
    title: 'Results'
  });
});

// TODO: definitely improve this
function cleanFileName(filename)
{
  return filename
          .replace(/\s/g,"_")
          .replace(/\n/g,"_")
          .replace(/\(/g, "_")
          .replace(/\)/g, "_")
          .replace(/\'/g, "_")
}

// Let's create the index.html for Titanium via wget so anytime we refresh the page in the 
// browser or call wget/curl a new index.html page is created.
function createIndexPage()
{
  return exec(cli.wgetIndex, function (error, stdout, stderr) {
    if (error) {
      console.log(error);
    }
    else
    {
      isFirstRunComplete = true;
    }
  })
}

// So non-DRY..seriously, just shameful :p
function createResultsPage()
{
  return exec(cli.wgetResults, function (error, stdout, stderr) {
    if (error) {
      console.log(error);
    }
  })
}

function removeIndexPage(cb){
  
  return exec(cli.rmIndex, function (error, stdout, stderr) {
    if (error) {
      console.log(error)
    }
    else
    {
      cb && cb()
    }
  })
  
}

function mergeObject(to, from)
{
    for (prop in from)
    {
        to[prop] = from[prop];
    }
    return to
}

function init()
{
  if (cluster.isMaster){

    // Fork workers.
    for (var i = 0; i < (debug ? 1 : numCPUs); i++) {
      cluster.fork()
    }

    cluster.on('death', function(worker) {
      // We need to spin back up on death.
      cluster.fork()
      console.log('worker ' + worker.pid + ' died');
    })

    // Bad hack, but it works...
    setTimeout(function(){
      console.log('\n\nRemoving and creating index and results pages...')

      var child = removeIndexPage(createIndexPage);
      createResultsPage()

    },3000)

    
  }
  else{ app.listen(3000) }
  
}


init()

