const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const express = require('express');
const path = require('path');
const cookiesMiddleware = require('universal-cookie-express');
const { nanoid } = require('nanoid');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cookiesMiddleware())
  .use(function (req, res, next) {
    // get the user cookies using universal-cookie
    const session = req.universalCookies.get('session');
    if (session === undefined) {
      req.universalCookies.set('session', nanoid(20), { path: '/' });
    }
    next();
  });
const webpackConfig = require('./webpack.config');
const compiler = webpack(webpackConfig);

if (webpackConfig.mode === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  const routes = require('./routes');
  app.use(routes);
} else {
  app.use(middleware(compiler));
  app.use(hotMiddleware(compiler));

  require('node-hot')
    .configure({
      exclude: [
        /[/\\]node_modules[/\\]/,
      ],
    });

  app.use((req, res, next) => {
    require('./routes').handle(req, res, next);
  });
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

