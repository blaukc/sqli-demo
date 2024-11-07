from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import mysql.connector
import os
import re  # Used for input validation
from sqlalchemy import create_engine, MetaData, Table, select
from sqlalchemy.orm import sessionmaker

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': 'user',
    'password': 'password',
    'database': 'sqlidemo'
}

# SQLAlchemy setup for ORM
DB_URL = f"mysql+mysqlconnector://{db_config['user']}:{db_config['password']}@{db_config['host']}/{db_config['database']}"
engine = create_engine(DB_URL)
Session = sessionmaker(bind=engine)

@app.route("/courses", methods=['POST'])
@cross_origin()
def search_courses():
    code = request.json.get('query', '')
    display = request.json.get('display', "rows")
    protection = request.json.get('protection', "none")
    results = None
    if protection == "none":
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

    elif protection == "input_validation":
        # Input Validation allows only alphanumeric characters and spaces
        if not re.match(r'^[a-zA-Z0-9\s]+$', code):
            return jsonify({"error": "Invalid input: Only alphanumeric characters and spaces are allowed"}), 400

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

    elif protection == "prepared_statements":

        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM courses WHERE course_code = %s"
        
        try:
            cursor.execute(query, (code,))
            results = cursor.fetchall()
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cursor.close()
            connection.close()

    elif protection == "orm":
        try:
            session = Session()
            metadata = MetaData()
            courses_table = Table('courses', metadata, autoload_with=engine)
            
            statement = select(courses_table).where(courses_table.c.course_code == code)
            result_proxy = session.execute(statement)
            results = [dict(row._mapping) for row in result_proxy]
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            session.close()

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