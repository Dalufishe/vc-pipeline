from flask import Flask, request
from flask_cors import CORS
import json
import requests
import importlib


def get_ordered_sequence(edges):
    sources = set()
    targets = set()

    # 建立 sources 和 targets 的集合
    for edge in edges:
        sources.add(edge["source"])
        targets.add(edge["target"])

    # 找到最初的 source (它不在 targets 裡)
    start = next(source for source in sources if source not in targets)

    # 按順序連接 source 和 target
    sequence = [start]
    while start:
        next_edge = next((edge for edge in edges if edge["source"] == start), None)
        if next_edge:
            sequence.append(next_edge["target"])
            start = next_edge["target"]
        else:
            break

    return sequence


def create_node(handler, config):
    app = Flask(__name__)
    CORS(app)

    @app.route("/")
    def api():
        data_input = requests.get("http://localhost:" + config["target"]).json
        data_ouput = handler(data_input)
        return data_ouput

    app.run(host="0.0.0.0", port=config["source"])


app = Flask(__name__)
CORS(app)

nodes = []
edges = []
flow = []


@app.route("/update_flow", methods=["POST"])
def update_flow():
    data = json.loads(request.get_json())

    nodes = data["nodes"]
    edges = data["edges"]

    flow = get_ordered_sequence(edges)
    return flow


@app.route("/start_flow")
def start_flow():
    for step in flow:
        node = next(node for node in nodes if node["id"] == step)
        title = node["data"]["title"]
        module = importlib.import_module("../../python-test-servers/" + title)
        create_node(
            module.handler, {"source": 8000 + int(step), "target": 8000 + int(step)}
        )
    requests.get("http://localhost:" + 8000 + int(flow[0]))


app.run(host="0.0.0.0", port=3004)
