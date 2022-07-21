(window.webpackJsonp=window.webpackJsonp||[]).push([[93],{425:function(e,n,t){"use strict";t.r(n);var s=t(10),r=Object(s.a)({},(function(){var e=this,n=e._self._c;return n("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[n("h1",{attrs:{id:"node进阶-之事无巨细手写koa源码"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#node进阶-之事无巨细手写koa源码"}},[e._v("#")]),e._v(" node进阶——之事无巨细手写koa源码")]),e._v(" "),n("p",[e._v("koa是一个基于nodejs的web开发框架，特点是小而精，对比大而全的express，两者虽然由同一团队开发，但各有其更适合的应用场景：express适合开发较大的企业级应用，而koa致力于成为web开发中的基石，例如egg.js就是基于koa开发的。")]),e._v(" "),n("p",[e._v("关于两个框架的区别和联系，后期我会再写一篇express源码解析，这里不赘述。本文的主要目的如下：\nkoa官网上说：“koa提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序”。这套优雅的方法是什么？是如何实现的？让我们一探究竟，并手写源码。")]),e._v(" "),n("p",[e._v("过去我不了解太阳，那时我过的是冬天——聂鲁达")]),e._v(" "),n("p",[e._v("傻瓜式用法\nkoa的用法可以说非常傻瓜，我们快速过一下：\n首先映入眼帘的不是假山，是hello world\nconst Koa = require('koa');\nconst app = new Koa();")]),e._v(" "),n("p",[e._v("app.use((ctx, next) => {\nctx.body = 'Hello World';\n});")]),e._v(" "),n("p",[e._v("app.listen(3000);\n复制代码\n不用框架时的写法\nlet http = require('http')")]),e._v(" "),n("p",[e._v("let server = http.createServer((req, res) => {\nres.end('hello world')\n})")]),e._v(" "),n("p",[e._v("server.listen(4000)\n复制代码\n对比发现，相对原生，koa多了两个实例上的use、listen方法，和use回调中的ctx、next两个参数。这四个不同，几乎就是koa的全部了，也是这四个不同让koa如此强大。\nlisten\n简单！http的语法糖，实际上还是用了http.createServer()，然后监听了一个端口。\nctx\n比较简单！利用 上下文(context) 机制，将原来的req,res对象合二为一，并进行了大量拓展,使开发者可以方便的使用更多属性和方法，大大减少了处理字符串、提取信息的时间，免去了许多引入第三方包的过程。(例如ctx.query、ctx.path等)\nuse\n重点！koa的核心 —— 中间件（middleware）。解决了异步编程中回调地狱的问题，基于Promise，利用 洋葱模型 思想，使嵌套的、纠缠不清的代码变得清晰、明确，并且可拓展，可定制，借助许多第三方中间件，可以使精简的koa更加全能（例如koa-router，实现了路由）。其原理主要是一个极其精妙的 compose 函数。在使用时，用 next() 方法，从上一个中间件跳到下一个中间件。\n注：以上加粗部分，下面都有详细介绍。\n源码\nkoa有多简单？简单到只有四个文件，算上大量的空行和注释，加起来不到1800行代码（有用的也就几百行）。\ngithub.com/koajs/koa/t…")]),e._v(" "),n("p",[e._v("所以，学习koa源码并不是一个痛苦的过程。豪不夸张的说，搞定这四个文件，手写下面的100多行代码，你就能完全理解koa。为了防止大段代码的出现，我会讲的很详细。\n准备工作\n模仿官方，我们建立一个koa文件夹，并创建四个文件：application.js，context.js，request.js，response.js。\n通过查看package.json可以发现，application.js为入口文件。")]),e._v(" "),n("p",[e._v("context.js是上下文对象相关，request.js是请求对象相关，response.js是响应对象相关。")]),e._v(" "),n("p",[e._v("首先，梳理一下思路，原理无非就是use的时候拿到一个回调函数，listen的时候执行这个函数。")]),e._v(" "),n("p",[e._v("此外，use回调函数的参数ctx拓展了很多功能，这个ctx其实就是原生的req、res经过一系列处理产生的。")]),e._v(" "),n("p",[e._v("其实，第一句不准确，use可以多次，所以是多个回调函数，用户第二个参数next()跳到下一个，把多个use的回调函数按照规则顺序执行。")]),e._v(" "),n("p",[e._v("那么，看起来就很简单了，难点只有两个：一个是如何将原生req和res加工成ctx，另一个是如何实现中间件。")]),e._v(" "),n("p",[e._v("第一个，ctx其实就是一个上下文对象，request和response两个文件用来拓展属性，context文件实现代理，我们会手写相关源码。")]),e._v(" "),n("p",[e._v("第二个，源码中的中间件由一个中间件执行模块koa-compose实现，这里我们会手写一个。")]),e._v(" "),n("p",[e._v("application.js\n结合上面hello world，可以明确，koa是一个类,实例上主要两个方法，use和listen。\n上面说过，listen是http的语法糖，所以要引入http模块。\nKoa有一套错误处理机制,需要监听实例的error事件。所以要引入events模块继承EventEmitter。再引入另外三个自定义模块。\nlet http = require('http')\nlet EventEmitter = require('events')\nlet context = require('./context')\nlet request = require('./request')\nlet response = require('./response')")]),e._v(" "),n("p",[e._v("class Koa extends EventEmitter {\nconstructor () {\nsuper()\n}\nuse () {")]),e._v(" "),n("p",[e._v("}\nlisten () {")]),e._v(" "),n("p",[e._v("}\n}")]),e._v(" "),n("p",[e._v("module.exports = Koa\n复制代码\n这三个模块，其实都是一个对象，为了代码能跑通，这里先简单导出一下。\ncontext.js\nlet proto = {} // proto同源码定义的变量名\nmodule.exports = proto\n复制代码\nrequest.js\nlet request = {}\nmodule.exports = request\n复制代码\nresponse.js\nlet response = {}\nmodule.exports = response\n复制代码\n开始写Koa类里面的代码，先实现创建服务的功能：1、listen方法创建一个http服务并监听一个端口。2、use方法把回调传入。\nclass Koa extends EventEmitter {\nconstructor () {\nsuper()\nthis.fn\n}\nuse (fn) {\nthis.fn = fn // 用户使用use方法时，回调赋给this.fn\n}\nlisten (...args) {\nlet server = http.createServer(this.fn) // 放入回调\nserver.listen(...args) // 因为listen方法可能有多参数，所以这里直接解构所有参数就可以了\n}\n}\n复制代码\n这样就可以启动一个服务了，测试一下：\nlet Koa = require('./application')\nlet app = new Koa()")]),e._v(" "),n("p",[e._v("app.use((req, res) => { // 还没写中间件，所以这里还不是ctx和next\nres.end('hello world')\n})")]),e._v(" "),n("p",[e._v("app.listen(3000)\n复制代码\n下面先解决ctx，ctx是一个上下文对象，里面绑定了很多请求和相应相关的数据和方法，例如ctx.path、ctx.query、ctx.body()等等等等，极大的为开发提供了便利。\n思路是这样的：用户调用use方法时，把这个回调fn存起来，创建一个createContext函数用来创建上下文，创建一个handleRequest函数用来处理请求，用户listen时将handleRequest放进createServer回调中，在函数内调用fn并将上下文对象传入，用户就得到了ctx。\nclass Koa extends EventEmitter {\nconstructor () {\nsuper()\nthis.fn\nthis.context = context // 将三个模块保存，全局的放到实例上\nthis.request = request\nthis.response = response\n}\nuse (fn) {\nthis.fn = fn\n}\ncreateContext(req, res){ // 这是核心，创建ctx\n// 使用Object.create方法是为了继承this.context但在增加属性时不影响原对象\nconst ctx = Object.create(this.context)\nconst request = ctx.request = Object.create(this.request)\nconst response = ctx.response = Object.create(this.response)\n// 请仔细阅读以下眼花缭乱的操作，后面是有用的\nctx.req = request.req = response.req = req\nctx.res = request.res = response.res = res\nrequest.ctx = response.ctx = ctx\nrequest.response = response\nresponse.request = request\nreturn ctx\n}\nhandleRequest(req,res){ // 创建一个处理请求的函数\nlet ctx = this.createContext(req, res) // 创建ctx\nthis.fn(ctx) // 调用用户给的回调，把ctx还给用户使用。\nres.end(ctx.body) // ctx.body用来输出到页面，后面会说如何绑定数据到ctx.body\n}\nlisten (...args) {\nlet server = http.createServer(this.handleRequest.bind(this))// 这里使用bind调用，以防this丢失\nserver.listen(...args)\n}\n}\n复制代码")]),e._v(" "),n("p",[e._v("如果不理解Object.create可以看这个例子：\nlet o1 = {a: 'hello'}\nlet o2 = Object.create(o1)\no2.b = 'world'\nconsole.log('o1:', o1.b) // 创建出的对象不会影响原对象\nconsole.log('o2:', o2.a) // 创建出的对象会继承原对象的属性\n复制代码")]),e._v(" "),n("p",[e._v("o1: undefined\no2: hello")]),e._v(" "),n("p",[e._v("经过上面的操作，用户在ctx上可以用各种姿势取到想要的值。\n例如url，可以用ctx.req.url、ctx.request.req.url、ctx.response.req.url取到。\napp.use((ctx) => {\nconsole.log(ctx.req.url)\nconsole.log(ctx.request.req.url)\nconsole.log(ctx.response.req.url)\nconsole.log(ctx.request.url)\nconsole.log(ctx.request.path)\nconsole.log(ctx.url)\nconsole.log(ctx.path)\n})\n复制代码\n访问localhost:3000/abc")]),e._v(" "),n("p",[e._v("/abc\n/abc\n/abc\n/undefined\n/undefined\n/undefined\n/undefined")]),e._v(" "),n("p",[e._v("姿势多，不一定爽，要想爽，我们希望能实现以下两点：")]),e._v(" "),n("p",[e._v("从自定义的request上取值、拓展除了\b原生属性外的更多属性，例如query \bpath等。\n能够直接通过ctx.url的方式取值，上面都不够方便。")]),e._v(" "),n("p",[e._v("1 修改request\nrequest.js\nlet url = require('url')\nlet request = {\nget url() { // 这样就可以用ctx.request.url上取值了，不用通过原生的req\nreturn this.req.url\n},\nget path() {\nreturn url.parse(this.req.url).pathname\n},\nget query() {\nreturn url.parse(this.req.url).query\n}\n// 。。。。。。\n}\nmodule.exports = request\n复制代码\n非常简单，使用对象get访问器返回一个处理过的数据就可以将数据绑定到request上了，这里的问题是如何拿到数据，由于前面ctx.request这一步，所以this就是ctx，那this.req就是原生的req，再利用一些第三方模块对req进行处理就可以了，源码上拓展了非常多，这里只举例几个，看懂原理即可。\n访问localhost:3000/abc?id=1")]),e._v(" "),n("p",[e._v("/abc?id=1\n/abc?id=1\n/abc?id=1\n/abc?id=1\n/abc\nundefined\nundefined")]),e._v(" "),n("p",[e._v("2 接下来要实现ctx直接取值，这里是通过一个代理来实现的\ncontext.js\nlet proto = {")]),e._v(" "),n("p",[e._v("}\nfunction defineGetter(prop, name){ // 创建一个defineGetter函数，参数分别是要代理的对象和对象上的属性\nproto."),n("strong",[e._v("defineGetter")]),e._v("(name, function(){ // 每个对象都有一个__defineGetter__方法，可以用这个方法实现代理，下面详解\nreturn this[prop][name] // 这里的this是ctx（原因下面解释），所以ctx.url得到的就是this.request.url\n})\n}\ndefineGetter('request', 'url')\ndefineGetter('request', 'path')\n// .......\nmodule.exports = proto\n复制代码\n访问localhost:3000/abc?id=1")]),e._v(" "),n("p",[e._v("/abc?id=1\n/abc?id=1\n/abc?id=1\n/abc?id=1\n/abc\n/abc?id=1\n/abc")]),e._v(" "),n("p",[e._v("__defineGetter__方法可以将一个函数绑定在当前对象的指定属性上，当那个属性的值被读取时，你所绑定的函数就会被调用，第一个参数是属性，第二个是函数，由于ctx继承了proto，所以当ctx.url时，触发了__defineGetter__方法，所以这里的this就是ctx。这样，当调用defineGetter方法，就可以将参数一的参数二属性代理到ctx上了。\n有个问题，要代理多少个属性就要调用多少遍defineGetter函数么？是的，如果想优雅一点，可以模仿官方源码，提出一个delegates模块，批量代理（其实也没优雅到哪去），这里为了方便展示，还是看懂即可吧。\n3 修改response。根据koa的api，输出数据到页面不是res.end('xx')也不是res.send('xx')，而是ctx.body = 'xx'。我们要实现设置ctx.body，还要实现获取ctx.body。\nresponse.js\nlet response = {\nget body(){\nreturn this._body // get时返回出去\n},\nset body(value){\nthis.res.statusCode = 200 // 只要设置了body，就应该把状态码设置为200\nthis._body = value // set时先保存下来\n}\n}\nmodule.exports = response\n复制代码\n这样得到的是ctx.response.body，并不是ctx.body，同样，通过context代理一下\n修改context\nlet proto = {")]),e._v(" "),n("p",[e._v("}\nfunction defineGetter (prop, name) {\nproto."),n("strong",[e._v("defineGetter")]),e._v("(name, function(){\nreturn this[prop][name]\n})\n}\nfunction defineSetter (prop, name) {\nproto."),n("strong",[e._v("defineSetter")]),e._v("(name, function(val){ // 用__defineSetter__方法设置值\nthis[prop][name] = val\n})\n}\ndefineGetter('request', 'url')\ndefineGetter('request', 'path')\ndefineGetter('response', 'body') // 同样代理response的body属性\ndefineSetter('response', 'body') // 同理\nmodule.exports = proto\n复制代码\n测试一下\napp.use((ctx) => {\nctx.body = 'hello world'\nconsole.log(ctx.body)\n})\n复制代码\n访问localhost:3000\nnode控制台输出：")]),e._v(" "),n("p",[e._v("hello world")]),e._v(" "),n("p",[e._v("网页显示：hello world\n接下来解决一下body的问题，上面说了，一旦给body设置值，状态码就改成200，那么没设置值就应该是404。还有，用户不光会输出字符串，还有可能是文件、页面、json等，这里都要处理，所以改一下handleRequest函数：\nlet Stream = require('stream') // 引入stream\nhandleRequest(req,res){\nres.statusCode = 404 // 默认404\nlet ctx = this.createContext(req, res)\nthis.fn(ctx)\nif(typeof ctx.body == 'object'){ // 如果是个对象，按json形式输出\nres.setHeader('Content-Type', 'application/json;charset=utf8')\nres.end(JSON.stringify(ctx.body))\n} else if (ctx.body instanceof Stream){ // 如果是流\nctx.body.pipe(res)\n}\nelse if (typeof ctx.body === 'string' || Buffer.isBuffer(ctx.body)) { // 如果是字符串或buffer\nres.setHeader('Content-Type', 'text/htmlcharset=utf8')\nres.end(ctx.body)\n} else {\nres.end('Not found')\n}\n}\n复制代码\n这样上下文相关就实现了，接下来看重中之重：中间件\n现在只能use一次，我们要实现use多次，并可以在use的回调函数中使用next方法跳到下一个中间件，在此之前，我们先了解一个概念：“洋葱模型”。")]),e._v(" "),n("p",[e._v("当我们多次使用use时\napp.use((crx, next) => {\nconsole.log(1)\nnext()\nconsole.log(2)\n})\napp.use((crx, next) => {\nconsole.log(3)\nnext()\nconsole.log(4)\n})\napp.use((crx, next) => {\nconsole.log(5)\nnext()\nconsole.log(6)\n})\n复制代码\n它的执行顺序是这样的：")]),e._v(" "),n("p",[e._v("1\n3\n5\n6\n4\n2")]),e._v(" "),n("p",[e._v("next方法会调用下一个use，next下面的代码会在下一个use执行完再执行，我们可以把上面的代码想象成这样：\napp.use((ctx, next) => {\nconsole.log(1)\n// next()  被替换成下一个use里的代码\nconsole.log(3)\n// next()  又被替换成下一个use里的代码\nconsole.log(5)\n// next()  没有下一个use了，所以这个无效\nconsole.log(6)\nconsole.log(4)\nconsole.log(2)\n})\n复制代码\n这样的话，理所应当输出135642\n这就是洋葱模型了，通过next把执行权交给下一个中间件。\n这样，开发者手中的请求数据会像仪仗队一样，乖乖的经过每一层中间件的检阅，最后响应给用户。\n既应付了复杂的操作，又避免了混乱的嵌套。\n除此之外，koa的中间件还支持异步，可以使用async/await\napp.use(async (ctx, next) => {\nconsole.log(1)\nawait next()\nconsole.log(2)\n})\napp.use(async (ctx, next) => {\nconsole.log(3)\nlet p = new Promise((resolve, roject) => {\nsetTimeout(() => {\nconsole.log('3.5')\nresolve()\n}, 1000)\n})\nawait p.then()\nawait next()\nconsole.log(4)\nctx.body = 'hello world'\n})\n复制代码")]),e._v(" "),n("p",[e._v("1\n3\n//  一秒后\n3.5\n4\n2")]),e._v(" "),n("p",[e._v("async函数返回的是一个promise，当上一个use的next前加上await关键字，会等待下一个use的回调resolve了再继续执行代码。\n所有现在要做的事有两步：\n第一步，让多个use的回调按照顺序排列成串。\n这里用到了数组和递归，每次use将当前函数存到一个数组中，最后按顺序执行。执行这一步用到一个compose函数，这个函数是重中之重。\nconstructor () {\nsuper()\n// this.fn  改成：\nthis.middlewares = [] // 需要一个数组将每个中间件按顺序存放起来\nthis.context = context\nthis.request = request\nthis.response = response\n}\nuse (fn) {\n// this.fn = fn 改成：\nthis.middlewares.push(fn) // 每次use，把当前回调函数存进数组\n}\ncompose(middlewares, ctx){ // 简化版的compose，接收中间件数组、ctx对象作为参数\nfunction dispatch(index){ // 利用递归函数将各中间件串联起来依次调用\nif(index === middlewares.length) return // 最后一次next不能执行，不然会报错\nlet middleware = middlewares[index] // 取当前应该被调用的函数\nmiddleware(ctx, () => dispatch(index + 1)) // 调用并传入ctx和下一个将被调用的函数，用户next()时执行该函数\n}\ndispatch(0)\n}\nhandleRequest(req,res){\nres.statusCode = 404\nlet ctx = this.createContext(req, res)\n// this.fn(ctx) 改成：\nthis.compose(this.middlewares, ctx) // 调用compose，传入参数\nif(typeof ctx.body == 'object'){\nres.setHeader('Content-Type', 'application/json;charset=utf8')\nres.end(JSON.stringify(ctx.body))\n} else if (ctx.body instanceof Stream){\nctx.body.pipe(res)\n}\nelse if (typeof ctx.body === 'string' || Buffer.isBuffer(ctx.body)) {\nres.setHeader('Content-Type', 'text/htmlcharset=utf8')\nres.end(ctx.body)\n} else {\nres.end('Not found')\n}\n}\n复制代码\n再次测试上面打印123456的例子，可以正确的得到135642\n第二步，把每个回调包装成Promise以实现异步。\n最后一步，用Promise.resolve将每个回调包装成Promise，并在调用时then，不懂Promise的可以去看我的另一篇文章[juejin.im/post/684490…]\ncompose(middlewares, ctx){\nfunction dispatch(index){\nif(index === middlewares.length) return Promise.resolve() // 若最后一个中间件，返回一个resolve的promise\nlet middleware = middlewares[index]\nreturn Promise.resolve(middleware(ctx, () => dispatch(index + 1))) // 用Promise.resolve把中间件包起来\n}\nreturn dispatch(0)\n}\nhandleRequest(req,res){\nres.statusCode = 404\nlet ctx = this.createContext(req, res)\nlet fn = this.compose(this.middlewares, ctx)\nfn.then(() => { // then了之后再进行判断\nif(typeof ctx.body == 'object'){\nres.setHeader('Content-Type', 'application/json;charset=utf8')\nres.end(JSON.stringify(ctx.body))\n} else if (ctx.body instanceof Stream){\nctx.body.pipe(res)\n}\nelse if (typeof ctx.body === 'string' || Buffer.isBuffer(ctx.body)) {\nres.setHeader('Content-Type', 'text/htmlcharset=utf8')\nres.end(ctx.body)\n} else {\nres.end('Not found')\n}\n}).catch(err => { // 监控错误发射error，用于app.on('error', (err) =>{})\nthis.emit('error', err)\nres.statusCode = 500\nres.end('server error')\n})\n}\n复制代码\n完整application代码\nlet http = require('http')\nlet EventEmitter = require('events')\nlet context = require('./context')\nlet request = require('./request')\nlet response = require('./response')\nlet Stream = require('stream')\nclass Koa extends EventEmitter {\nconstructor () {\nsuper()\nthis.middlewares = []\nthis.context = context\nthis.request = request\nthis.response = response\n}\nuse (fn) {\nthis.middlewares.push(fn)\n}\ncreateContext(req, res){\nconst ctx = Object.create(this.context)\nconst request = ctx.request = Object.create(this.request)\nconst response = ctx.response = Object.create(this.response)\nctx.req = request.req = response.req = req\nctx.res = request.res = response.res = res\nrequest.ctx = response.ctx = ctx\nrequest.response = response\nresponse.request = request\nreturn ctx\n}\ncompose(middlewares, ctx){\nfunction dispatch (index) {\nif (index === middlewares.length) return Promise.resolve()\nlet middleware = middlewares[index]\nreturn Promise.resolve(middleware(ctx, () => dispatch(index + 1)))\n}\nreturn dispatch(0)\n}\nhandleRequest(req,res){\nres.statusCode = 404\nlet ctx = this.createContext(req, res)\nlet fn = this.compose(this.middlewares, ctx)\nfn.then(() => {\nif (typeof ctx.body == 'object') {\nres.setHeader('Content-Type', 'application/json;charset=utf8')\nres.end(JSON.stringify(ctx.body))\n} else if (ctx.body instanceof Stream) {\nctx.body.pipe(res)\n} else if (typeof ctx.body === 'string' || Buffer.isBuffer(ctx.body)) {\nres.setHeader('Content-Type', 'text/htmlcharset=utf8')\nres.end(ctx.body)\n} else {\nres.end('Not found')\n}\n}).catch(err => {\nthis.emit('error', err)\nres.statusCode = 500\nres.end('server error')\n})\n}\nlisten (...args) {\nlet server = http.createServer(this.handleRequest.bind(this))\nserver.listen(...args)\n}\n}")]),e._v(" "),n("p",[e._v("module.exports = Koa\n复制代码\n总结\n这样就完成了全部核心功能的编写，通过本文你就可以足够了解koa了，如果对你有帮助，不妨点个赞。")])])}),[],!1,null,null,null);n.default=r.exports}}]);