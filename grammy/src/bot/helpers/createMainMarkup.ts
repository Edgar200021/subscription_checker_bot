import { InlineKeyboard } from 'grammy'

export const generateMainMarkup = (url: string, joinText: string) => {
  const inlineKeyboard = new InlineKeyboard().url(joinText, url).row()

  return inlineKeyboard
}
