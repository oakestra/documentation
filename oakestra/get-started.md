# Get Started with Oakestra


<div style="
	background:#fd0;
	border-radius: 25px;
	margin:5px;
	padding:10px;
	
">

	<span> Oakestra platform is still under active development. This guide can change on a weekly basis. </span>
	
</div>

<div style="
	background:#fd0;
	border-radius: 25px;
	margin:5px;
	padding:10px;
	
">

	<span> <b>Help needed!</b> Feel free to propose your ideas and share your expertise. Thank you in advance!</span>
	
</div>


## High level architecture

![High level architecture picture](res/highLevelArch.png)

Oakestra let you deploy your workload on devices of any size. From a small RasperryPi to a cloud instance far away on GCP or AWS. The tree structure enables you to create multiple clusters of resources.

* The **Root Orchestrator** manages different clusters of resources. The root only sees aggregated cluster resources. 
* The **Cluster orchestrator** manages your worker nodes. This component collects the real time resources and schedules your workloads to the perfect matching device.
* A **Worker** is any device where a component called NodeEngine is installed. Each node can support multiple execution environment such as Containers (containerd runtime), MicroVM (containerd runtime) and Unikernels (mirageOS). 


## Create your first Oakestra cluster

Let's start simple with a single node deployment, where all the components are in the same device. Then, we will separate the components and use multiple devices until we're able to create multiple clusters. 

<div style="
	background:lightgrey;
	border-radius: 25px;
	margin:5px;
	padding:10px;
	
">
	<b>Requirements: <br></b>
	<ul>
		<li> Linux (Workers only)
 		<li> Docker + Docker compose (Orchestrators only)
	</ul>
	
</div>

### 1-DOC (1 Device, One Cluster) 

In this example we are going to use a single device to deploy all the components. This is not recommended for production environments but it is quite cool for home environment and development. 

![Deployment example with a signle device](res/SingleNodeExample.png)

0) First let's export the required environment variables

```
## Url that points to the location of our root orchestrator
# export SYSTEM_MANAGER_URL=<IP ADDRESS OF THE MACHINE>

## Choose a unique name for your cluster
export CLUSTER_NAME=My_Awesome_Cluster
## Come up with a name for the current location
export CLUSTER_LOCATION=My_Awesome_Apartment
```

**1)** now clone the repository and move into it using:

```
$ git clone https://github.com/edgeIO/edgeio.git && cd edgeio
```

**2)** Run a local 1-DOC cluster

```
$ sudo -E docker-compose -f run-a-cluster/1-DOC-<arch>.yml up -d
```
( please replace < arch > with your device architecture: **arm** or **amd64** )


**3)** download, untar and install the node engine package

```
$ wget -c https://github.com/edgeIO/edgeio/releases/download/NodeEngine-v0.01/GoNodeEngine.tar.gz && tar -C GoNodeEngine -xzf GoNodeEngine.tar.gz && cd GoNodeEngine && ./install.sh <arch>
```
( please replace < arch > with your device architecture: **arm** or **amd64** )

**4)** (optional) download and unzip and install the network manager, this enables an overlay network across your services

```
$ wget -c https://github.com/edgeIO/edgeionet/releases/download/v0.03-experimental/NetManager.tar.gz && tar -C .  -xzf GoNodeEngine.tar.gz && cd NetManager && ./install.sh <arch>
```
( please replace < arch > with your device architecture: **arm** or **amd64** )

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


**5)** start the NodeEngine. Please use the `-n 6000` parameter only if you started the netowrk component on step 4. This paramenter in fact is used to specifcy the internal port of the network component, if any. 

```
sudo NodeEngine -n 6000 -p 10100
```
( you can use `NodeEngine -h` for further details )



### M-DOC (M Devices, One Cluster)

The M-DOC deployment enables you to deploy One cluster with multiple worker nodes. The main difference between this deployment and 1-DOC is that here the worker nodes might be external and there can be multiple of them. 

![](res/1ClusterExample.png)

The deployment of this kind of cluster is similar to 1-DOC. We first need to start the root and cluster orchestrator and then to attach the worker nodes. 

**1)** On the node that you wish to use as a cluster and root orchestrator execute step **1-DOC.1** and **1-DOC.2**

**2)** Now we need to prepare all the worker nodes. On each worker node execute the following:

2.1) Downlaod and unpack both the NodeEngine and the NetManager:

```
$ wget -c https://github.com/edgeIO/edgeio/releases/download/NodeEngine-v0.01/GoNodeEngine.tar.gz && tar -C GoNodeEngine -xzf GoNodeEngine.tar.gz && cd GoNodeEngine && ./install.sh <arch>

$ wget -c https://github.com/edgeIO/edgeionet/releases/download/v0.03-experimental/NetManager.tar.gz && tar -C .  -xzf GoNodeEngine.tar.gz && cd NetManager && ./install.sh <arch>

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

This represents the most versatile deployment. You have the possibility to split your resoruces in multiple clusters, within different locations and with different resources. In this deployment we need to deploy the Root and the Cluster orchestrator on different nodes. Each indipended clsuter orchestrator represent a different cluster of resoruces. The worker nodes attached to each cluster are aggregated and seen as a unique big resoruce from the point of view fo the Root. This deployment isolates the resources from  the root perspective and delegates the resposibility to the cluester orchestrator. 
![](res/2ClusterExample.png) 

**1)** In this first step we need to deploy the RootOrchestrator component on a Node. To do this, on the desired node you need to clone the repository, move to the root orchestrator folder and execute the startup command. 
 
```
$ git clone https://github.com/edgeIO/edgeio.git && cd edgeio

$ sudo -E docker-compose -f root_orchestrator/docker-compose-<arch>.yml up
```
( please replace < arch > with your device architecture: **arm** or **amd64** )

**2)** For each node that needs to host a cluster orchestrator you need to:
2.1) Export the ENV variables needed to connect to the cluster orchestrator:

```
export SYSTEM_MANAGER_URL=<IP ADDRESS OF THE NODE HOSTING THE ROOT ORCHESTRATOR>
export CLUSTER_NAME=<choose a name for your cluster>
export CLUSTER_LOCATION=<choose a name for the cluster's location>
```

2.2) Clone the repo and run the cluster orchestrator:

```
$ git clone https://github.com/edgeIO/edgeio.git && cd edgeio

$ sudo -E docker-compose -f cluster_orchestrator/docker-compose-<arch>.yml up
```
( please replace < arch > with your device architecture: **arm** or **amd64** )

**3)** Start and configure each worker as described in M-DOC.2

### Hybrids

You should have got the gists now, but if you want you can build the infrastructure by composing the components like LEGO blocks.
You want to give your Cluster Orchestrator computational capabilities? Deploy the NodeEngine+Netmanager compoentns and you're done. You don't want to use a separate node for the Root Orcestrator? Simply deploy it all together with a cluster orchestrator.

## Deploy your first application
### Create a deployment descriptor
### Deployment CLI

