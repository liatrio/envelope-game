console.log('Server-side code running');

var express = require(‘express’);
var port = process.env.PORT || 3000;
var app = express();
// serve files from the public directory
app.use(express.static('public'));

app.listen(port, function () {
 console.log(`Example app listening on port !`);
});

// serve the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
