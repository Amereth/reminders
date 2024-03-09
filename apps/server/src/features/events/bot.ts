import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { env } from '../../utils/env'

const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN)
export default bot

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))

bot.command('add_event', async (ctx) => {
  console.log(ctx)

  ctx.reply('Please enter the event info')

  console.log('command add event', ctx.message)
})

bot.on(message('text'), async (ctx) => {
  // Explicit usage
  await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`)

  // Using context shortcut
  await ctx.reply(`Hello ${ctx.state.role}`)
})

bot.hears('hi', (ctx) => ctx.reply('Hey there'))
