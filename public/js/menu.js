/**
 * Methods that work with the Titanium Application's application Menu capabilities.
 *
 */
/**
 * Creates a new menu and adds the items to the menu along with the items associated callbacks.
 *
 * @param {String} The name of the menu.
 * @param {Array} An array of objects containg the menu item name {String} and the callback {Function} associated
 * with the menu item.
 * @return current 'this' value (chainable)
 */
Gun.menu.create = function(menuName, items){
  
  var menu = Titanium.UI.createMenu();
  var toplevelItem = Titanium.UI.createMenuItem(menuName);
  
  // Add each item to the newly created menu and its handler
  items.forEach(function(el,i){
    toplevelItem.addItem(items[i].name, items[i].handler)
  })

  // Append the new top level menu to the rest menubar
  menu.appendItem(toplevelItem);
  Titanium.UI.setMenu(menu);
  
  return this;
}

/**
 * Binds a click event to a menu's item.
 *
 * @param {String} The name of the menu.
 * @param {String} The name of the menu item.
 * @param {Function} The handler to be bound to the menu item.
 * @return void
 */
Gun.menu.wireItem = function(menu, item, callback){
  item.click(callback)
}