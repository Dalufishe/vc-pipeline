from pipeline_api import Node


def handler(inputs):
    return {
        **inputs,
        "data": {"counter": inputs["data"]["counter"] + 1},
        "view": {
            # "text": "Vesuvius Challenge",
            "image": "/Users/yao/Desktop/test.png",
            # "obj": "/Users/yao/Desktop/test.obj",
            # "nrrd": "/Users/yao/Desktop/cube.nrrd",
            
        },
    }


if __name__ == "__main__":
    Node(handler)
