import { GrammyError } from 'grammy'
import { usersRepository } from '../../db/usersRepository'
import { generateMainMarkup } from '../helpers/createMainMarkup'
import { MyContext } from '../types'

export const handleMessage = async (ctx: MyContext) => {
  if (ctx.chatId === ctx.config.mainChatId) return
  if (!ctx.msgId || !ctx.from) return

  const userId = ctx.from.id

  try {
    const dbUser = usersRepository.getUser(userId)
    if (dbUser) return
	
    const tgUser = await ctx.api.getChatMember(
      ctx.config.mainChatId,
      ctx.from.id
    )

    if (
      tgUser.status === 'member' ||
      tgUser.status === 'creator' ||
      tgUser.status === 'administrator'
    ) {
      usersRepository.createUser(ctx.from.id)
      return
    }

    await sendResponse(ctx)
  } catch (error) {
    if (error instanceof GrammyError && error.method === 'getChatMember') {
      await sendResponse(ctx)
    }
    throw error
  }
}

const sendResponse = async (ctx: MyContext) => {
  const keyboard = generateMainMarkup(
    ctx.config.mainChatUrl,
    ctx.config.joinChannelText
  )

  await Promise.all([
    ctx.api.sendMessage(ctx.chatId!, ctx.config.bannerText, {
      reply_markup: keyboard,
    }),
    ctx.deleteMessage(),
  ])
}
