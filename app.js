const Koa = require('koa');
var Router = require('koa-router');
var bodyParser = require('koa-bodyparser');

const app = new Koa();
var router = new Router();

const db = require('monk')('localhost/bookdb');
const bookList = db.get('bookList');



app.use(bodyParser());
router.get('/getList', async (ctx) => {
    let readingList = await bookList.find({isFinished: false, inTrash: false});
    let trashList = await bookList.find({inTrash: true});
    let finishedList = await bookList.find({isFinished: true, inTrash: false});
    ctx.status = 200;
    ctx.body = {readingList, trashList, finishedList};
});


router.post('/addBook', async (ctx) => {
    let data = await bookList.insert(ctx.request.body);
    ctx.status = 200;
    ctx.body = data;
});



router.get('/deleteBook', async (ctx) => {
    let data = await bookList.remove({_id: ctx.query.id});
    ctx.status = 200;
    ctx.body = data;
});

router.get('/trashBook', async (ctx) => {
    let data = await bookList.update({_id: ctx.query.id}, {$set: {inTrash: true}});
    ctx.status = 200;
    ctx.body = data;
});


router.get('/addProgress', async (ctx) => {
    let data1 = await bookList.findOne({_id: ctx.query.id});
    let todayFinish = parseInt(ctx.query.page);
    if (todayFinish > data1.finishedPages &&
        todayFinish <= data1.totalPages) 
    {
        let data = await bookList.update({_id: ctx.query.id},
                     {$push: {progress: todayFinish - data1.finishedPages}, 
                      $set: {finishedPages: todayFinish, 
                             isFinished: todayFinish == data1.totalPages
                            }
                     });
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


