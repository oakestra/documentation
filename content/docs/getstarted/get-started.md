---
title: "Get Started with Oakestra"
date: 2022-08-08T15:56:27+02:00
draft: false
categories:
    - Docs
tags:
    - GetSarted
---

![](/wiki-banner-help.png)

# Get Started with Oakestra

**Table of content:**

- [High-level archtecture](#high-level-architecture)
- [Create your first Oakestra cluster](#create-your-first-oakestra-cluster)
- [Deploy your first applications](#deploy-your-first-applications)

## High-level architecture

![High level architecture picture](/getstarted/highLevelArch.png)

Oakestra lets you deploy your workload on devices of any size. From a small RasperryPi to a cloud instance far away on GCP or AWS. The tree structure enables you to create multiple clusters of resources.

* The **Root Orchestrator** manages different clusters of resources. The root only sees aggregated cluster resources. 
* The **Cluster orchestrator** manages your worker nodes. This component collects the real-time resources and schedules your workloads to the perfect matching device.
* A **Worker** is any device where a component called NodeEngine is installed. Each node can support multiple execution environments such as Containers (containerd runtime), MicroVM (containerd runtime), and Unikernels (mirageOS).

Disclaimer, currently, only containers are supported. Help is still needed for Unikernels and MicroVMs. 


## Create your first Oakestra cluster

Let's start simple with a single node deployment, where all the components are in the same device. Then, we will separate the components and use multiple devices until we're able to create multiple clusters. 

### Requirements:

- Linux (Workers only)
- Docker + Docker compose (Orchestrators only)

### 1-DOC (1 Device, One Cluster) 

In this example, we will use a single device to deploy all the components. This is not recommended for production environments, but it is pretty cool for home environments and development. 

![Deployment example with a single device](/getstarted/SingleNodeExample.png)

**0)** First, let's export the required environment variables

```
## Choose a unique name for your cluster
export CLUSTER_NAME=My_Awesome_Cluster
## Come up with a name for the current location
export CLUSTER_LOCATION=My_Awesome_Apartment
```

**1)** now clone the repository and move into it using:

```
git clone https://github.com/edgeIO/edgeio.git && cd edgeio
```

**2)** Run a local 1-DOC cluster

```
sudo -E docker-compose -f run-a-cluster/1-DOC-<arch>.yml up -d
```
( please replace < arch > with your device architecture: **arm** or **amd64** )


**3)** download, untar and install the node engine package

```
wget -c https://github.com/oakestra/oakestra/releases/download/NodeEngine-v0.02/NodeEngine.tar.gz && tar -xzf NodeEngine.tar.gz && cd NodeEngine/build && chmod +x install.sh && ./install.sh <arch>
```
( please replace < arch > with your device architecture: **arm-7** or **amd64** )

**4)** (optional) download and unzip and install the network manager; this enables an overlay network across your services

```
wget -c https://github.com/oakestra/oakestra-net/releases/download/v0.04-experimental/NetManager.tar.gz && tar -xzf NetManager.tar.gz && cd NetManager && chmod +x install.sh && ./install.sh <arch>
```
( please replace < arch > with your device architecture: **arm-7** or **amd64** )

4.1) Edit `/etc/netmanager/netcfg.json` as follows:

```
{
  "NodePublicAddress": "<IP ADDRESS OF THIS DEVICE>",
  "NodePublicPort": "<PORT REACHABLE FROM OUTSIDE, use 50103 as default>",
  "ClusterUrl": "localhost",
  "ClusterMqttPort": "10003"
}
```
4.2) start the NetManager on port 6000

```
sudo NetManager -p 6000 &
```


**5)** start the NodeEngine. Please only use the `-n 6000` parameter if you started the network component in step 4. This parameter, in fact, is used to specify the internal port of the network component, if any. 

```
sudo NodeEngine -n 6000 -p 10100
```
( you can use `NodeEngine -h` for further details )



### M-DOC (M Devices, One Cluster)

The M-DOC deployment enables you to deploy One cluster with multiple worker nodes. The main difference between this deployment and 1-DOC is that the worker nodes might be external here, and there can be multiple of them. 

![](/getstarted/1ClusterExample.png)

The deployment of this kind of cluster is similar to 1-DOC. We first need to start the root and cluster orchestrator. Afterward, we can attach the worker nodes. 

**1)** On the node you wish to use as a cluster and root orchestrator, execute steps **1-DOC.1** and **1-DOC.2**

**2)** Now, we need to prepare all the worker nodes. On each worker node, execute the following:

2.1) Downlaod and unpack both the NodeEngine and the NetManager:

```
wget -c https://github.com/oakestra/oakestra/releases/download/NodeEngine-v0.02/NodeEngine.tar.gz && tar -xzf NodeEngine.tar.gz && cd NodeEngine/build && chmod +x install.sh && ./install.sh <arch>

wget -c https://github.com/oakestra/oakestra-net/releases/download/v0.04-experimental/NetManager.tar.gz && tar -xzf NetManager.tar.gz && cd NetManager && chmod +x install.sh && ./install.sh <arch>
```

