Screw.Unit(function(c) { with(c) {
  describe('localStorage', function() {
    before(function() {
      localStorage.setJSON('json_dom_storage', { test: 'value' })
    });

    after(function() {
      localStorage.removeItem('json_dom_storage');
    })

    describe('setJSON', function() {
      it("should set the key with the value as a json string", function() {
        expect(localStorage.getItem('json_dom_storage')).to(equal, '{"test":"value"}')
      }); 
    });

    describe('getJSON', function() {
      it("should return the keys value as a json object", function() {
        expect(localStorage.getJSON('json_dom_storage')).to(equal, { test: 'value' })
      });
    });    
  })

  // The following tests will fail in firefox 3.5 because of the file:// scheme
  // See bug report below for more info.
  // https://bugzilla.mozilla.org/show_bug.cgi?id=357323 
  describe('sessionStorage', function() {
    before(function() {
      sessionStorage.setJSON('json_dom_storage', { test: 'value' })
    });
      
    after(function() {
      sessionStorage.removeItem('json_dom_storage');
    })
      
    describe('setJSON', function() {
      it("should set the key with the value as a json string", function() {
        expect(sessionStorage.getItem('json_dom_storage')).to(equal, '{"test":"value"}')
      }); 
    });
      
    describe('getJSON', function() {
      it("should return the keys value as a json object", function() {
        expect(sessionStorage.getJSON('json_dom_storage')).to(equal, { test: 'value' })
      });
    });    
  })
  
}});