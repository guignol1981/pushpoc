const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    var exec = require("child_process").exec;

    exec("php " + path.join(__dirname, 'createPushPackage.php'), function
        (error, stdout, stderr) {

        console.debug(error);
        console.debug(stdout);

        res.send(stdout);
    });
});

module.exports = router;