2.2) Edit `/etc/netmanager/netcfg.json` accordingly:

```
{
  "NodePublicAddress": "<IP ADDRESS OF THIS DEVICE>",
  "NodePublicPort": "<PORT REACHABLE FROM OUTSIDE, use 50103 as default>",
  "ClusterUrl": "<IP ADDRESS OF THE CLSUTER ORCHESTRATOR>",
  "ClusterMqttPort": "10003"
}
``` 
2.3) Run the NetManager and the NodeEngine components:

```
sudo NetManager -p 6000 &
sudo NodeEngine -n 6000 -p 10100 -a <IP ADDRESS OF THE CLSUTER ORCHESTRATOR>
```

### MDNC (M Devices, N Clusters)

This represents the most versatile deployment. You can split your resources into multiple clusters within different locations and with different resources. In this deployment, we need to deploy the Root and the Cluster orchestrator on different nodes. Each independent clsuter orchestrator represents a cluster of resources. The worker nodes attached to each cluster are aggregated and seen as a unique big resource from the point of view of the Root. This deployment isolates the resources from the root perspective and delegates the responsibility to the cluster orchestrator. 
![](/getstarted/2ClusterExample.png) 

**1)** In this first step, we need to deploy the RootOrchestrator component on a Node. To do this, you need to clone the repository on the desired node, move to the root orchestrator folder, and execute the startup command. 
 
```
git clone https://github.com/edgeIO/edgeio.git && cd edgeio

sudo -E docker-compose -f root_orchestrator/docker-compose-<arch>.yml up
```
( please replace < arch > with your device architecture: **arm** or **amd64** )

**2)** For each node that needs to host a cluster orchestrator, you need to:
2.1) Export the ENV variables needed to connect to the cluster orchestrator:

```
export SYSTEM_MANAGER_URL=<IP ADDRESS OF THE NODE HOSTING THE ROOT ORCHESTRATOR>
export CLUSTER_NAME=<choose a name for your cluster>
export CLUSTER_LOCATION=<choose a name for the cluster's location>
```

2.2) Clone the repo and run the cluster orchestrator:

```
git clone https://github.com/edgeIO/edgeio.git && cd edgeio

sudo -E docker-compose -f cluster_orchestrator/docker-compose-<arch>.yml up
```
( please replace < arch > with your device architecture: **arm** or **amd64** )

**3)** Start and configure each worker as described in M-DOC.2

### Hybrids

You should have got the gist now, but if you want, you can build the infrastructure by composing the components like LEGO blocks.
Do you want to give your Cluster Orchestrator computational capabilities for the deployment? Deploy there the NodeEngine+Netmanager components, and you're done. You don't want to use a separate node for the Root Orchestrator? Simply deploy it all together with a cluster orchestrator.

## Deploy your first application

Let's try deploying an Nginx server and a client. Then we'll enter inside the client container and try to curl Nginx. 

All we need to do to deploy an application is to create a deployment descriptor and submit it to the platform using the CLI.

### Deployment descriptors

**1)** Let's create the Nginx deployment descriptor. Create a file named `nginx.yaml` and insert the following.

```
api_version: v0.1
app_name: Nginx
app_ns: default
service_name: server
service_ns: default
image: docker.io/library/nginx:latest
image_runtime: docker
RR_ip: 10.30.30.30
port: 80:80
cmd: []
requirements:
    cpu: 1 # cores
    memory: 200  # in MB
```

**2)** Let's create a client container using the curl image. Create a file named `client.yaml` and insert the following.

```
api_version: v0.1
app_name: Client
app_ns: default
service_name: client
service_ns: default
image: docker.io/curlimages/curl:7.82.0
image_runtime: docker
commands: ["sh", "-c", "tail -f /dev/null"]
requirements:
    cpu: 1 # cores
    memory: 100  # in MB
```

A detailed description of these fields can be found in the **Deployment descriptors** section of the Wiki. 

### Deployment CLI

On the root orchestrator's node use the following commands to deploy the Nginx container and then the Client container.

```
curl -F file=@'nginx.yaml' http://localhost:10000/api/deploy -v

curl -F file=@'client.yaml' http://localhost:10000/api/deploy -v
```

Check the status of the deployment:

```
curl localhost:10000/api/jobs | json_pp
```

If both services show the status **ACTIVE** then everything went fine. Otherwise, there might be a configuration issue or a bug. Please debug it with `docker logs system_manager -f --tail=100` on the root orchestrator and with `docker logs cluster_manager -f --tail=100` on the cluster orchestrator and open an issue. 

If both services are ACTIVE is time to test the communication. 

Move into the worker node hosting the client and use the following command to log into the container. 

```
sudo ctr -n edge.io task exec --exec-id term1 Client.default.client.default /bin/sh
```

Once we are inside our client, we can curl the Nginx server and check if everything works.

```
curl 10.30.30.30
```  

Note that this address is the one we specified in the Nginx's deployment descriptor. 
