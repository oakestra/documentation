---
title: "Prepare Learner Workers"
summary: ""
draft: false
weight: 309020300
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

{{< callout context="caution" title="Mandatory" icon="outline/alert-triangle">}}
  FLOps' main goal is to perform federated learning, i.e., to train a machine learning model on local data in a distributed and privacy-preserving way.
  Training an ML model requires compatible data.
  A worker node is required to aggregate matching data to be able to participate in training.
  By default, orchestrated nodes do not aggregate training data.
  Only worker nodes that have been prepared as described on this page can collect such data and become FL learners.

  For FLOps to work as intended, you are required to prepare at least one of your orchestrated nodes, as described in this guide.
{{< /callout >}}

{{< callout context="tip" title="Optimize Learning" icon="outline/rocket" >}}
  Training is the centerpiece of FLOps, not only conceptually but also computationally and runtime-wise.
  Select your learner nodes wisely.
  Prefer more powerful, resource-rich machines to speed up training times.
{{< /callout >}}

{{< callout context="note" title="How do learners handle and store data for training in FLOps?" icon="outline/settings-question" >}}
  Explore how FLOps manages ML data for local training [here](/docs/concepts/flops/internals/ml-data-management/)
{{< /callout >}}

On the worker nodes where you wish to perform ML model training, do the following:
- Ensure the NodeEngine is running
  ```bash
    oak worder -d && oak worker status
  ```
- Activate the `FLOps-learner` addon for the NodeEngine:
  ```bash
    oak worker config addon FLOps on
  ```
- Restart the NodeEngine
  ```bash
    oak worker stop && oak worker -d
  ```
- Verify that the addon is active:
  ```bash
    > oak worker config addon

    Configured Addons:
         - FLOps-learner: 🟢 Active
  ```
