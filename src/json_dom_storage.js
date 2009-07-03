(function() {
  if(window.Storage === undefined) {
    throw new NotImplementedError('DOM Storge')
  }
  
  Storage.prototype.getJSON = function(key) {
    return JSON.parse(this[key]);
  } 
  
  Storage.prototype.setJSON = function(key, value) {    
    this[key] = JSON.stringify(value);
    return value;
  }
}())