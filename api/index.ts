import Koa from 'koa';
import Router from 'koa-router'
import puppeteer from 'puppeteer'

const app = new Koa();
const router = new Router()

const waitVisibleText = async (target, page) => {
  await page.waitForTimeout(500);
  const element = await page.$(target);
  const betItemTextValue = await element.getProperty('textContent');
  const betValue = await betItemTextValue.jsonValue();
  const result = betValue.replace(/\r?\n/g, "");
  if (result) {
    return true
  } else {
    await waitVisibleText(target, page);
  }
}

router.get('/translate', async (ctx) => {
  const text = ctx.request.query.text
  if (!text) {
    ctx.status = 400
    ctx.body = '翻訳する文字を指定してください'
    return
  }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.deepl.com/translator#en/ja/${text}`, { "waitUntil": "domcontentloaded" });
  await waitVisibleText('#target-dummydiv', page)
  const element = await page.$('#target-dummydiv');
  const betItemTextValue = await element.getProperty('textContent');
  const betValue = await betItemTextValue.jsonValue();
  console.log('text', betValue)
  ctx.body = betValue
})

const port = process.env.PORT || 8081
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}`),
);

export default app.callback()