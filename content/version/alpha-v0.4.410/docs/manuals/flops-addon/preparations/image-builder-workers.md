---
title: "Prepare Image-builder Workers"
summary: ""
draft: false
weight: 309020200
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

{{< callout context="caution" title="Mandatory" icon="outline/alert-triangle">}}
  FLOps relies on dynamically built container images.
  FLOps delegates and distributes this task to orchestrated worker nodes to minimize bottlenecks and optimize computational efficiency.
  Only nodes that have been prepared as described on this page are capable of building images for FLOps.

  For FLOps to work as intended, you are required to prepare at least one of your orchestrated nodes, as described in this guide.
{{< /callout >}}

{{< callout context="tip" title="Optimize Image Build Times" icon="outline/rocket" >}}
  Building images is a significant part of any FLOps project, including its runtime.
  Select your worker nodes wisely for building images.
  To speed up runtimes, prefer more powerful resource-rich machines.
{{< /callout >}}

{{< callout context="note" title="Curious about FLOps' Image Building Process?" icon="outline/settings-question" >}}
  Explore why and how container images are build in FLOps [here](/docs/concepts/flops/internals/image-building-process).
{{< /callout >}}

On the worker nodes where you wish to do the image building, do the following:
- Ensure the Worker Node is running
  ```bash
    oak worder -d && oak worker status
  ```
- Activate the `imageBuilder` addon for the NodeEngine:
  ```bash
    oak worder config addon imageBuilder on
  ```
  *N.b. `oak worker` is just an alias for the `NodeEngine` command*
- Restart the worker node (the NodeEngine component)
  ```bash
    oak worker stop && oak worker -d
  ```
- Verify that the addon is active:
  ```bash
    > oak worker config addon

    Configured Addons:
         - image-builder: 🟢 Active
  ```
