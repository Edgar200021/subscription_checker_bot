import { NextFunction } from 'grammy'
import {
  BANNER_TEXT,
  CHECK_SUBSCRIPTION_TEXT,
  JOIN_CHANNEL_TEXT,
} from '../const/text'
import { MyContext } from '../types'

require('dotenv').config()

export const setConfig = async (ctx: MyContext, next: NextFunction) => {
  ctx.config = {
    mainChatId: Number(process.env.MAIN_CHAT_ID),
    mainChatUrl: process.env.MAIN_CHAT_URL!,
    bannerText: process.env.BANNER_TEXT?.trim() || BANNER_TEXT,
    checkSubscriptionText:
      process.env.CHECK_SUBSCRIPTION_TEXT?.trim() || CHECK_SUBSCRIPTION_TEXT,
    joinChannelText: process.env.JOIN_CHANNEL_TEXT?.trim() || JOIN_CHANNEL_TEXT,
	chatIds: process.env.CHAT_IDS!.split(' ').filter(Boolean).map(Number)
  }

  await next()
}
