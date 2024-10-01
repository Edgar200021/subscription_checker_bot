import { MyContext } from '../types'

export const checkIsAdmin = async (ctx: MyContext): Promise<boolean> => {

  if (!ctx.from || !ctx.chat) {
    console.log(
      `NO INFORMATION AVAILABLE: -------\n USER: ${ctx.from} \n CHAT: ${ctx.chat} `
    )
    return false
  }

  return ctx.config.chatIds.includes(ctx.chat.id)
}
