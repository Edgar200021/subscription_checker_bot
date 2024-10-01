import Database from 'better-sqlite3'
import path from 'path'

export const db = new Database(path.join(__dirname, '../../../users.db'))

//const query = `
//	CREATE TABLE IF NOT EXISTS users (
//		id INTEGER PRIMARY KEY,
//		telegram_id INTEGER NOT NULL UNIQUE
//	);
//`

//const index = `CREATE UNIQUE INDEX IF NOT EXISTS idx_users_id ON users (id);`

//db.exec(query)
//db.exec(index)
