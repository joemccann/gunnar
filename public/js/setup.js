/**
 * 
 * Initialization and global setup of properties and variables.
 *
 */
 
var debug = false;

Gun = {}

Gun.properties = {}

Gun.network = {}

Gun.menu = {}

Gun.ui = {}

var w = window
  , d = document
  , isTitanium = false
  , db
  , _curwin                     // capture the current Main window 
  , _resultsWindow              // capture the results Titanium User Window
  , _resultsDom                 // capture the DOM of the results window
  , _isResultsCreated          // flag used when updating the results window
  , _currentContainer = ""      // the value set when the container list changes by user selection.
  , _protocol = /^(http|https):\/\//
  , Ti = Titanium
  , _rackspaceInputs = $('#rackspaceCredForm').find('input') // grab these for use in code.js and network.js
