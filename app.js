const Koa = require('koa');
var Router = require('koa-router');
var bodyParser = require('koa-bodyparser');

const app = new Koa();
var router = new Router();

const db = require('monk')('localhost/bookdb');
const bookList = db.get('bookList');



app.use(bodyParser());
router.get('/getList', async (ctx) => {
    let list = await bookList.find();
    if (list) {
        ctx.status = 200;
        ctx.body = list;
    }
});


router.post('/addBook', async (ctx) => {
    let data = await bookList.insert(ctx.request.body);
    if (data) {
        ctx.status = 200;
        ctx.body = data;
    }
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


