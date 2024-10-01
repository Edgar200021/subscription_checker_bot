import { usersRepository } from '../../db/usersRepository'
import { MyContext } from '../types'

export const handleChatMember = (ctx: MyContext) => {
  if (ctx.chatId !== ctx.config.mainChatId) return

  const newStatus = ctx.update.chat_member!.new_chat_member.status,
    oldStatus = ctx.update.chat_member!.old_chat_member.status,
    id = ctx.from!.id

  const db_user = usersRepository.getUser(id)

  if (newStatus === 'member' || oldStatus === 'left') {
    if (db_user) return
    return usersRepository.createUser(id)
  }

  if (newStatus === 'left' || oldStatus === 'member') {
    if (db_user) usersRepository.deleteUser(id)
  }
}
