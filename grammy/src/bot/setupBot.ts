import { autoRetry } from '@grammyjs/auto-retry'
import { run } from '@grammyjs/runner'
import { Bot } from 'grammy'
import { checkIsAdmin } from './filters/checkIsAdmin'
import { handleChatMember } from './handlers/handleChatMember'
import { handleError } from './handlers/handleError'
import { handleMessage } from './handlers/handleMessage'
import { setConfig } from './middlewares/setConfig'
import { MyContext } from './types'

export const setupBot = () => {
  const bot = new Bot<MyContext>(process.env.NODE_BOT_TOKEN!, {})

  bot.use(setConfig)
  bot.api.config.use(autoRetry())

//  bot.on('chat_member', handleChatMember)
  bot.filter(checkIsAdmin, handleMessage)

  bot.catch(handleError)

  return run(bot, {
    runner: {
      fetch: {
        allowed_updates: ['message', 'chat_member'],
      },
    },
  })
}
