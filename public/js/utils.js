/*
 * 
 * General utility functions; mainly internal app/debugging use and may not be used in actual app code.
 *
 */

/*
 * Some feature detection AND user agent sniffing much to the chagrin of @fearphage.
 *
 * @return void
 */
function yeahNo()
{
	isTitanium = (typeof window.Titanium === 'object') ? true : false;
	isLocalhost = /(loc|127)/.test(location.hostname);
}

/*
 * Utility method to parse just the filename of a file in its path.
 *
 * @param {String} The path to the file.
 * @return {String}
 */
function getSimpleFileName(pathToFile)
{
  return pathToFile.split("/").pop();
}

/*
 * Utility method to async load a JavaScript file.
 *
 * @param {String} The name of the file to load
 * @param {Function} Optional callback to be executed after the script loads.
 * @return {void}
 */
function asyncLoad(filename,cb)
{
	(function(d,t){
		var g=d.createElement(t),
				s=d.getElementsByTagName(t)[0];
				g.async=1;
  	    g.src= (isLocalhost) ? '/js/'+filename : 'http://change.this.to.your.website.com/js/'+filename;
  	    s.parentNode.insertBefore(g,s)

		// After the script has loaded, let's make the map frame draggable and resizable.
		g.onload = function(){
		  cb && cb()
		}

	}(document,'script'));
	
}
