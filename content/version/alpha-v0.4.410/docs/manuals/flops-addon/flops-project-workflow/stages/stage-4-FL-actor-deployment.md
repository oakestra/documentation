---
title: "Stage 4: FL-Actors Deployment"
summary: ""
draft: false
weight: 309030205
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
asciinema: true
---

The FL actor images stored in the FLOps image registry now get deployed on matching worker nodes.
Thanks to its rather lightweight computations, the aggregator service can be deployed on an arbitrary worker node, whereas learner services can only be deployed on dedicated notes that have the `FLOps-learner` add-on enabled.
The aggregator image has a superset of the learner image dependencies, so pulling and deploying both actors takes about the same amount of time.

{{< callout context="tip" title="*Aggregator Size*" icon="outline/weight" >}}

  The aggregator is the prime target for tracking results and performing other MLOps tasks, including logging the trained model with its dependencies.
  To do so, the aggregator keeps a copy of the model that it updates to create the global FL model.
  It needs to be capable of setting and extracting this model's parameters.
  For this, the aggregator is calling the user-defined get/set model parameter methods, which rely on the model ML dependencies.
  That is why the aggregator requires the same dependencies as the learners even though it is not training itself.
  In addition, the aggregator needs mlflow and related dependencies to perform MLOps tasks.

{{< /callout >}}

Each actor service needs some time to spin up properly and connect to one another.
The learner services need to fetch and process their local training data before establishing a connection with their aggregator.


```bash
SERVICE ID                 NAME                   NAMESPACE   APPLICATION        INSTANCES   STATUS
────────────────────────   ────────────────────   ─────────   ────────────────   ─────────   ───────────
69ce4353ac34fd64870c9d42   observbf926c4800d7     observ      observatory        1           1/1 running
69ce45ccac34fd64870c9d44   trackinge3afed0047b0   tracking    observatory        1           1/1 running
69ce45ccac34fd64870c9d45   raggrbf926c4800d7      raggr       projda7ee3eebd48   1           1/1 running
69ce45ccac34fd64870c9d46   cag144582277783        raggr       projda7ee3eebd48   1           1/1 running
69ce45ccac34fd64870c9d47   flearner1663b1830bf1   flearner    projda7ee3eebd48   2           2/2 running
```

In this exmaple we see the following services:

- observbf926c4800d7: The observatory service used to monitor the project status
- trackinge3afed0047b0: The tracking service of the learning. Used to track the learning status.
- raggrbf926c4800d7: Root aggregator: it aggregates the models from all the cluster aggregators. In this example we have a single cluster tho.
- cag144582277783: Cluster aggregator: it aggregates the models from the learners of a specific cluster.
- flearner1663b1830bf1: The actual learners. We have 2 instances, for two separate learners.

