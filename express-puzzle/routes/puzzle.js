var express = require('express');
var router = express.Router();

/* GET puzzle listing. */
router.post('/', function(req, res, next) {
    console.log("body: "+ req.body.data);
    run("Astar.exe "+req.body.data, function(result) { 
        console.log(result) 
        res.send({"data": result});
    });
});


function run(cmd, callback) {
    var exec = require('child_process').exec;
    var command = exec(cmd);
    var result = '';
    command.stdout.on('data', function(data) {
         result += data.toString();
         console.log(result.length)
    });
    command.on('close', function(code) {
        console.log(result.length)
        return callback(result);
    });
}

module.exports = router;
