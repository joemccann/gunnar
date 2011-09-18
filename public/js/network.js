/**
 * Network Module
 * Methods and properties associated with network communication over HTTP.
 *
 */
/** 
 * @namespace networkModule
 */
var networkModule = function(){
  
  var _host = Gun.properties.get('host') || 'auth.api.rackspacecloud.com'
    , _username = Gun.properties.get('username') 
    , _apikey = Gun.properties.get('apikey')
    , _httpClient  = Ti.Network.createHTTPClient()
    , _results = $('.results')
    , _container_list = $('#container_list')


  /**
   * Method iterates through an object and sets the key and its value as a request header for
   * an HTTPClient or XHR instance.
   *
   * @param {HTTPClient Object} An instance of a Titanium HTTPClient Object or XHR.
   * @param {Object} An object hash of header types and their values.
   * @return void
   */
  function _setHeaders(client, headers){ 
    for(var key in headers){ 
      // Ti.API.debug(key + ' is the key')
      // Ti.API.debug(headers[key] + ' is the value')
      client.setRequestHeader(key, headers[key]) 
      
    } 
  }

  /**
   * Handler for the setAuth method call.
   *
   * @param {Error} An error object if there was an error; null if not.
   * @param {Object} A JSON object.
   * @return void
   */
  function _setAuthHandler(err,data,client){
    
   try{
     if(err)
     {
       Gun
         .spinner
           .hideOverlaySpinner(Gun.properties.wipe)
  
           alert('Error in transmission:' + err)
  
           Gun.ui.toggleAuthButtonText()
           _rackspaceInputs.removeAttr('disabled')
           return false
     }
     else
     {
       if(data.status === 401) // unauthorized...
       {
         Gun
           .spinner
             .hideOverlaySpinner(Gun.properties.wipe)

         alert('Unable to authenticate: ' + data.responseText)
             
         if( /bad/i.test(data.responseText) ) $('#username').focus()
         else $('#host').focus()
         
         Gun.ui.toggleAuthButtonText()
         _rackspaceInputs.removeAttr('disabled')
         
         return false
       }
       else
       {
         // Could probably be optimized with a forEach with client.getResponseHeaders()
         Gun.properties.set('authorized','true')
         Gun.properties.set('serverUrl',client.getResponseHeader('x-server-management-url'))
         Gun.properties.set('storageUrl',client.getResponseHeader('x-storage-url'))
         Gun.properties.set('cdnUrl',client.getResponseHeader('x-cdn-management-url'))
         Gun.properties.set('authToken',client.getResponseHeader('x-auth-token'))
         Gun.properties.set('storageToken',client.getResponseHeader('x-storage-token'))

         // Let's the get the containers...
         Gun.network.getContainers()
        
       }
     }
     
   }catch(e){
     Gun
       .spinner
         .hideOverlaySpinner(function(){
           alert('Error in transmission: \n\n' + e)
           Gun.ui.toggleAuthButtonText()
         })
   }

  } // end _setAuthHandler

  /**
   * Obtains either the cname or the CDN URL for a particular container.
   *
   * @param {String} The name of the container.
   * @return {String}
   */
  function _getContainterCdnUrl(container){
    
    if ($('#container_cname').val()) return 'http://' + $('#container_cname').val()
    else{
      var allContainers = JSON.parse(Gun.properties.get('containers'))
      
        var currentContainer = Gun.properties.get('container')
          , uri = ''
      
        allContainers.forEach(function(el,i){
          if( el.name == currentContainer ) uri = el.cdn_uri;
        })
        
        return uri;
    }
  }
  
  /**
   * Handler for the getContainers method call.
   *
   * @param {Error} An error object if there was an error; null if not.
   * @param {Object} A JSON object of data.
   * @param {HTTPClient Object} An HTTPClient Instance.
   * @param {Function} An optional callback.
   * @return void
   */
  function _getContainersHandler(err,data,client,cb){
    
    _rackspaceInputs.removeAttr('disabled')
    
    try{
      var resp = JSON.parse(data.responseText);

        if(err)
        {
          alert('Error: ' + err.message)
          // Gun.ui.toggleMiniSpinner() --> Currently not used.

          $('.desktop')
            .parent()
            .append('<p class="unable_frown">Gunnar is unable to fetch your container from '+
                    'Rackspace.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span frown>:(</span></p>')
            .end()
            .hide()

            // Reset the text of the auth button.
            Gun.ui.toggleAuthButtonText()

        }
        else
        {
            // Gun.ui.toggleMiniSpinner() -> No longer used.

            // Stash all containers. May not be necessary, but so we have them.
            Gun.properties.set('containers', JSON.stringify(resp))

            var list = ''
            resp.forEach(function(el,i){

              // Check for default container (we fetched this data during init)
              if(el.name === Gun.properties.get('container'))
              {
                list += '<option selected="true" value="'+el.name+'">'+el.name+'</option>'
                
                $('#default_container').attr('checked',true)
                $('#container_cname').val( Gun.properties.get('cname') );
                
                _currentContainer = el.name

                Gun.properties.set('uploadUrl', el.cdn_uri)

              }
              else
              {
                list += '<option value="'+el.name+'">'+el.name+'</option>'   
                // If the _currentContainer is set, let's keep it, otherwise just set to the
                // first item  (this could certainly be improved...not really efficient)
                _currentContainer = _currentContainer || resp[0].name;
              }

            }) // end forEach

            _container_list
              .children()
                .remove()
              .end()
              .append(list)        
              
              // Make drop down pretty
              _container_list.chosen()
              
              // So the checkbox is on the right of the box
              // Shitty hax to work with 'chosen' jQuery plugin...
              $('#container_list_chzn').css('float', 'left')
              $('#container_list_chzn').width( $('#container_list_chzn').width() + 2 )
              $('.chzn-search input').width( $('#container_list_chzn').width() - 20 )
              
              Gun
                .spinner
                  .hideOverlaySpinner(Gun.ui.showMainDashboard)
              
                    
        } // end length > 0        
        
      
    }
    catch(e){
      alert(e.message)
    }
    
  }
  
  /**
   * Handler for the getContainer method call.
   *
   * @param {Error} An error object if there was an error; null if not.
   * @param {Object} A JSON object.
   * @return void
   */
   
  function _getContainerHandler(err,data,client,cb){
    
    var resp = JSON.parse(data.responseText)
    
      if(err)
      {
        alert('error')
        // Gun.ui.toggleMiniSpinner() -> No longer used.
        
        $('.desktop')
          .parent()
            .append('<p class="unable_frown">Gunnar is unable to fetch your container from '+
                    'Rackspace.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span frown>:(</span></p>')
          .end()
          .hide() 

          $('.upload').css('display', 'none');

      }
      else
      {
        // console.log('response from get container: ')
        // console.log(data)
        // console.log('\n\n\n' +data.cdnUri+ '\n\n\n')
        cb && cb(null,data)
      } // end length > 0        
    
  }
  /**
   * Handler for the uploadFile method call.
   *
   * @param {Error} An error object if there was an error; null if not.
   * @param {Object} A JSON object.
   * @return void
   */
  function _uploadFileHandler(err,data){
    
      if(err){
        alert('There was an issue uploading: ' + err.message)
      }
      else{
        
        // Get the current uploadUrl
        var cdnUri = _getContainterCdnUrl( _currentContainer || Gun.properties.get('container')  )
          , filename = data.filename
          , fileLink = cdnUri + '/' + filename
          
         $('#holder')
          .removeClass('pulsate_out')
          .removeClass('big_shadow')

         setTimeout(function(){
           
           $(holder).css('backgroundImage', 'url("../img/drag_bg.png")')
          
           _isResultsCreated 
            ? Gun.ui.updateResultsWindow('<p><a target="_blank" href="'+fileLink+'">'+fileLink.wbr(7)+'</a></p>') 
            : Gun.ui.createResultsWindow('<p><a target="_blank" href="'+fileLink+'">'+fileLink.wbr(7)+'</a></p>')
         
         },1)
        
      } // end else
  }

  /**
   * Helper method that concats an arbitrary number of arguments into a 
   * storage url.  
   * 
   * Example _createStorageUrl('containerName','foo.jpg', true)
   *
   * @return void
   */
  function _createStorageUrl(){
    // Example: https://storage101.ord1.clouddrive.com/v1/MossoCloudFS_4620bda8-69f6-49e3-9ce9-a207f32f5d3b
   
     var args = Array.prototype.slice.call(arguments),
         json = (typeof(args[args.length - 1]) === 'boolean') && args.pop();
     return [Gun.properties.get('storageUrl')].concat(args).join('/') + (json ? '?format=json' : '');
  }

  /**
   * Helper method that concats an arbitrary number of arguments into a 
   * cdn url.  
   * 
   * Example _createCdnUrl('containerName,'foo.jpg', true)
   *
   * @return void
   */
  function _createCdnUrl(){
   // Example: https://cdn2.clouddrive.com/v1/MossoCloudFS_4620bda8-69f6-49e3-9ce9-a207f32f5d3b
   var args = Array.prototype.slice.call(arguments),
       json = (typeof(args[args.length - 1]) === 'boolean') && args.pop();
   return [Gun.properties.get('cdnUrl')].concat(args).join('/') + (json ? '?format=json' : '');
  };

  /**
   * Helper method to determine the mime/content type of a file.
   *
   * Borrowed from nodejitsu/indexzero: 
   *
   * http://bit.ly/rkShTD
   *
   * @param {String} The path of the file.
   * @return {String}
   */
  function _getContentType(path){
    var types = {
        '.3gp'   : 'video/3gpp',
        '.a'     : 'application/octet-stream',
        '.ai'    : 'application/postscript',
        '.aif'   : 'audio/x-aiff',
        '.aiff'  : 'audio/x-aiff',
        '.asc'   : 'application/pgp-signature',
        '.asf'   : 'video/x-ms-asf',
        '.asm'   : 'text/x-asm',
        '.asx'   : 'video/x-ms-asf',
        '.atom'  : 'application/atom+xml',
        '.au'    : 'audio/basic',
        '.avi'   : 'video/x-msvideo',
        '.bat'   : 'application/x-msdownload',
        '.bin'   : 'application/octet-stream',
        '.bmp'   : 'image/bmp',
        '.bz2'   : 'application/x-bzip2',
        '.c'     : 'text/x-c',
        '.cab'   : 'application/vnd.ms-cab-compressed',
        '.cc'    : 'text/x-c',
        '.chm'   : 'application/vnd.ms-htmlhelp',
        '.class' : 'application/octet-stream',
        '.com'   : 'application/x-msdownload',
        '.conf'  : 'text/plain',
        '.cpp'   : 'text/x-c',
        '.crt'   : 'application/x-x509-ca-cert',
        '.css'   : 'text/css',
        '.csv'   : 'text/csv',
        '.cxx'   : 'text/x-c',
        '.deb'   : 'application/x-debian-package',
        '.der'   : 'application/x-x509-ca-cert',
        '.diff'  : 'text/x-diff',
        '.djv'   : 'image/vnd.djvu',
        '.djvu'  : 'image/vnd.djvu',
        '.dll'   : 'application/x-msdownload',
        '.dmg'   : 'application/octet-stream',
        '.doc'   : 'application/msword',
        '.dot'   : 'application/msword',
        '.dtd'   : 'application/xml-dtd',
        '.dvi'   : 'application/x-dvi',
        '.ear'   : 'application/java-archive',
        '.eml'   : 'message/rfc822',
        '.eot'   : 'application/vnd.bw-fontobject',
        '.eps'   : 'application/postscript',
        '.exe'   : 'application/x-msdownload',
        '.f'     : 'text/x-fortran',
        '.f77'   : 'text/x-fortran',
        '.f90'   : 'text/x-fortran',
        '.flv'   : 'video/x-flv',
        '.for'   : 'text/x-fortran',
        '.gem'   : 'application/octet-stream',
        '.gemspec' : 'text/x-script.ruby',
        '.gif'   : 'image/gif',
        '.gz'    : 'application/x-gzip',
        '.h'     : 'text/x-c',
        '.hh'    : 'text/x-c',
        '.htm'   : 'text/html',
        '.html'  : 'text/html',
        '.ico'   : 'image/vnd.microsoft.icon',
        '.ics'   : 'text/calendar',
        '.ifb'   : 'text/calendar',
        '.iso'   : 'application/octet-stream',
        '.jar'   : 'application/java-archive',
        '.java'  : 'text/x-java-source',
        '.jnlp'  : 'application/x-java-jnlp-file',
        '.jpeg'  : 'image/jpeg',
        '.jpg'   : 'image/jpeg',
        '.js'    : 'application/javascript',
        '.json'  : 'application/json',
        '.log'   : 'text/plain',
        '.m3u'   : 'audio/x-mpegurl',
        '.m4v'   : 'video/mp4',
        '.man'   : 'text/troff',
        '.mathml' : 'application/mathml+xml',
        '.mbox'  : 'application/mbox',
        '.mdoc'  : 'text/troff',
        '.me'    : 'text/troff',
        '.mid'   : 'audio/midi',
        '.midi'  : 'audio/midi',
        '.mime'  : 'message/rfc822',
        '.mml'   : 'application/mathml+xml',
        '.mng'   : 'video/x-mng',
        '.mov'   : 'video/quicktime',
        '.mp3'   : 'audio/mpeg',
        '.mp4'   : 'video/mp4',
        '.mp4v'  : 'video/mp4',
        '.mpeg'  : 'video/mpeg',
        '.mpg'   : 'video/mpeg',
        '.ms'    : 'text/troff',
        '.msi'   : 'application/x-msdownload',
        '.odp'   : 'application/vnd.oasis.opendocument.presentation',
        '.ods'   : 'application/vnd.oasis.opendocument.spreadsheet',
        '.odt'   : 'application/vnd.oasis.opendocument.text',
        '.ogg'   : 'application/ogg',
        '.p'     : 'text/x-pascal',
        '.pas'   : 'text/x-pascal',
        '.pbm'   : 'image/x-portable-bitmap',
        '.pdf'   : 'application/pdf',
        '.pem'   : 'application/x-x509-ca-cert',
        '.pgm'   : 'image/x-portable-graymap',
        '.pgp'   : 'application/pgp-encrypted',
        '.pkg'   : 'application/octet-stream',
        '.pl'    : 'text/x-script.perl',
        '.pm'    : 'text/x-script.perl-module',
        '.png'   : 'image/png',
        '.pnm'   : 'image/x-portable-anymap',
        '.ppm'   : 'image/x-portable-pixmap',
        '.pps'   : 'application/vnd.ms-powerpoint',
        '.ppt'   : 'application/vnd.ms-powerpoint',
        '.ps'    : 'application/postscript',
        '.psd'   : 'image/vnd.adobe.photoshop',
        '.py'    : 'text/x-script.python',
        '.qt'    : 'video/quicktime',
        '.ra'    : 'audio/x-pn-realaudio',
        '.rake'  : 'text/x-script.ruby',
        '.ram'   : 'audio/x-pn-realaudio',
        '.rar'   : 'application/x-rar-compressed',
        '.rb'    : 'text/x-script.ruby',
        '.rdf'   : 'application/rdf+xml',
        '.roff'  : 'text/troff',
        '.rpm'   : 'application/x-redhat-package-manager',
        '.rss'   : 'application/rss+xml',
        '.rtf'   : 'application/rtf',
        '.ru'    : 'text/x-script.ruby',
        '.s'     : 'text/x-asm',
        '.sgm'   : 'text/sgml',
        '.sgml'  : 'text/sgml',
        '.sh'    : 'application/x-sh',
        '.sig'   : 'application/pgp-signature',
        '.snd'   : 'audio/basic',
        '.so'    : 'application/octet-stream',
        '.svg'   : 'image/svg+xml',
        '.svgz'  : 'image/svg+xml',
        '.swf'   : 'application/x-shockwave-flash',
        '.t'     : 'text/troff',
        '.tar'   : 'application/x-tar',
        '.tbz'   : 'application/x-bzip-compressed-tar',
        '.tci'   : 'application/x-topcloud',
        '.tcl'   : 'application/x-tcl',
        '.tex'   : 'application/x-tex',
        '.texi'  : 'application/x-texinfo',
        '.texinfo' : 'application/x-texinfo',
        '.text'  : 'text/plain',
        '.tif'   : 'image/tiff',
        '.tiff'  : 'image/tiff',
        '.torrent' : 'application/x-bittorrent',
        '.tr'    : 'text/troff',
        '.ttf'   : 'application/x-font-ttf',
        '.txt'   : 'text/plain',
        '.vcf'   : 'text/x-vcard',
        '.vcs'   : 'text/x-vcalendar',
        '.vrml'  : 'model/vrml',
        '.war'   : 'application/java-archive',
        '.wav'   : 'audio/x-wav',
        '.wma'   : 'audio/x-ms-wma',
        '.wmv'   : 'video/x-ms-wmv',
        '.wmx'   : 'video/x-ms-wmx',
        '.woff'  : 'font/woff',
        '.wrl'   : 'model/vrml',
        '.wsdl'  : 'application/wsdl+xml',
        '.xbm'   : 'image/x-xbitmap',
        '.xhtml'   : 'application/xhtml+xml',
        '.xls'   : 'application/vnd.ms-excel',
        '.xml'   : 'application/xml',
        '.xpm'   : 'image/x-xpixmap',
        '.xsl'   : 'application/xml',
        '.xslt'  : 'application/xslt+xml',
        '.yaml'  : 'text/yaml',
        '.yml'   : 'text/yaml',
        '.zip'   : 'application/zip'
      }
    
      var index = String(path).lastIndexOf('.');
      if (!index) {
        return 'text/plain'
      }
      var type = types[path.substring(index).toLowerCase()] || 'text/plain';
      return (/(text|javascript)/).test(type) ? type + '; charset=utf-8' : type;  
  }
  
  /**
   * @scope networkModule 
   */
  return {
    /**
    * Method verifies a set of Rackspace API credentials.
    *
    * @param {String} Path to the file (path provided by Titanium Filesystem methods).
    * @param {String} A name for the file being uploaded (optional).
    * @return void
    */
    setAuth: function() {
      
      // GET /<api version>/<account> HTTP/1.1
      // Host: storage.clouddrive.com
      // X-Auth-Token: eaaafd18-0fed-4b3a-81b4-663c99ec1cb
      // curl -D - -H "X-Auth-User: YOUR_USERNAME" -H "X-Auth-Key: YOUR_AUTH_KEY" \
      //  -X GET https://auth.api.rackspacecloud.com/v1.0
      
      Gun
        .spinner
          .showOverlaySpinner(function(){
            
            _rackspaceInputs.attr('disabled', true)
            
            var authOptions = {
              uri: 'https://' + Gun.properties.get('host') + '/v1.0', 
              headers: {
                'X-Auth-User': Gun.properties.get('username'),
                'X-Auth-Key': Gun.properties.get('apikey')
              }
            }
            
            _httpClient  = Ti.Network.createHTTPClient();

            // TODO:  Update this with more relevant, useful stuff.
            _httpClient.onreadystatechange = function(data){
                if( _httpClient.readyState == 4)
                {
                  // console.log(data)
                  // if(data)
                }
            }

            _httpClient.onload = function(data){
              _setAuthHandler(null, data, _httpClient)
            } 

            _setHeaders(_httpClient, authOptions.headers)

            _httpClient.open('GET', authOptions.uri)
            _httpClient.send()
            
          });
      
    }, // end setAuth
    /**
     * Method that grabs all the user's containers on Rackspace Cloud Files and 
     * passes the response to the handler.
     *
     * @return void
     */  
    getContainers: function(){

      // curl -D -I -H "X-Auth-Token: 3372b7ea-d5fc-416a-a57d-dd53535eddbd" -H "Accept: application/json" \
      //  -X GET https://cdn2.clouddrive.com/v1/MossoCloudFS_4620bda8-69f6-49e3-9ce9-a207f32f5d3b\?format\=json \
      // | jsonpretty

      // Gun.ui.toggleMiniSpinner() -> NO LONGER USED

      var headers = {
        'X-Auth-Token': Gun.properties.get('authToken'),
        'Accept': 'application/json'
      }

      _httpClient = Ti.Network.createHTTPClient();

      _httpClient.onerror = function(err){
        alert('Error with fetching containers: '+ err.message)
      }

      _httpClient.onload = function(data){
        _getContainersHandler(null,data,_httpClient)    
      }

      _setHeaders(_httpClient, headers)

      _httpClient.open('GET', _createCdnUrl(true));
      _httpClient.send()

    },
    
    /**
     * Method that grabs the metadata of a specific container.
     *
     * @return void
     */  
    getContainer : function(container, cb){
      
      var headers = {
        'X-Auth-Token': Gun.properties.get('authToken'),
        'Accept': 'application/json'
      }

      _httpClient = Ti.Network.createHTTPClient();

      _httpClient.onerror = function(){
        alert('Error fetching container: '+ err.message)
      }

      _httpClient.onload = function(data){
        _getContainerHandler(null, data, _httpClient, cb)
      }

      var url = _createCdnUrl(container, true)
      
      _httpClient.open('GET', url );
      _httpClient.send()
      
    }, // end getContainer
    /**
     * Method to upload a file to Rackspace cloud container.
     *
     * @param {Object}  A file object
     * @return void
     */  
    uploadFile: function(file){
      
      // PUT /<api version>/<account>/<container>/<object> HTTP/1.1
      // Host: storage.clouddrive.com
      // X-Auth-Token: 3372b7ea-d5fc-416a-a57d-dd53535eddbd

      // Upload to a storage container:
      // curl -i -X PUT -T /Users/path/to/some/img_foo.jpg \
      // -H "X-Auth-Token: 3372b7ea-d5fc-416a-a57d-dd53535eddbd" \
      // https://storage101.ord1.clouddrive.com/v1/random_string/deleteme/img_foo.jpg
      
      // We must set the content-type header so the browser doesn't automatically download it.
      var headers = {
        'X-Auth-Token': Gun.properties.get('authToken'),
        'Content-Type': _getContentType(file.name),
        'X-File-Name': file.fileName,
        'X-File-Size': file.fileSize,
        'X-File-Type': file.type
      }
      , filename = encodeURIComponent(file.name)
      , url = _createStorageUrl( _currentContainer || Gun.properties.get('container'), filename, false) 
      , xhr = new XMLHttpRequest()

      xhr.open('PUT', url, true)

      // TODO: SERIOUSLY, MAKE THIS BETTER 
      xhr.onreadystatechange = function(evt) {
        if (this.readyState != 4) { return; }
        
        // In order to not change the way errors are handled in _uploadFileHandler
        // we just normalize the error message and append to the event.target object
        if(evt.target.status == 404){
          evt.target.message = 'The page could not be found (404).'
          _uploadFileHandler(evt.target, null)
        }
        else if(evt.target.status == 403){
          evt.target.message = 'Authorization issue with that URL (403).'
          _uploadFileHandler(evt.target, null)
        }
        else
        {
          // Append the filename to the event object
          evt.target.filename = file.fileName
          _uploadFileHandler(null, evt.target)
        }
        
      }
      
      // TODO: IMPLEMENT THIS
      // xhr.onerror = function(evt){
      //   console.log('error')
      //   _uploadFileHandler(evt.target, null)
      // }
      //
      
      _setHeaders(xhr,headers)

      xhr.send(file)

    }
    
  } // end api
  
  
} // end module