const url = require('url');
const Koa = require('koa');
//const queryString = require('query-string');

const app = module.exports = new Koa();


const mongoose = require('./libs/mongoose');

const path = require('path');
const fs = require('fs');

const handlers = fs.readdirSync(path.join(__dirname, 'handlers')).sort();

//app.use(cors())




handlers.forEach(handler => require('./handlers/' + handler).init(app));

app.use(async (ctx, next) => {
  const origin = ctx.get('Origin');
//	console.log(origin)
	console.log(ctx.method)
  if (ctx.method !== 'OPTIONS') {
//    ctx.set('Access-Control-Allow-Origin', origin);
    ctx.set('Access-Control-Allow-Origin', origin);
//    ctx.set('Access-Control-Allow-Origin', [https://mirage74.github.io', 'localhost:3000']);
//    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Credentials', 'true');
//    ctx.response.status = 200
  } else if (ctx.get('Access-Control-Request-Method')) {
    ctx.set('Access-Control-Allow-Origin', origin);
//  ctx.set('Access-Control-Allow-Origin', null);
    ctx.set('Access-Control-Allow-Methods', ['GET', 'POST', 'DELETE', 'PUT', 'PATCH']);
    ctx.set('Access-Control-Allow-Headers', 'Content-Type');
    ctx.set('Access-Control-Max-Age', '42');
    ctx.set('Access-Control-Allow-Credentials', 'true');
    ctx.response.status = 200
    console.log('ctx.response.status', ctx.response.status)	
  }
  await next();
});




// can be split into files too
const Router = require('koa-router');
const pick = require('lodash/pick');

const router = new Router({
  prefix: '/users'
});

const User = require('./libs/user');






router

  .param('userById', async (id, ctx, next) => {

    if (id.toLowerCase() == 'find') {
    const url_parts = url.parse(ctx.url, true)
    const query = url_parts.query
    if (query.email) {
	ctx.userById = await User.findOne({email : query.email.toString() },
        function(err, obj) {console.log("obj", obj)})
	}
//    if (query._id) {
//	ctx.userById = await User.findOne({_id : query._id.toString() },
//        function(err, obj) {console.log("obj", obj)})
//	}

}

 else {
    ctx.userById = await User.findById(id);
    }

    if (!ctx.userById) {
      ctx.throw(404);
	}


    await next();
  })

  .post('/', async function(ctx, next) {
    console.log("post, ctx.request.body.data : ", ctx.request.body)
    let user = await User.create(pick(ctx.request.body.data, User.publicFields1));
    ctx.body = user.toObject();
  })

  .put('/:userById',  async function(ctx) {
    console.log("put, ctx.request.body.data : ", ctx.request.body)
//    let user = await User.update(pick(ctx.request.body.data, User.publicFields1));
    let user = await User.updateOne({_id:ctx.userById}, ctx.request.body.data);
    ctx.userById = await User.findById(ctx.userById);
    ctx.body = ctx.userById.toObject()
  })


  .get('/:userById',  async function(ctx) {
    ctx.body = ctx.userById.toObject();
  })

  .del('/:userById',  async function(ctx) {
    await ctx.userById.remove();
    ctx.body = 'ok';
  })

  .get('/', async function(ctx) {
    let users = await User.find({}); // .lean(), but better do it on output
    ctx.body = users.map(user => user.toObject());
  });




app.use(router.routes());
