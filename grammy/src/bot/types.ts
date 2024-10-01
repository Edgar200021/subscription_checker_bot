import { Context } from 'grammy'

export interface SessionData {
  botMessageId: number
}

interface BotConfig {
  mainChatId: number | string
  mainChatUrl: string
  bannerText: string
  joinChannelText: string
  checkSubscriptionText: string
  chatIds: number[]
}

export type MyContext = Context & {
  config: BotConfig
}
