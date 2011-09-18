$(function(){
  /**
   * Bind click event results clear button to remove the list of links which are appended after files have been uploaded.
   * @return void
   */
  function bindClearButton(){
    $('.fixed_bottom').bind('click', function(){
      $('.results p').remove();
      return false;
    })
  }
  
  function init(){
    bindClearButton();
  }
  
  init()
})