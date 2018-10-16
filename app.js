console.log('Server-side code running');
var express = require('express');
var port = process.env.PORT || 3000;
var app = express();
app.get('/', (req, res) => {
    res.sendFile('/public/index.html');
});
app.listen(port, function () {
 console.log('App running on port: '+port);
});
