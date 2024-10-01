import { MyContext } from '../types'

export const handleCbQuery = async (ctx: MyContext) => {
  if (!ctx.from) return

  try {
    const member = await ctx.api.getChatMember(
      ctx.config.mainChatId,
      ctx.from.id
    )

    if (member.status !== 'member') {
      return await ctx.answerCallbackQuery('Вы еще не подписались на канал')
    }

    await ctx.answerCallbackQuery('Вы уже подписаны на канал')
  } catch (error) {
    console.log('\n')
    console.log('ERROR IN ANSWER ----------\n', error + '\n----------')
    throw error
  }
}
