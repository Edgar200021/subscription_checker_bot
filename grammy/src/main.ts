import { setupBot } from './bot/setupBot'
import { db } from './db/database'
require('dotenv').config()
;(() => {
  try {

	console.log("NODE_BOT_TOKEN", process.env.NODE_BOT_TOKEN)
    const handler = setupBot()

    process.on('uncaughtException', () => {
      handler.stop()
      db.close()
    })
    process.once('SIGINT', () => {
      handler.stop()
      db.close()
    })
    process.once('SIGTERM', () => {
      handler.stop()
      db.close()
    })
  } catch (error) {
    console.log('ERROR', error)
  }
})()
