/**
 * File System Module
 * Methods and properties associated file I/O.
 *
 */
/** 
 * @namespace filesystemModule
 */
var filesystemModule = function(){
  /** 
   *  
   * @scope filesystemModule
   */
  return {
    /**
     * Wires up the drag/drop area area.
     *
     * @param {Object} Options hash including the element to bind and the associated handlers.
     * @return void
     */
    dragDropFiles: function(options)
    {
      var _el = options.element
        , _dragEnter = options.dragEnter
        , _drop = options.drop

      _el.ondragover = _el.ondragenter = _dragEnter;
      _el.ondrop = _drop;
    },
    /**
     * Event handler for used for the "Pick a file and upload" button. Opens the file chooser dialog and uploads the file(s).
     *
     * NOTE: THE ACTUAL BUTTON WAS REMOVED BUT COULD EASILY BE ADDED BACK IN.
     *
     * @return void
     */
    browseForFile: function()
    { 

      // Browse file and upload it as callback.
      _curwin.openFileChooserDialog(function(files){ 

          if(!files.length) return false;

          Gun.network.uploadFile( Ti.Filesystem.getFile(files[0]) )

          //files.forEach( function(el,i){ Gun.network.uploadFile( Ti.Filesystem.getFile(el.path) ) } ) 

      }); 
    }
    
  }
  
}
