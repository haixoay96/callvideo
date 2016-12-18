function name() {
  var point = this;
  point.name = 10;
  setImmediate(function() {
    if(point.name){
      console.log('hello');
    }
  });
}
var x =  new name();
