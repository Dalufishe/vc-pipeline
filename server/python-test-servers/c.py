from pipeline_api import Node


def handler(inputs):
    return {
        **inputs,
        "data": {"counter": inputs["data"]["counter"] + 1},
        "view": {
            # "text": "Vesuvius Challenge",
            "image": [
                "D:/vesuvius-project/vc-pipeline/public/ferrari.webp",
                "D:/vesuvius-project/vc-pipeline/public/roxy.jpeg",
            ],
            # "obj": [
            #    "D:/vesuvius-project/vc-pipeline/public/1.nrrd",
            #    "D:/vesuvius-project/vc-pipeline/public/2.nrrd",
            # ],
            # "nrrd": [
            #     "D:/vesuvius-project/vc-pipeline/public/1.nrrd",
            #     "D:/vesuvius-project/vc-pipeline/public/2.nrrd",
            # ],
        },
    }


if __name__ == "__main__":
    Node(handler)
