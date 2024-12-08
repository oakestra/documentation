---
title: "Gateway architecture"
date: 2023-28-01T12:56:27+02:00
draft: true
hidden: false
---

Here we show the design of [Oakestra's gateway](https://github.com/smnzlnsk/oakestra-gw) architecture and explain the functionality of its components.

The building blocks are:

* General Design
* Setup
* Management API
* Gateway and Firewall
* Network flow
* Error handling

## General Design

--------------

A gateway in Oakestra is a special worker node inside a cluster. It has to have a public IP address. Unlike the containerized applications deployed inside Oakestra, the gateway binary is running directly on the worker hardware. This is due to the need of direct access to the node's firewall.

![Gateway Example](TODO)

## Setup

--------------

The deployment and setup of a gateway component consists of multiple steps.

* Registration
* Deployment
* Configuration
* Callback

### Registration

--------------

In order to deploy a gateway in the infrastructure, we need to publish a specialized deployment descriptor to the root orchestrator.

An example descriptor can look like the following:

`example_descriptor.yaml`

```json
{
    "sla_version" : "v2.0",
    "customerID" : "Admin",
    "gateway" : {
        "gateway_ID" : "",
        "gateway_name" : "cluster-02-gw",
        "gateway_desc" : "Walhalla Cluster Gateway",
        "public_gateway_ips" : [
            "131.159.24.1", "131.159.24.2", "131.159.24.3",
        ]
    },
    "cluster" : {
        "cluster_ID" : "6b19409123fa8ac88c139",
        "cluster_name" : "Walhalla"
    }
}
```

The detailed description of the descriptor fields is the following:

* sla_version: the currently used version is v2.0
* customerID: identification of the user, default is Admin
* gateway: gateway configuration descriptor
  * gateway_ID: unique identifier
  * gateway_name: naming scheme template
  * gateway_desc: short description of gateway (optional)
  * public_gateway_ips: list of worker node public IPs in desired cluster to try to set up gateway on
* cluster: cluster configuration descriptor
  * cluster_ID: unique cluster identifier
  * cluster_name: cluster name

After successfull publishing the root orchestrator signals to the selected cluster that a gateway descriptor was handed in, which verifies the validity of the `public_gateway_ips`. At this point our gateway should be ready to be deployed on a worker node.

### Deployment

--------------

The deployment of a gateway worker is triggered by a API call to the root orchestrator, which signals the cluster orchestrator to deploy the gateway.

The cluster orchestrator - or cluster scheduler to be precise - then goes ahead and schedules the deployment by choosing one of the available workers from the `public_gateway_ips` array. If none are available or online, the cluster signals an error.

Upon successfull selection of a worker, the cluster orchestrator initiates the configuration of the worker node by running the gateway binary.

### Configuration

--------------

The configuration of a worker happens on startup of the binary by calling the API endpoints `/api/gateway/register` of the cluster orchestrator's service-managers. The API, upon successfull registration, returns the gateway's unique identifier, which it then uses to retrieve a Oakestra internal IP address, which it proceeds to use for all forwarding purposes throughout its lifetime. The IPs are retrieved by calling the API endpoint `/api/gateway/<id>/ip`. The IPs received are then used to create a new network bridge towards the Oakestra network. These IPs are also the entry point for the Management API, which is described further down below.
Additionally the gateway sets up the needed forwarding tables for connection tracking, as well as the firewall tables for service exposure.

At this stage the gateway is set up for operation.

### Callback

--------------

In the callback phase the now deployed and functional gateway reports back to the cluster orchestrator of its readiness to forward traffic to and from workers. The cluster orchestrator then sends a notice to all worker nodes that the gateway is now ready to use, triggering a (re-)configuration of the workers' routes in order to start using the gateway.

## Management API

--------------

The Management API is mainly used to add and delete exposed services to the gateway. It exposes following endpoints at the internal Oakestra IP on port 11022:

* `/api/service/exposure/add` : Add service exposure to firewall
* `/api/service/exposure/delete` : Delete service exposure from firewall

These endpoints talk to the gateway and firewall to go through the necessary routine in order to forward the traffic from or to the workers / Internet.

## Forwarding and Firewall

--------------

Upon requesting the addition of a service to expose, the gateway component keeps track of service exposure state by adding a document to its table in the form:

|Exposed Port|Internal Service IP|Internal Service Port|
|------------|-------------------|---------------------|
|8080|10.30.0.1|80|
|8080|fdff:2000::1|80|

As you can observe, the table contains entries for IPv4 and IPv6 addresses to be exposed - setting the firewall rules for the according IP version.

Based on these entries the gateway goes ahead and sets up the forwarding in the firewall, resulting in connections coming in at the public gateway IP at port e.g. 8080 to be forwarded to 10.30.0.1:80, if the source address was using IPv4. For IPv6 it would match the IPv6 rule.

After the firewall the request is forwarded to the components NetManager, which is responsible for the interconnection between workers and clusters. Based on the destination address it would go ahead and set up a tunnel to the worker associated with hosting the service, also in respect to the balancing policies associated with the IP address.

## Network Flow

--------------

This chapter has moved [here](/documentation/content/docs/gateway/gateway_network_flow.md) due to its size.

## Error handling

--------------

This chapter has moved [here](/documentation/content/docs/gateway/gateway_error_handling.md) due to its size.
