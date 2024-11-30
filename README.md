# VC Pipeline

![](/readme/preview.png)


A pipeline tool combining script execution and visualization, designed to connect workflows and results from personal or global developer contributions.

With the VC Pipeline, you can:

- Transfer data between scripts and existing tools in JSON format.
- Execute scripts and display the results on a single interface.

---

Here's a small demo, in this video, there are 3 cards (blue ones), forming a pipeline. 

- The first one is mask to obj (inspired by James Darby). 
- The second one is obj to sub-volume (modified from RICHI pipeline). 
- The last card is sub-volume to ink predictions (from Youssef GP solution). 
  
The execution results of these scripts are displayed in the View Card (yellow one), showing the generated OBJ file.
### Usage

1. **Prepare the Scripts for Execution**

Below are examples of `a.py`, `b.py`, and `c.py`, demonstrating how data is passed from `a.py` to `b.py`, and then processed in `b.py` before being passed to `c.py`, which ultimately returns the final result.

#### `a.py` - Provide Data

```py
from pipeline_api import Node

def handler(inputs):
    # Provide data, here setting an initial value
    return {**inputs, "data": {"value": 5}}

if __name__ == "__main__":
    Node(handler)
```

#### `b.py` - Perform Simple Calculation

```py
from pipeline_api import Node

def handler(inputs):
    # Retrieve data from a.py and perform a simple calculation
    value = inputs["data"]["value"]
    result = value * 2  # For example, multiply the value by 2
    return {**inputs, "data": {"value": result}}

if __name__ == "__main__":
    Node(handler)
```

#### `c.py` - Return Final Result

```py
from pipeline_api import Node

def handler(inputs):
    # Retrieve the calculated result from b.py and return the final result
    calculated_value = inputs["data"]["value"]
    return {
        **inputs,
        "view": {
            "text": f"Final result: {calculated_value + 3}"  # Add 3 to the calculated result
        }
    }

if __name__ == "__main__":
    Node(handler)
```

2. **Run the Pipeline**

Once the scripts are prepared, you can use the VC Pipeline interface to chain them into a pipeline. Each script acts as a "card" in the pipeline, and data flows sequentially from one script to the next.

You can execute the pipeline by running `pipeline_api` and connecting each script’s output to the next script’s input. The final result will be displayed on the interface, showing the output from the last script in the pipeline.

3. **Data Format**

The data passed between scripts is in JSON format. Each script receives an input dictionary and returns a modified dictionary, which can include data for further processing or visualization.

4. **Visualizing the Results**

In the final script, the result will be displayed in the "View Card." In the example above, the last script adds 3 to the `value` and shows the result as a string (`"text"`). The result will dynamically update every time a script is executed.

If the final script generates images or other file formats, you can manually create a View Card and specify the file path to display the results on the screen.

---

This design allows you to experiment with different pipelines, share workflows with others, and seamlessly visualize the results of various data processing scripts.

Currently, we only support Python scripts (support for other programming languages will be added in future updates).