const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    var exec = require("child_process").exec;

    exec("php createPushPackage.php", function
        (error, stdout, stderr) {
        console.log(error);
        res.send(stdout);
    });
});

module.exports = router;
