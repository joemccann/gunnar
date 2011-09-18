/**
 * 
 * A not so extensible, imageless loading animation module.
 *
 * Relies on specific CSS classes to function properly.
 *
 */

/** 
 * @namespace networkModule
 */
var spinnerModule = function(){

   var _spinner = $('.spinner')
  
  /**
   * @scope spinnerModule
   */
   return {
     /**
      * Helper method to show the spinner.
      *
      * @param {Function} An optional callback.
      * @return void
      */
     showOverlaySpinner: function(cb){

       _spinner.removeClass('fadeOut')
       _spinner.removeClass('invisible')
       _spinner.addClass('fadeIn')

       _spinner.bind('webkitTransitionEnd', function(e){

           // probably inefficient, but whatever...
           cb && cb()
           
           // Critical
           _spinner.unbind('webkitTransitionEnd')

       })

       return this
     },
     /**
      * Helper method to hide the spinner.
      *
      * @param {Function} An optional callback.
      * @return void
      */
     hideOverlaySpinner: function(cb){
       
       _spinner.addClass('fadeOut')
       
       _spinner.bind('webkitTransitionEnd', function(e){
         
         // Must do this
         _spinner.unbind('webkitTransitionEnd')
         
         _spinner.removeClass('fadeIn')
         _spinner.addClass('invisible');
       
        })
        
        cb && cb()
       
       return this
     } // end showOverlaySpinner
   } 

}