from pipeline_api import Node

def handler(inputs):
    return {**inputs, "data": {"counter": 3}}


if __name__ == "__main__":
    Node(handler)
