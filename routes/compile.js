var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:code', function(req, res, next) {
  var code = req.params.code;

  function run_command(cmd, args, cb, end) {
    var spawn = require('child_process').spawn,
        child = spawn(cmd, args),
        me = this;
    child.stdout.on('data', function (buffer) { cb(me, buffer) });
    child.stdout.on('end', end);
  }

  var foo = new run_command(
    'ls', ['-la'],
    function (me, buffer) { me.stdout += buffer.toString() },
    function () { 
          res.send('respond with a resource XXXX'+code+foo.stdout+"end"); 
          //console.log(foo.stdout) 
    }
  );

  
});

module.exports = router;
