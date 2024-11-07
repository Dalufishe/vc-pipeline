from pipeline_api import Node


def handler(inputs):
    return {**inputs, "data": {"counter": inputs["data"]["counter"] + 2}}


if __name__ == "__main__":
    Node(handler)
