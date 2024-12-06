---
title: "Add Edge Devices (Workers) to Your Setup"
summary: ""
draft: false
weight: 103
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

### Add a Worker Node to your Cluster

If you have a running **Root Orchestrator** and at least one **Cluster Orchestrator** you can add a new worker node to your cluster. 

![High level architecture picture](/archive/alpha-bass/deploy-worker.png)

First, you need to install your **Worker Node** components on every Edge Device you want to use as a worker running:

```bash
export OAKESTRA_VERSION=alpha
curl -sfL https://raw.githubusercontent.com/oakestra/oakestra/develop/scripts/InstallOakestraWorker.sh | sh -  
```


Each worker node must be attached to a running **Cluster Orchestrator**. To do so, you need to know the IP address of the Cluster Orchestrator you want to connect to. 

Then, startup each **Worker Node** using the following command:

```bash
sudo NodeEngine -a <IP address of your cluster orchestrator> -d
```

the `-d` flag runs the NodeEngine in background (detached mode)

Check if your worker is running, and it's correctly registered to your cluster:
```bash
sudo NodeEngine status
```

If everything is showing up green 🟢... Congratulations, your worker node is set up! 🎉

![running](/archive/alpha-bass/running.png)


You can check the NodeEngine logs using 

```bash
sudo NodeEngine logs
```



If you run into a restricted network (e.g., on a cloud VM) you need to configure the firewall rules and the NetManager component accordingly. Please refer to: [Firewall Setup](../firewall-configuration)  


### Shutdown a Worker

To stop a worker node, use:

```bash
sudo NodeEngine stop
```

