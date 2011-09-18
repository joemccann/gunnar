/**
 * Methods that work with the Titanium Application's key/value store, the app properties.
 *
 */
/**
 * Gets an app property.
 *
 * @param {String} Key name to retrieve.
 * @return {String} The value of the key.
 */
Gun.properties.get = function(key)
{
  return Ti.App.Properties.getString(key, '');
}

/*
 * Sets an app property.
 *
 * @param {String} Key name to store
 * @param {String} The value of the key to store.
 * @return current 'this' value (chainable)
 */
Gun.properties.set = function(key,value)
{
  Ti.App.Properties.setString(key, value);
  return this
}

/*
 * Checks to see if the user's credentials are stashed in the app properties.
 *
 * @return {Boolean}
 */
Gun.properties.hasCredentials = function()
{
  return Gun.properties.get('username') && Gun.properties.get('apikey') && Gun.properties.get('host')
}

/*
 * Resets all property values to the empty string.
 *
 * @param {Function} An optional callback.
 * @return current 'this' value (chainable)
 */
Gun.properties.wipe = function(cb)
{
  var allProps = Ti.App.Properties.listProperties()
  
  allProps.forEach(function(el,i){
    Gun
      .properties
        .set(el,'')
  })

  cb && cb();
  
  return this;
}

/*
 * Output all property keys and values to the console.
 *
 * @param {Function} An optional callback.
 * @return current 'this' value (chainable)
 */
Gun.properties.list = function(cb)
{
  var allProps = Ti.App.Properties.listProperties()
  
  allProps.forEach(function(el,i){
    console.log(el + " : " + Gun.properties.get(el) )
  })

  cb && cb();
  
  return this;
}
