---
title: "Image Building Process"
summary: ""
draft: false
weight: 309060300
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

{{< details "**Why building images is necessary for FLOps**">}}
  Performing FL can be challenging.
  FLOps handles most FL aspects and configurations unless users want to [customize their FLOps projects](/docs/manuals/flops-addon/customizations/flops-customizations-overview/).
  FLOps takes pure (non-FL) ML code (in the form of Git repositories) and augments it to support FL.
  In addition, FLOps wraps this augmented FL code and all necessary dependencies to perform ML training as a multi-platform container image.
  By using container images, learners can be deployed and distributed among various workers while stabilizing the training behavior and avoiding tedious varying configurations and setups that depend on the concrete worker machine.
{{< /details >}}

{{< details "**The reason for building images on worker nodes**">}}

  Image building (especially multi-platform ones) can get very demanding on a system.
  This is especially the case for dependency-rich ML projects.
  Building such images is computationally demanding, takes a lot of time (5-30+ minutes), and can lead to large images (1-10+ GB).
  FLOps delegates and distributes this duty to image builders running on orchestrated worker nodes to avoid bottlenecking the control plane.

  These image builders run temporarily as containerized services for workers.
  Building (multi-platform) container images inside of containers is a nontrivial task.
  The image-build process usually requires elevated privileges - especially for complex scenarios like ours.
  It is not easy to build images for target architectures (e.g., ARM) on machines that do not match the host builder machine architecture (e.g., AMD).
  FLOps uses [QEMU](https://www.qemu.org/) to virtualize the building of images for multiple platforms.

{{< /details >}}

## Architecture

{{<svg-smaller "image-builder-simple" "Simplified Architecture" >}}

<br>

The Image-Builder service running on a worker node can build container images for **FL Actors** (aggregators and learners) and inference servers based on the trained model.
The image-builder clones the ML repository to build the FL actors.
For the inference server, the image-builder fetches the trained model from the artifact store hosted as part of the FLOps management suite.
This allows a single image and implementation to be reused for different target images.

{{<svg "image-builder-detailed" "Detailed Architecture" >}}
