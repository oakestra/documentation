---
title: "Post-training Steps"
summary: ""
draft: false
weight: 309030207
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
asciinema: true
---

Post-training steps are optional steps or stages that FLOps can perform for the user after training concludes and the model is logged.
Users can freely specify what steps they want for their projects as part of their SLAs.
If no post-training steps are requested, the FLOps project counts as completed.
The tracking server and its GUI keep running so users can inspect and work with their project results.
Our base case uses post-training steps.

FLOps currently supports the following post-training steps:

## Step A: Build Image for Trained Model

In this step, FLOps deploys another image-builder service.
It fetches the logged trained model from the artifact store which is part of the FLOps management suite.
The builder creates a new container image that encapsulates that model and can be used as an inference server on multiple target platforms.
The initial project SLA determines these target platforms.
The built image can be pulled by users directly from their FLOps image registry and used freely.

```bash
$ oak s s
SERVICE ID                 NAME                   NAMESPACE   APPLICATION         INSTANCES   STATUS
────────────────────────   ────────────────────   ─────────   ────────────────    ─────────   ───────────
69ce3368ac34fd64870c9d28   observae1d30449057     observ      observatory          1          1/1 running
69ce3368ac34fd64870c9d29   trackinge3afed0047b0   tracking    observatory          1          1/1 running
69ce3696ac34fd64865c9d3f   builder645bb530b3f8    builder     projda7ee3eebd48     1          1/1 running
```

{{< link-card
  title="Want to know more about the trained model image build?"
  description="Learn how the logged trained model gets transformed into a container image"
  href="/docs/concepts/flops/internals/image-building-process"
>}}

## Step B: Deploy Trained Model Image

{{< callout context="caution" icon="outline/alert-triangle">}}
  Relies on step A to be successful and the trained model image to be present in your FLOps image registry.
{{< /callout >}}

FLOps lets you directly and automatically deploy the built-trained model/inference server image onto an orchestrated worker node.
Once deployed, this service will serve as an inference server for your trained model. In the example below we see `trmodel` as the deployed trained model.

```bash
$ oak s s
SERVICE ID                 NAME                   NAMESPACE   APPLICATION   INSTANCES   STATUS
────────────────────────   ────────────────────   ─────────   ───────────   ─────────   ───────────
69ce3368ac34fd64870c9d28   observae1d30449057     observ      observatory   1           1/1 running
69ce3368ac34fd64870c9d29   trackinge3afed0047b0   tracking    observatory   1           1/1 running
69ce3696ac34fd64870c9d2f   trmodeleb74ab34f64f    trmodel     helper        1           1/1 running

```

### Testing the deployed Inference Server

To conclude the base case, let's test our trained model's deployed inference server service.

We need to find out the internal service IP of the running inference service.
One way to do this is via the `oak s i <service_name> 0` command which will inspect the instance 0 of the service. In our example we run `oak s i trmodeleb74ab34f64f 0`.

```json
Service:                 trmodeleb74ab34f64f
Service ID:              69ce3696ac34fd64870c9d2f
Application:             helper / helper
Namespace:               trmodel
Image:                   123.23.25.26:5073/admin/trained_model:90bae37c48ae4eb29358a0f194214894
Virtualization:          docker
Port:                    8088:8080
Round-Robin IP:          10.30.185.40
Service Status:          RUNNING

Instance 0:
  Status:             RUNNING
  Detail:             No extra information
  Host:               123.23.25.26
  Public IP:          123.23.25.26
  Cluster:            69cd3280ac34fd64870c9d0d
  Location:           48.1386,11.5556,1000
  Worker:             69cd32a2fabc03b20eea31f8
  CPU:                0.002798%
  Memory:             0.000000%
  Disk:               0.3 MB
```
We copy the `'Round-Robin IP': '10.30.185.40'`.


Inference serving depends on the concrete model signature, which includes input/data types and formats.
This model signature can differ significantly between models.
Therefore, FLOps does not provide a universally applicable inference test service.
For our base-case example, we provide a ready-made image and SLA for you.
You have to paste the copied IP into the matching `cmd` slot.
Once deployed, the inference tester service will automatically prepare test samples and request the inference server for predictions.
The test service will continue requesting predictions in a loop until it is removed manually.

{{< link-card
  title="Base-case Inference Tester Implementation"
  description="Look at the source code of the base-case inference tester"
  href="https://github.com/oakestra/addon-FLOps/tree/main/trained_model_image_inference_testers/mnist_sklearn"
>}}

```json
{
  "sla_version": "v2.0",
  "customerID": "Admin",
  "applications": [
    {
      "applicationID": "",
      "application_name": "inferencetester",
      "application_namespace": "inference",
      "application_desc": "Inference tester",
      "one_shot": true,
      "microservices": [
        {
          "microserviceID": "",
          "microservice_name": "inftest",
          "microservice_namespace": "inftest",
          "virtualization": "container",
          "cmd": [
            "poetry",
            "run",
            "python",
            "main.py",
            # Paste the copied RR IP here
            "<The internal service IP ~ 10.30.X.Y>"
          ],
          "memory": 100,
          "vcpus": 1,
          "vgpus": 0,
          "vtpus": 0,
          "bandwidth_in": 0,
          "bandwidth_out": 0,
          "storage": 0,
          "code": "ghcr.io/malyuk-a/mnist_sklearn_inference_tester:latest",
          "state": ""
        }
      ]
    }
  ]
}
```

{{< callout context="note" title="Add your SLA to the CLI" icon="outline/bolt" >}}
  You can add a new app for your `oak-cli` by adding this SLA as a `.json` file to your `~/oak_cli/SLAs/` folder.
{{< /callout >}}


The following demo shows the intended base-case inference test workflow.

{{< asciinema key="flops_inference" poster="0:12" idleTimeLimit="2" >}}

```bash
inftest  69ce3828ac34fd64870c9d31  instance 0

Generating train split: 100%|          | 60000/60000 [00:00<00:00, 124613.76 examples/s]
Generating test split: 100%|          | 10000/10000 [00:00<00:00, 123933.07 examples/s]
Picking a random sample from the MNIST dataset for inference checking
Label of the random test sample: '7'
Sending inference request to the trained model container
ic| response: <Response [200]>
Inference result: '{"predictions": [9]}'
ic| original_expected_label == inference_result: False
```

This snippet from the demo shows the logs from the inference tester service.
You can see that the test service picks a random matching (MNIST) test sample and queries the inference server for a prediction.
The first two examples (1 & 9) were correct, but the model did not correctly predict the third one (6).
This behavior matches our logged model accuracy, which is around 80% after only three training rounds.

{{< callout context="tip" title="*Base Case Completed!*" icon="outline/confetti" >}}
  Congratulations on reaching the end of the base-case FLOps project!

  Feel free to reset/flush your components and try it again, or dive straight into creating customized projects.
{{< /callout >}}

FLOps' base case is just a demonstration to get you familiar with the core functionalities and workflow.
Continue to the next page to learn how to configure custom SLAs and ML Git repositories.
