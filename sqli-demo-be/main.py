from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import mysql.connector
import os

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': 'user',
    'password': 'password',
    'database': 'sqlidemo'
}

@app.route("/courses", methods=['POST'])
@cross_origin()
def search_courses():
    code = request.json.get('query', '').upper()
    display = request.json.get('display', "rows")

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)

    query = f"SELECT * FROM courses WHERE course_code = '{code}'"
    print(query)
    
    try:
        cursor.execute(query)
        results = cursor.fetchall()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()
    print(results)
    if display == "rows":
        return jsonify(results)
    if display == "bool":
        return jsonify({
            "result": len(results) > 0
        })
    return jsonify()

@app.route("/", methods=['GET'])
@cross_origin()
def health():
    return "up and running"

@app.route("/verify", methods=['POST'])
@cross_origin()
def verify_root():
    print(request.json)
    return json.dumps("hreheeh")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)