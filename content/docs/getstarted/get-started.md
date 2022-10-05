---
title: "Get Started with Oakestra"
date: 2022-10-05T09:56:27+02:00
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
git clone https://github.com/oakestra/oakestra.git && cd oakestra
```

**2)** Run a local 1-DOC cluster

```
sudo -E docker-compose -f run-a-cluster/1-DOC.yml up
```


**3)** download, untar and install the node engine package

```
wget -c https://github.com/oakestra/oakestra/releases/download/v0.4.2/NodeEngine_$(dpkg --print-architecture).tar.gz && tar -xzf NodeEngine_$(dpkg --print-architecture).tar.gz && chmod +x install.sh && ./install.sh
```

**4)** (optional) download and unzip and install the network manager; this enables an overlay network across your services

```
wget -c https://github.com/oakestra/oakestra-net/releases/download/v0.4.2/NetManager_$(dpkg --print-architecture).tar.gz && tar -xzf NetManager_$(dpkg --print-architecture).tar.gz && chmod +x install.sh && ./install.sh $(dpkg --print-architecture)
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
wget -c https://github.com/oakestra/oakestra/releases/download/v0.4.2/NodeEngine_$(dpkg --print-architecture).tar.gz && tar -xzf NodeEngine_$(dpkg --print-architecture).tar.gz && chmod +x install.sh && ./install.sh

wget -c https://github.com/oakestra/oakestra-net/releases/download/v0.4.2/NetManager_$(dpkg --print-architecture).tar.gz && tar -xzf NetManager_$(dpkg --print-architecture).tar.gz && chmod +x install.sh && ./install.sh $(dpkg --print-architecture)
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

All we need to do to deploy an application is to create a deployment descriptor and submit it to the platform using the APIs.

### Deployment descriptor

In order to deploy a container a deployment descriptor must be passed to the deployment command. 
The deployment descriptor contains all the information that Oakestra needs in order to achieve a complete
deploy in the system. 

Since version 0.4, Oakestra (previously, EdgeIO) uses the following deployment descriptor format. 

`deploy_curl_application.yaml`

```yaml
{
  "sla_version" : "v2.0",
  "customerID" : "Admin",
  "applications" : [
    {
      "applicationID" : "",
      "application_name" : "clientsrvr",
      "application_namespace" : "test",
      "application_desc" : "Simple demo with curl client and Nginx server",
      "microservices" : [
        {
          "microserviceID": "",
          "microservice_name": "curl",
          "microservice_namespace": "test",
          "virtualization": "container",
          "cmd": ["sh", "-c", "tail -f /dev/null"],
          "memory": 100,
          "vcpus": 1,
          "vgpus": 0,
          "vtpus": 0,
          "bandwidth_in": 0,
          "bandwidth_out": 0,
          "storage": 0,
          "code": "docker.io/curlimages/curl:7.82.0",
          "state": "",
          "port": "9080",
          "added_files": []
        },
        {
          "microserviceID": "",
          "microservice_name": "nginx",
          "microservice_namespace": "test",
          "virtualization": "container",
          "cmd": [],
          "memory": 100,
          "vcpus": 1,
          "vgpus": 0,
          "vtpus": 0,
          "bandwidth_in": 0,
          "bandwidth_out": 0,
          "storage": 0,
          "code": "docker.io/library/nginx:latest",
          "state": "",
          "port": "6080:60/tcp",
          "addresses": {
            "rr_ip": "10.30.30.30"
          },
          "added_files": []
        }
      ]
    }
  ]
}
```

This deployment descriptor example generates one application named *clientserver* with the `test` namespace and two microservices:
- nginx server with test namespace, namely `clientserver.test.nginx.test`
- curl client with test namespace, namely `clientserver.test.curl.test`

