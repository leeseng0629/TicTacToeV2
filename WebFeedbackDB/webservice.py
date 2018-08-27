import sqlite3
from flask import Flask, jsonify, request, abort
from argparse import ArgumentParser


DB = 'db.sqlite'


def get_row_as_dict(row):
    row_dict = {
        'id': row[0],
        'email': row[1],
        'message': row[2],
        'rate': row[3]
    }

    return row_dict


app = Flask(__name__)


@app.route('/api/feedbacks', methods=['GET'])
def index():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM feedbacks ORDER BY id')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200


@app.route('/api/feedbacks/<int:feedback>', methods=['GET'])
def show(feedback):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM feedbacks WHERE id=?', (str(feedback),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200


@app.route('/api/feedbacks', methods=['POST'])
def store():
    if not request.json:
        abort(404)

    new_feedback = (
        request.json['email'],
        request.json['message'],
        request.json['rate'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        INSERT INTO feedbacks(email,message,rate)
        VALUES(?,?,?)
    ''', new_feedback)

    feedback_id = cursor.lastrowid

    db.commit()

    response = {
        'id': feedback_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/feedbacks/<int:feedback>', methods=['PUT'])
def update(feedback):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != feedback:
        abort(400)

    update_feedback = (
        request.json['email'],
        request.json['message'],
        reques.json['rate'],
        str(feedback),
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE feedbacks SET
            emails=?,message=?,rate=?
        WHERE id=?
    ''', update_feedback)

    db.commit()

    response = {
        'id': feedback,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/feedbacks/<int:feedback>', methods=['DELETE'])
def delete(feedback):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != feedback:
        abort(400)

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM feedbacks WHERE id=?', (str(feedback),))

    db.commit()

    response = {
        'id': feedback,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='0.0.0.0', port=port)
