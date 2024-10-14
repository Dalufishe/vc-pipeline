from flask import Flask, jsonify
import requests
from parse_args import parse_args

app = Flask(__name__)

id_value, from_value = parse_args()


@app.route("/")
def process():

    # inputs = requests.get("http://127.0.0.1:" + from_value).json()

    # 複雜運算
    # #######
    # #######
    # #######
    outputs = {"data": {"counter": 9}}
    
    return jsonify(outputs)


if __name__ == "__main__":
    app.run(port=id_value)


