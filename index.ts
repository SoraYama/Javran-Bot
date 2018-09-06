require('dotenv').load();

import Telegraf from 'telegraf';
import assert from 'assert';
import SocksAgent from 'socks-proxy-agent';
import * as _ from 'lodash';
import Logger from 'log4js';

const logger = Logger.configure({
  appenders: {
    index: { type: 'file', filename: 'index.log' },
  },
  categories: { default: { appenders: ['index'], level: 'info' } }
}).getLogger('index');

assert(process.env.BOT_TOKEN, `No BOT_TOKEN env found! Set this env manually or in a '.env' file.`);

const proxy = process.env.http_proxy || process.env.https_proxy || '';
const agent = new SocksAgent(proxy);

const javran = new Telegraf(process.env.BOT_TOKEN!, {
  telegram: {
    agent,
  }
});

type IJavWords = Array<[string[], string]>;

const javWords: IJavWords = [
  [['挺好的', 'thd'], '挺好的'],
  [['谁说的', '是谁说'], '是彭定康说的'],
];

_.each(javWords, map => {
  javran.hears(map[0], ctx => {
    ctx.reply(map[1]);
  });
})

javran.help(async ctx => {
  await ctx.reply('还需要多学习一个');
})

javran.command('touch', async ctx => {
  try {
    const javStickers = await ctx.getStickerSet(`JavransStickers`);
    const len = javStickers.stickers.length;
    logger.info(await ctx.getChat());
    await ctx.replyWithSticker(javStickers.stickers[Math.floor(Math.random() * len)].file_id);
  } catch (err) {
    logger.error(err);
    await ctx.reply('thd');
  }
});

javran.command('birth', async ctx => {
  try {
    await ctx.reply('26817');
  } catch (err) {
    logger.error(err);
    await ctx.reply('thd');
  }
});

javran.startPolling();
