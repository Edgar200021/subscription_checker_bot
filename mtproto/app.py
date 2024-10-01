from pyrogram import Client, filters
from pyrogram.errors import FloodWait
import sqlite3
import os
from dotenv import load_dotenv, find_dotenv
import logging
import uvloop
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import asyncio
from itertools import combinations
import subprocess
import string
import time
import signal


logging.basicConfig(format='[%(levelname) 5s/%(asctime)s] %(name)s: %(message)s',
                    level=logging.WARNING)
load_dotenv(find_dotenv())
uvloop.install()

ID = os.getenv("API_ID")
HASH = os.getenv("API_HASH")
PHONE = os.getenv("PHONE")
BOT_TOKEN = os.getenv("BOT_TOKEN")
CHAT_ID = int(os.getenv("MAIN_CHAT_ID"))

 
app = Client("my_account", api_id=ID, api_hash=HASH, bot_token=BOT_TOKEN)

db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'users.db'))

if os.path.exists(db_path):
	os.remove(db_path)
 
conn = sqlite3.connect(db_path)


cur = conn.cursor()

cur.execute('''
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY,
		telegram_id INTEGER NOT NULL UNIQUE
	);
''')
    
cur.execute('''
	CREATE UNIQUE INDEX IF NOT EXISTS idx_users_id ON users (id);
''')

conn.commit()
cur.close()

telegram_ids = set()

need_start = True


class GracefulKiller:
  def __init__(self):
    signal.signal(signal.SIGINT, self.exit_gracefully)
    signal.signal(signal.SIGTERM, self.exit_gracefully)

  def exit_gracefully(self, signum, frame):
    print("Shut down")
    conn.close()
    subprocess.run(["pm2", "stop", "all"], shell=True)
    subprocess.run(["pm2", "delete", "all"], shell=True)
    
    

async def job():
    t1 = time.time()
    global need_start
    cur = conn.cursor()

    cur.execute('''
        DELETE FROM users;
    ''')

    characters = (
        string.ascii_lowercase + 
        string.digits + 
        "абвгдеёжзийклмнопрстуфхцчшщъыьэюя/_.әғұфіґ"
        ) 

    substrings = ["".join(combo) for i in range(1, 4) for combo in combinations(characters, i)]
    
    for query in substrings:
        print(query)
        print(len(telegram_ids))
        async for member in app.get_chat_members(CHAT_ID, query, 200):
            telegram_ids.add(member.user.id)

    query_ids = [(id,) for id in telegram_ids]
    cur.executemany("INSERT OR IGNORE INTO users (telegram_id) VALUES (?)", query_ids)
    
    conn.commit()
    cur.close()
    
    telegram_ids.clear()
    
    if need_start:
        need_start = False
        subprocess.Popen(['npm', 'start'], 
                         cwd=os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'grammy')),
                         start_new_session=True)
        job_id.remove()
    
    t2 = time.time()
    print(t2 - t1)
    string.punctuation




scheduler = AsyncIOScheduler()
job_id = scheduler.add_job(job, "interval", seconds = 5)
scheduler.add_job(job, trigger="cron", hour='3', minute='*')


@app.on_chat_member_updated(filters.chat(CHAT_ID))
async def my_handler(_, update):
	user_id = update.from_user.id
	cur = conn.cursor()

	if update.new_chat_member is not None:
		cur.execute("INSERT INTO users (telegram_id) VALUES (?)", [user_id])
		if len(telegram_ids) > 0:
			telegram_ids.add(user_id)

	if update.old_chat_member is not None:
		cur.execute("DELETE FROM users WHERE telegram_id = ?", [user_id])
		if len(telegram_ids) > 0 and user_id in telegram_ids:
			telegram_ids.discard(user_id)

	cur.close()
	conn.commit()


GracefulKiller()
scheduler.start()
app.run()


