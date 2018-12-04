if (process.env.TRACE) {
  require('./libs/trace');
}

const app = require('./app');

app.listen(process.env.PORT || 4000);
//app.listen(4000);
