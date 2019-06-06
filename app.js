const Koa = require('koa');
var Router = require('koa-router');

const app = new Koa();
var router = new Router();


router.get('/a', (ctx, next) => {
    // ctx.router available

});























app.use(router.routes()).use(router.allowedMethods());


const path = require('path');
const koa_static = require('koa-static');
const staticPath = './static';

app.use(koa_static(
  path.join(__dirname, staticPath)
));


app.listen(8088,function(){
    console.log('Reading Record启动成功');
    console.log('http://localhost:8088');
});


