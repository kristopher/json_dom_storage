(function() {
  if(Storage === undefined) {
    throw new NotImplementedError('DOM Storge')
  }
  
  Storage.prototype.getJSON = function(key) {
    return JSON.parse(this[key]);
  } 
  
  Storage.prototype.setJSON = function(key, value) {    
    this.setItem(key, JSON.stringify(value);
  }
}.call(window))