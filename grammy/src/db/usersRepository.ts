import { db } from './database'
import { User } from './types'

class UsersRepository {
  getUsers(): User[] {
    const users = db.prepare<unknown[], User>('SELECT * FROM users').all()

    return users
  }
  getUser(telegram_id: number): User | undefined {
    const user = db
      .prepare<number, User>('SELECT * FROM users WHERE telegram_id = ?;')
      .get(telegram_id)

    return user
  }

  createUser(telegram_id: number) {
    db.prepare<number>('INSERT OR IGNORE INTO users (telegram_id) VALUES (?);').run(
      telegram_id
    )
  }

  deleteUser(telegram_id: number) {
    db.prepare<number>('DELETE FROM users WHERE telegram_id = ?;').run(
      telegram_id
    )
  }
}

export const usersRepository = new UsersRepository()
