import Koa from 'koa';
import Router from 'koa-router'
import puppeteer from 'puppeteer-core'
import chrome from 'chrome-aws-lambda';
import cors from '@koa/cors'

const cors = require('@koa/cors');

const app = new Koa();
const router = new Router()
app.use(cors());

const waitVisibleText = async (target, page) => {
  await page.waitForTimeout(100);
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
  const browser = await puppeteer.launch({ args: chrome.args, executablePath: await chrome.executablePath, headless: chrome.headless });
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