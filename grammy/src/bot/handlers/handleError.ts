import { BotError, GrammyError, HttpError } from 'grammy'
import { MyContext } from '../types'

export const handleError = async (err: BotError<MyContext>) => {
  const ctx = err.ctx

  console.error(`Error while handling update ${ctx.update.update_id}`)
  const e = err.error

  if (e instanceof GrammyError) {
    return console.error(
      'Error in request: ',
      e.description + '\n' + `CHAT ID: ${ctx.chatId}`
    )
  }

  if (e instanceof HttpError) {
    return console.error('Could not contact Telegram', e + '\n')
  }

  console.error('Unknown error:', e)
}
