/**
 * Gunnar - Code.js
 *
 * Copyright (C) 2011 Joe McCann 
 *
 * MIT Licensed
 */
/**
 * Dom Ready/Initialize Method
 *
 */
$().ready(function(){
  
  var _results = $('.results')
    , _init = $('.init')
    , _desktop = $('.desktop')
    , _form = $('.form')
    , _storeRackspaceCreds = $('#storeRackspaceCreds')
    , _container_list = $('#container_list')
    , _container_cname = $('#container_cname')
    , _default_checkbox = $('.container_list_container :checkbox')
    , _holder = $('#holder')
    , debug = w.debugging || false

  /**
   * Add <wbr> when needed in a string determined by the number passed in.
   *
   * @param {Number}  The number of space to inclued the <wbr> after. 
   * @return {String} The <wbr>'d string.
   */
  String.prototype.wbr = function(num) {  
  // I borrowed this from Resig:  http://ejohn.org/blog/injecting-word-breaks-with-javascript/
   return this.replace(RegExp('(\\w{' + num + '})(\\w)', 'g'), function(all,text,ch){ 
     return text + '<wbr>' + ch; 
   }) 
  }

  /**
   * Bind click event to the button and call associated handler (bindAuthHandler).
   * 
   * @return void
   */
  function bindAuthButton()
  {
   _storeRackspaceCreds.bind('click', function(e){
     if( this.innerHTML == 'Authenticating...') return false;
     bindAuthHandler();
   });
  }

  /**
   * Bind submit event to the authorization form and call subsequent handler.
   * 
   * @return void
   */
  function bindAuthFormSubmit(){
    $('#rackspaceCredForm').bind('submit', function(e){
      bindAuthHandler()
      return false
    })
  }

  /**
   * Handler for the Authorization form. Grabs the values, does some weak validation and then calls the verifyUser network method.
   * 
   * @return void
   */
  function bindAuthHandler(){
    
    var wrong = false
    
    // Handles the double submit on a styled anchor tag.
    if( _storeRackspaceCreds.text() !== 'Save Credentials') return false

    Gun.ui.toggleAuthButtonText()
    
    // Make sure they are not empty 
    _rackspaceInputs.each(function(){
      var val = $(this).val();
      if(!val)
      {
        wrong = true
        $(this).addClass('error')
      }
      else
      {
        Gun.properties.set(this.id.toLowerCase(), val.replace(_protocol))
      }
    })
    
    if(wrong)
    {
      var wrongHandler = function(){ $('.error:first').focus() }
      
      Gun.ui.toggleAuthButtonText()
      
      // A tad bit of delay before we focus.
      setTimeout( wrongHandler, 350)
      
      Gun
       .properties
         .wipe()
    }
    else
    {
      Gun.network.setAuth()
    }

    return false;
    
  }

  /**
   * Bind change event to select element that contains all the Rackspace containers.
   * 
   * @return void
   */
  function bindContainerList()
  {
    _container_list.chosen().change(function(e){
      
      // Reset the inputs
      resetDefaultAndCname();
      
      // Set the current container value after the change.
      _currentContainer = $(this).find('option:selected').val();

      if( Gun.properties.get('container') != _currentContainer ) 
      {
        $('.default_container_wrapper, .container_cname_default').slideDown();
      }
      else
      {
        $('#default_container').attr('checked',true)
        _container_cname.val( Gun.properties.get('cname') );
        
      }
    })
  }

  /**
   * Bind click event to the default container checkbox.
   * 
   * @return void
   */
  function bindDefaultContainerCheckbox()
  {
    _default_checkbox.bind('click', function(e){
      if($(this).is(':checked'))
      {
        // Make default
        var container = _container_list.find('option:selected').val();
        var cname = _container_cname[0].value || '';
        
        Gun
          .properties
            .set('cname', cname)
            .set('container', container)
      }
      else
      {
        // Remove default
        Gun.properties
          .set('container','')
          .set('cname', '')
          
        resetDefaultAndCname()
      }
    })
  }

  /**
   * Helper method to wipe the default checkbox and CNAME text field.
   * 
   * @return void
   */
  function resetDefaultAndCname()
  {
    _default_checkbox.removeAttr('checked')
    _container_cname.val('')
  }

  /**
   * Bind blur event to the CNAME text input.
   * 
   * @return void
   */
  function bindCnameFieldBlur()
  {
    _container_cname.bind('blur', function(){
      // Check to see it is not empty except when there is some already set
      // meaning, the user is removing the cname to an empty string.
      if(this.value || Gun.properties.get('cname') )
      {
        var container = _container_list.find('option:selected').val()
          , cname = this.value.replace(_protocol, '');
        
        Gun
          .properties
            .set('cname', cname)
            .set('container', container)
        
      }
    })
  }

  /**
   * Bind focus and blur events to the authorization form inputs; show/hide tooltips.
   * 
   * @return void
   */
  function bindRackAuthInputs()
  {
    var hasFocus = false
    
    _rackspaceInputs.bind('focus', function(){
      hasFocus = true
      $(this).removeClass('error')
      $(this).parent().find('.tip').fadeIn(200)
    })

    _rackspaceInputs.bind('blur', function(){
      hasFocus = false
      $(this).parent().find('.tip').fadeOut(200)
    })

    _rackspaceInputs.bind('keyup', function(e){
      if(e.keyCode == 13 && hasFocus){
        bindAuthHandler()
        $(this).blur()
        return false
      } 
    })

  }

  /**
   * Creates the 'Account' menu item in the app's chrome; wires up the reset credentials event which also clears the form values.
   * 
   * @return void
   */
  function createResetCredsMenuItem(){
    var items = [
        {
          name: 'Reset Rackspace Credentials',
          handler: function(){
            Gun.properties.wipe(function(){

              // Reset the fields' values.
              $('#username, #apikey, #container_cname').val('')
              
              $('#host').val('auth.api.rackspacecloud.com')

              $('#default_container').attr('checked',false)

              // Wrap up the activities in a simple function.
              var showAuthCb = function(){

                $('#container_list')
                  .find('option')
                    .remove()
                  .end()
                  .removeClass('chzn-done')

                _currentContainer = '';

                // Delete chosen dropdown.
                $('#container_list_chzn').remove()

                // Apply focus to the first field.
                $('#username').focus()
                
              }
              
              // Show the Auth Form and fire callback.
              if( !$('.authform').is(':visible') ) Gun.ui.showAuthForm( showAuthCb )
              
              alert('Account information successfully reset!')
              
              
            });
          }
        }
      ]

    Gun.menu.create('Account', items)

  }

  /**
   * Main initialization method for Gunnar.
   * 
   * @return void
   */
  function init()
  {
    if(!Ti.Network.online){
      alert('It appears you do not have internet connectivity. Gunnar needs the interwebz to work!')
      return
    }
    
    Gun.spinner = new spinnerModule()
    Gun.network = new networkModule()
    Gun.filesystem = new filesystemModule()
    
    yeahNo()
    bindRackAuthInputs()
    bindAuthFormSubmit()
    
    var dragDropBodyOptions = {
          element: w,
          dragEnter: function(e)
          {
            // We have to only allow the holder area to be droppable.
            if(e.target.id == 'holder')
            {
              e.dataTransfer.dropEffect = 'copy';
              _holder.addClass('drag_enter')
              e.preventDefault();
              return false;
            }
            else
            {
              e.dataTransfer.dropEffect = 'none';
              e.preventDefault();
              return false;
            }
          },
          drop: function(e)
          {
            if(e.target.id == 'holder')
            {
              for (var i = 0; i < e.dataTransfer.files.length; i++){
                
                (function(index){
                  var file = e.dataTransfer.files[i]
                  
                  // I'm leaving this code in here to show how we could use 
                  // the FileReader() api, but Mac OS X 10.6.8 and below don't
                  // have the webkit that supports it.
                  
                    // , reader = new FileReader()

                    Gun.network.uploadFile( file )

                    
                  // reader.onload = function(e){
                  //   Gun.network.uploadFile(file, e.target.result)
                  // };
                  // 
                  // reader.readAsBinaryString(file);
                  
                })(i)                    
              }

              _holder.css('backgroundImage', 'url(\'../img/uploading_bg.png\')')
              _holder.removeClass('drag_enter')
              _holder.addClass('pulsate_out')

              setTimeout(function(){
                _holder.addClass('big_shadow')
              },990)

              e.preventDefault()
              return false
            }
            else
            {
              e.preventDefault()
              return false
            }
          }
        }  

    Gun.filesystem.dragDropFiles(dragDropBodyOptions)


    if(!isTitanium)
    {
      // TODO: Make hosted version?  Maybe when Rackspace has OAUTH
    }
    else
    { 
      
      // TODO: IMPLEMENT THIS. CURRENTLY DOES NOT WORK AS INTENDED
      // Titanium.Network.addConnectivityListener(function(e){
      //   alert('changed')
      //   if(!Ti.Network.online){
      //     alert('It appears you do not have internet connectivity. Gunnar needs the interwebz to work!')
      //   }
      // })
      
      // Listen for the close of the results window.
      d.body.addEventListener(Ti.CLOSE,function(){
        _isResultsCreated = false;
      },false)
      
      // Grab current window.
      _curwin = Ti.UI.getCurrentWindow()

      // Show Inspector
      debug && _curwin.showInspector()

      Gun.ui = new uiModule()

      // Programmatically center the app.
      Gun.ui.centerApp()
      
      createResetCredsMenuItem()
      
      if(Gun.properties.hasCredentials())
      {
        Gun.ui.toggleAuthButtonText()
        Gun.network.setAuth()
      }
      else
      {
        
        // Possibly unnecessary...
        Gun
          .properties
            .wipe()
        
        Gun.ui.showAuthForm()
        bindAuthButton()
        
      }
    } // end else
  } // end init
  
  /** 
   *
   * @namespace uiModule
   */ 
  var uiModule = function(){
    
   // 
   // Construct a new UI module.
   // The UI module encapsulates various methods to position and transition between various views.
   // 
    
    // Should probably change these to be dynamic and not hardcoded.
    var _layout = {
      width: 588,
      height: 486,
      padding: 8
    }
    
    function _getAppWidth(){
      return _curwin.getWidth()
    }
    
    function _getAppHeight(){
      return _curwin.getHeight()
    }
    
    function _getAppX(){
      return _curwin.getX()
    }

    function _getAppY(){
      return _curwin.getY()
    }
    /**
     * @scope uiModule 
     */
    return {
      /**
       * Show the Main upload dashboard view by applying webkit-transition ready classes to particular elements and wiring up certain events.
       *
       * 
       * @return void
       */
      showMainDashboard: function()
      {
        if( _results.is(':visible') ) _results.addClass('none')

        _init.removeClass('fadeIn')
        _init.addClass('fadeOut')

        _init.bind('webkitTransitionEnd', function(e){

          _init.addClass('none')

          _desktop.removeClass('none')
          _desktop.removeClass('fadeOut')
          _desktop.addClass('fadeIn')

          bindContainerList()

          bindDefaultContainerCheckbox()

          bindCnameFieldBlur()

          // Reset the text of the auth button.
          $('#storeRackspaceCreds').text('Save Credentials');

        })
      },
      /**
       * Show the Authorization form by applying webkit-transition ready classes to particular elements.
       *
       * @param {Function} Optional callback
       * @return void
       */
      showAuthForm: function(cb){
        if( _desktop.is(':visible') )
        {
          _desktop.removeClass('fadeIn').addClass('fadeOut')

          _desktop.bind('webkitTransitionEnd', function(){

              _desktop.addClass('none')
              
              // Can't chain here...
              _form.removeClass('fadeOut')
              _form.removeClass('none')
              _form.addClass('visible')
              _form.addClass('fadeIn');

              _form.bind('webkitTransitionEnd', function(){
                _form.unbind('webkitTransitionEnd')
              })
          }) // end webkitTransitionEnd
          bindAuthButton()
          
          cb && cb()
        }
      }, // end showAuthForm
      /**
       * Programmatically set the app's window height.
       *
       * @return void
       */
      setWindowHeight: function(){
        _curwin.setHeight(screen.height-48);
      },
      /**
       * Programmatically center the app on the screen.
       *
       * @return void
       */
      centerApp: function(){
        _curwin.setX( (screen.width/2) - (_layout.width/2) ) // 588 and 486 defined in tiapp.xml
        _curwin.setY( (screen.height/2) - (_layout.height/2) ) // could probably set programmatically, but I'm lazy
      },
      /**
       * Shows the results window and positions it accordingly.  Appends a filelink to results list.
       *
       * @return void
       */
      createResultsWindow: function(filelink){
       
        var appW = _getAppWidth()
          , appH = _getAppHeight()
          , appX = _getAppX()
          , appY = _getAppY()
        
        // console.log('appW: ' + appW)
        // console.log('appH: ' + appH)
        // console.log('appX: ' + appX)
        // console.log('appY: ' + appY)
        // console.log('screen.width: ' + screen.width)
        // console.log('screen.height: ' + screen.height)
       
         var xCoord = ( appX + (appW*2) ) > screen.width 
                        ? ( appX - appW + 200 - _layout.padding )
                        : ( appX + appW + _layout.padding )
      
         var yCoord = ( appY + appH ) > screen.height 
                        ? ( appY - appH )
                        : ( appY )

         // TODO: add this to the tiapp.xml
         _resultsWindow = Titanium.UI.createWindow({
                 id: 'resultsWindow',
                 url: 'app://results.html',
                 x: xCoord,
                 y: yCoord,
                 width: appW - 200,
                 minWidth: appW - 200,
                 maxWidth: appW - 200,
                 height: appH,
                 minHeight: appH,
                 maxHeight: screen.height,
                 maximizable: false,
                 minimizable: true,
                 closeable: true,
                 resizable: true,
                 visible: true,
                 transparency: true
             });
        
        // On load...
        _resultsWindow.addEventListener(Ti.PAGE_INITIALIZED,function(){
          
          // Set the dom fo the results window for access later.
          _resultsDom = _resultsWindow.getDOMWindow();
        
          $(_resultsDom.document.body)
            .find('.fixed_bottom')
              .after(filelink)
          
          // So we don't keep creating the results window.    
          // TODO: Fix.  This is a problem when drag/drop multiple files.
          // Causes a race condition/create multiple results windows.
          _isResultsCreated = true;
        
        },false)
        
        // Listen for the close of the results window.
        _resultsWindow.addEventListener(Ti.CLOSE,function(){
          _isResultsCreated = false;
        },false)
        
        _resultsWindow.open();
        
      },
      /**
       * Updates the results list in the Results window.
       *
       * @return void
       */
      updateResultsWindow: function(filelink){
        $(_resultsDom.document.body)
          .find('.fixed_bottom')
            .after(filelink)
      },       
      /**
       * Toggles the value of the authorization button text.
       *
       * @return void
       */
      toggleAuthButtonText: function(){
        _storeRackspaceCreds.text( _storeRackspaceCreds.text() == 'Authenticating...' 
                                    ? 'Save Credentials' 
                                    : 'Authenticating...' )
      },
      /**
       * Helper method for hiding/showing the mini-spinner on the container list view.
       * 
       * NOTE: AS OF v0.0.1, THIS IS NOT USED, BUT MAY BE USED IN THE FUTURE.
       *
       * @return void
       */
      toggleMiniSpinner: function(){
        _spinner_copy.hasClass('fadeIn') ? _spinner_copy.removeClass('fadeIn') : _spinner_copy.addClass('fadeIn')
      }               
    }
  }
  
  init()

  
}) // end DOM READY
