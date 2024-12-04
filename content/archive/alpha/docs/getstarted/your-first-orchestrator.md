---
title: "Create your first Oakestra Orchestrator"
summary: ""
draft: false
weight: 101
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

Let's get you up to speed with the easiest possible setup. You'll be able to run your first Oakestra Orchestrator in a few seconds!

### Startup the Orchestrators in a Single Machine

In this guide, we'll perform a Single Machine Setup. This setup is the easiest way to get started with Oakestra with a single Cluster managed by a single machine. To do so, we'll install the **Root Orchestrator** and the **Cluster Orchestrator** together, as shown in the following figure. 

After the orchestrators are up and running, you can add Edge Devices as workers to your cluster (see: [Add Edge Devices (Workers) to Your Setup](/docs/getting-started/oak-environment/add-edge-devices-workers-to-your-setup/)). 

![Deploy everything on a single machine](/archive/alpha-bass/deploy-orch.png)

You can install the **Root** and **Cluster Orchestrator** in a single machine using the following command:

```bash
curl -sfL oakestra.io/getstarted.sh | sh - 
```

This command downloads and runs the Oakestra's docker compose files in `~/oakestra` folder. 


If the startup succeeds, **congratulations! 🎉🎉**
You're now ready to add your first worker node to your cluster (see: [Add Edge Devices (Workers) to Your Setup](/docs/getting-started/oak-environment/add-edge-devices-workers-to-your-setup/)).

### Shutdown the Components

To stop your **Root & Cluster** orchestrator components run:

```bash
docker compose -f ~/oakestra/compose-single-machine.yaml down
```

### Firewall Configuration


**If** you're running Oakestra on a restricted network, **e.g., on cloud VMs**, you need to configure the firewall rules accordingly. 

These are the ports that need to be open for the Oakestra components to communicate. 

Root: 
  - External APIs: port `10000` (APIs used by the CLI and the Web Interface to interact with the Root Orchestrator)
  - Cluster APIs: ports `10099`,`10000` (APIs used by each Cluster Orchestrator)

Cluster: 
  - Worker's Broker: port `10003` (MQTT Broker port, used by the workers to communicate with the Cluster Orchestrator)
  - Worker's APIs: port `10100` (HTTP APIs used by the workers to perform the initial cluster handshake)

Worker: 
  - P2P tunnel towards other workers: port `50103` (P2P tunnel used by the workers to communicate with each other; this port can be customized for each worker, check [Worker P2P Tunnel Configuration](#worker-p2p-tunnel-configuration) for more details)


### Worker P2P Tunnel Configuration

The NetManager component, responsible for the worker nodes' P2P tunnel, must be configured with (i) the IP Address where the other workers can reach the current device and (ii) the port where the tunnel is exposed. 

The P2P tunnel is used to exchange service traffic across nodes. Each worker node must be reachable from the other workers at the specified address and port.

Follow these steps on every **Worker Node**

1) Shutdown your worker node components using 
```bash
sudo NodeEngine stop
````

2) Edit the NetManager configuration file `/etc/netmanager/netcfg.json` as follows:

```json
{
  "NodePublicAddress": "<IP ADDRESS OF THIS DEVICE, must be reachable from the other workers>",
  "NodePublicPort": "<TUNNEL PORT, The PORT must be reachable from the other workers, use 50103 as default>",
  "ClusterUrl": "<IP Address of cluster orchestrator or 0.0.0.0 if deployed on the same machine>",
  "ClusterMqttPort": "10003",
  "Debug": False
}
```

3) Restart the NodeEngine
```bash
sudo NodeEngine -a <IP address of your cluster orchestrator> -d
````