This is a detailed description of the deployment descriptor fields currently implemented:
- sla_version: the current version is v0.2
- customerID: id of the user, default is Admin
  - application list, in a single deployment descriptor is possible to define multiple applications, each containing:
    - Fully qualified app name: A fully qualified name in Oakestra is composed of 
        - application_name: unique name representing the application (max 10 char, no symbols)
        - application_namespace: namespace of the app, used to reference different deployment of the same application. Examples of namespace name can be `default` or `production` or `test` (max 10 char, no symbols)
        - applicationID: leave it empty for new deployments, this is needed only to edit an existing deployment.  
    - application_desc: Short description of the application
    - microservice list, a list of the microservices composing the application. For each microservice the user can specify:
      - microserviceID: leave it empty for new deployments, this is needed only to edit an existing deployment.
      - Fully qualified service name:
        - microservice_name: name of the service (max 10 char, no symbols)
        - microservice_namespace: namespace of the service, used to reference different deployment of the same service. Examples of namespace name can be `default` or `production` or `test` (max 10 char, no symbols)
      - virtualization: currently the only uspported virtualization is `container`
      - cmd: list of the commands to be executed inside the container at startup
      - vcpu,vgpu,memory: minimum cpu/gpu vcores and memory amount needed to run the container
      - vtpus: currently not implemented
      - storage: minimum storage size required (currently the scheduler does not take this value into account)
      - bandwidth_in/out: minimum required bandwith on the worker node. (currently the scheduler does not take this value into account)
      - port: port mapping for the container in the syntax hostport_1:containerport_1\[/protocol];hostport_2:containerport_2\[/protocol] (default protocol is tcp)
      - addresses: allows to specify a custom ip address to be used to balance the traffic across all the service instances. 
        - rr\_ip: [optional filed] This field allows you to setup a custom Round Robin network address to reference all the instances belonging to this service. This address is going to be permanently bounded to the service. The address MUST be in the form `10.30.x.y` and must not collide with any other Instance Address or Service IP in the system, otherwise an error will be returned. If you don't specify a RR_ip and you don't set this field, a new address will be generated by the system.
      - constraints: array of constraints regarding the service. 
        - type: constraint type
          - `direct`: Send a deployment to a specific cluster and a specific list of eligible nodes. You can specify `"node":"node1;node2;...;noden"` a list of node's hostnames. These are the only eligible worker nodes.  `"cluster":"cluster_name"` The name of the cluster where this service must be scheduled. E.g.:
         
    ```
    "constraints":[
                {
                  "type":"direct",
                  "node":"xavier1",
                  "cluster":"gpu"
                }
              ]
    ```
 
### Login to the APIs
After running a cluster you can use the debug OpenAPI page to interact with the apis and use the infrastructure

connect to `<root_orch_ip>:10000/api/docs`

Authenticate using the following procedure:

1. locate the login method and use the try-out button
![try-login](getstarted/login-try.png)
2. Use the default Admin credentials to login
![execute-login](getstarted/login-execute.png)
3. Copy the result login token
![token-login](getstarted/login-token-copy.png)
4. Go to the top of the page and authenticate with this token
![auth-login](getstarted/authorize.png)
![auth2-login](getstarted/authorize-2.png)

### Register an application and the services
After you authenticate with the login function, you can try out to deploy the first application. 

1. Upload the deployment description to the system. You can try using the deployment descriptor above.
![post app](getstarted/post-app.png)

The response contains the Application id and the id for all the application's services. Now the application and the services are registered to the platform. It's time to deploy the service instances! 

You can always remove or create a new service for the application using the /api/services endpoints

### Deploy an instance of a registered service 

1. Trigger a deployment of a service's instance using `POST /api/service/{serviceid}/instance`

each call to this endpoint generates a new instance of the service

### Monitor the service status

1. With `GET /api/aplications/<userid>` (or simply /api/aplications/ if you're admin) you can check the list of the deployed application.
2. With `GET /api/services/<appid>` you can check the services attached to an application
3. With `GET /api/service/<serviceid>` you can check the status for all the instances of <serviceid>

### Undeploy 

- Use `DELETE /api/service/<serviceid>` to delete all the instances of a service
- Use `DELETE /api/service/<serviceid>/instance/<instance number>` to delete a specific instance of a service
- Use `DELETE /api/application/<appid>` to delete all together an application with all the services and instances

### Check if the deployment succeded

If both services show the status **ACTIVE** then everything went fine. Otherwise, there might be a configuration issue or a bug. Please debug it with `docker logs system_manager -f --tail=100` on the root orchestrator and with `docker logs cluster_manager -f --tail=100` on the cluster orchestrator and open an issue. 

If both services are ACTIVE, it is time to test the communication. 

Move into the worker node hosting the client and use the following command to log into the container. 

```
sudo ctr -n edge.io task exec --exec-id term1 Client.default.client.default /bin/sh
```

Once we are inside our client, we can curl the Nginx server and check if everything works.

```
curl 10.30.30.30
```  

Note that this address is the one we specified in the Nginx's deployment descriptor. 
