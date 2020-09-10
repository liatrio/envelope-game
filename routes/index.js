const { Router } = require('express');
const {path} = require('path');

const router = Router();

router.get('/foo', (req, res) => res.send('Hello world!'));
//router.get('/Gamearea', (req, res) => res.sendFile(path.normalize('/../react/index.html')));

module.exports = router;

if (module.hot) {
    module.hot.accept();
}
