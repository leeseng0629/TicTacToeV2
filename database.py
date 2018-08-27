import sqlite3
db = sqlite3.connect('db.sqlite')

db.execute('DROP TABLE IF EXISTS feedbacks')

db.execute('''CREATE TABLE feedbacks(
	id integer PRIMARY KEY,
	email text NOT NULL,
	message text NOT NULL,
	rate integer NOT NULL
)''')

cursor = db.cursor()

cursor.execute('''
	INSERT INTO feedbacks(email, message, rate)
	VALUES('jackson@gmail.com','nice app','5')
''')

cursor.execute('''
	INSERT INTO feedbacks(email, message, rate)
	VALUES('edward@gmail.com','not bad','5')
''')

db.commit()
db.close()
