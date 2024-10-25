from pipeline_api import Node


def handler(inputs):
    return {
        **inputs,
        "data": {"counter": inputs["data"]["counter"] + 1},
        "view": {
            # "text": "Vesuvius Challenge",
            # "image": "D:/vesuvius-project/vc-pipeline/public/ferrari.webp",
            # "obj": "D:/vesuvius-project/vc-pipeline/public/test.obj",
            "nrrd": "D:/vesuvius-project/vc-pipeline/public/test.nrrd",
            
        },
    }


if __name__ == "__main__":
    Node(handler)
