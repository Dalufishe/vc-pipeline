# VC pipeline

### spec

#### format

```python
{
    # pipeline intermediate input & output information
    "data": {
        # ... can be any info & structure in json format
    },
    # pipeline visualization data path (text, image, obj, nrrd)
    "view": {
        "text": "Vesuvius Challenge 2024",
        "image": [
            "D:/vesuvius-project/vc-pipeline/public/ferrari.webp",
            ...
        ],
        "obj": [
            "D:/vesuvius-project/vc-pipeline/public/segment.obj",
            ...
        ],
        "nrrd": [
            "D:/vesuvius-project/vc-pipeline/public/volume.nrrd",
            ...
        ]
    }
}
```
