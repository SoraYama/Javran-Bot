require('dotenv').load();

import Telegraf from 'telegraf';
import assert from 'assert';
import SocksAgent from 'socks-proxy-agent';
import * as _ from 'lodash';

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

javran.command('touch', async ctx => {
  try {
    const javStickers = await ctx.getStickerSet(`JavransStickers`);
    console.log(javStickers);
    const len = javStickers.stickers.length;
    await ctx.replyWithSticker(javStickers.stickers[Math.floor(Math.random() * len)].file_id);
  } catch (err) {
    console.error(err);
    await ctx.reply('thd');
  }
});

javran.startPolling();
