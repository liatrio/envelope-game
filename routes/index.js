const { Router } = require('express');
const router = Router();

router.get('/foo', (req, res) => res.send('Hello world!'));

module.exports = router;

if (module.hot) {
    module.hot.accept();
}
