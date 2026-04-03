---
title: "Stage 1: Project Start"
summary: ""
draft: false
weight: 309030202
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
asciinema: true
---

To start a project we need to request the FLOps Manager (*which is part of FLOps Management*) to create one.
FLOps projects are based on project SLAs.
In this example we will use a sample `mnist_sklearn` project.

{{< callout context="note" title="More Example Projects" icon="outline/eye" >}}
Additional example projects are available [here](../../examples)
{{< /callout >}}

Download the example SLA:
```bash
  curl -sSl https://oakestra.io/FLOps_SLAs/projects/mnist_sklearn_small.json > mnist_sklearn_small.json
```

Create the FLOps project using the downloaded deployment descriptor.
```bash
  oak addon flops p mnist_sklearn_small.json
```

This demo shows the start of our base-case project:

{{< asciinema key="flops_start" poster="0:08" idleTimeLimit="1" >}}

After sending out the project request via the CLI, the following happens:
- The FLOps manager swiftly responds, telling us that our request was successful and that a new project started running.
  ```bash
    Success: 'Init new FLOps project for SLA '~/oak_cli/addons/flops/projects/mnist_sklearn_small.json'
  ```
- The manager creates two new applications:

```bash
APPLICATION ID             NAME               NAMESPACE     DESCRIPTION                                SERVICES
────────────────────────   ────────────────   ───────────   ────────────────────────────────────────   ────────
69ccf48097faf0f04f8a5f74   observatory        observatory                                              1
69ccf48197faf0f04f8a5f75   proj9fa402dbcce9   proj          Internal application for managing FLOps…   1

```

  - A `proj..` application that acts as a wrapper encompassing all current and future services that only belong to our project.
    - We could create several projects at the same time - each would get its own app.
  - A single observatory app is created that will be shared only among projects of the same user.
- The manager creates and deployes a project observer service.

```bash
SERVICE ID                 NAME                  NAMESPACE   APPLICATION        INSTANCES   STATUS
────────────────────────   ───────────────────   ─────────   ────────────────   ─────────   ───────────
69ccf48197faf0f04f8a5f76   observcdb5ac375cb4    observ      observatory        1           1/1 running
```

{{< callout context="note" title="Stay up to date" icon="outline/eye" >}}

  Each project gets its own observer service.
  Besides the FLOps manager logs, this is the primary way for you *(and especially common users)* to keep up with your projects' current *(internal)* state.

  The manager and deployed FLOps services can and will send updates or potential error messages to this observer service.

  Think of the observer service as a live log or inbox for all user-relevant events concerning its matching project.

  ```bash
  $> oak s logs observcdb5ac375cb4 0
╭───────────────────────────────────────────────────────────────────────╮
│ name: observcdb5ac375cb4 | NODE_SCHEDULED    | app name: observat..   │
├───────────────────────────────────────────────────────────────────────┤
│ 0 | RUNNING    | public IP: 192.168.178.44 | cluster ID: 67619d3d..   │
├───────────────────────────────────────────────────────────────────────┤
│ Project Observer started                                              │
│ New Builder service created & deployed                                │
│ Start building                                                        │
│ 192.168.178.44:5073/malyuk-a/flops_ml_repo_mnist_sklearn/base:...     │
│ (This can take a while)                                               │
│ < Future Events ... >                                                 │
╰───────────────────────────────────────────────────────────────────────╯
  ```
{{< /callout >}}

{{< callout context="tip" title="*JOB'S DONE!*" icon="outline/coffee" >}}
  Sending out the project request is the last manual step a FLOps user has to take.
  From now on, everything is automatically done for you by FLOps.

  Now relax, sit back, and continue reading the following stages to understand what FLOps is doing - and how you can use the trained model/inference server.
{{< /callout >}}

{{< link-card
  title="In need of customization?"
  description="Learn how to create and fine-tune your own FLOps projects"
  href="/docs/manuals/flops-addon/customizations/flops-customizations-overview/"
>}}
