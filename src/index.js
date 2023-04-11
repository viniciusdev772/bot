const connect = require('./connections')
const middlewares = require('./middlewars')

async function start(){
    const bot = await connect();
    await middlewares(bot)
}

start();