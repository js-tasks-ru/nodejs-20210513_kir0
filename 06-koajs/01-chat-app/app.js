const path = require('path');
const Koa = require('koa');
const app = new Koa();


app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let stack = []

router.get('/subscribe', async (ctx, next) => {
    await new Promise(connect => {
        stack.push(connect)
    })
});

router.post('/publish', async (ctx, next) => {
    let { message: msg } = ctx.request.body
    stack.forEach((resolve) => {
        resolve(msg)
    })

    stack = []

    ctx.body = 'success'

});

app.use(router.routes());

module.exports = app;
