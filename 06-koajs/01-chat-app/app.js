const path = require('path');
const Koa = require('koa');
const app = new Koa();


app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let stack = []

router.get('/subscribe', async (ctx, next) => {
    const promise = new Promise((resolve, reject) => {
        stack.push(resolve)

        ctx.res.on('close', () => {
            stack = stack.filter(x => x !== resolve)
            const error = new Error("Connection closed");

            reject(error)
        })
    })
    let msg

    try {
        msg = await promise
    } catch (err) {
        if (err.code === "ECONNRESET") return;
        throw err;
    }

    ctx.body = msg
});

router.post('/publish', async (ctx, next) => {
    let { message: msg } = ctx.request.body


    if (!msg) {
        ctx.throw(400)
    }
    stack.forEach((resolve) => {
        resolve(msg)
    })

    stack = []

    ctx.body = 'success'

});

app.use(router.routes());

module.exports = app;
