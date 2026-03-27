---
title: "Create your first Single-Machine Cluster"
summary: ""
draft: false
weight: 102020000
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

Let's get you up to speed with the easiest possible setup. You'll be able to run your first Oakestra Orchestrator in a few seconds all in a single device!

### Startup the Orchestrators in a Single Machine

In this guide, we'll perform a Single Machine Setup. This setup is the easiest way to get started with Oakestra with a single Cluster managed by a single machine. To do so, we'll install the **Root Orchestrator** the **Cluster Orchestrator** and the **Worker Node** together, as shown in the following figure.

After the orchestrators are up and running, you can add Edge Devices as workers to your cluster (see: [Add Edge Devices (Workers) to Your Setup](/docs/getting-started/oak-environment/add-edge-devices-workers-to-your-setup/)).

{{< svg "deploy-orchestrators" >}}

You can install the **Root** and **Cluster Orchestrator** in a single machine using the following commands:

1) Install the `oak` cli in your machine:
```bash
curl -sfL oakestra.io/oak.sh | bash
```

2) Perform a full Root + Cluster + Worker installation using:
```bash
oak install full alpha-v0.4.410
```
The installer will as you to start your worker right away or not.
**If you choose to not start it right away** you can do so later on using:
```bash
oak worker -d
```

{{< callout context="note" title="Did you know?" icon="outline/info-circle" >}}
You can set a multi-cluster infrastructure by installing each **Cluster Orchestrator** and **Worker Node** on a different machine.
Check out [Advanced Oakestra Clusters Setup](/docs/manuals/advanced-cluster-setup) section for more details.
{{< /callout >}}

{{< callout context="caution" title="Network Configuration" icon="outline/alert-triangle">}}
If you run into a restricted network (e.g., on a cloud VM) you need to configure the firewall rules and the NetManager component accordingly. Please refer to: [Firewall Setup](../../../manuals/firewall-configuration)
{{< /callout >}}

If the installation command succeded you can now check if your cluster is properly showing up using the command:
```bash
oak cluster ls
```

If your cluster is showing up with 1 active node, **congratulations! 🎉🎉**

If not, wait a few minutes, the cluster startup might take a while. If still nothing happens, you can refer to the [Troubleshooting Guide](../../../manuals/troubleshooting).

### Shutdown the Components

To stop your **Worker node** run:

```bash
oak worker stop
```

{{< callout context="note" title="Restart your worker" icon="outline/info-circle" >}}
You if you stop your worker without uninstalling it, you can use the following command to re-start it in background:
```bash
oak worker -d
```
{{< /callout >}}

To uninstall your **Worker node** run:
```bash
oak uninstall worker
```

To stop your **Root and cluster** run:

```bash
oak uninstall cluster && oak uninstall root
```
