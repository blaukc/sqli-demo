from flask import Flask, request
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/courses", methods=['POST'])
@cross_origin()
def search_courses():
    print(request.json)
    return json.dumps("hreheeh")

@app.route("/verify", methods=['POST'])
@cross_origin()
def verify_root():
    print(request.json)
    return json.dumps("hreheeh")