---
title: "Gateway Network Flow"
date: 2023-28-01T12:56:27+02:00
draft: true
hidden: false
---

This is the chapter explaining the different steps a packet takes inside the Oakestra network, if it passes through the Gateway along the way.

In general you can describe four different flows, which we will talk about:

* External Client -> Service inside the Gateway Cluster
* External Client -> Service outside the Gateway Cluster
* Service inside our Gateway Cluster -> External Client
* Service outside our Gateway Cluster -> External Client

## External Client to Service

-----

An external client is anyone outside of the Oakestra network, whose entry point to the network is the Oakestra gateway.

### Service Inside our Cluster

-----

Here we describe the packet modifications done by the Oakestra networking components on their way to the destination, if the destination is in the same cluster as the deployed Gateway. We also give a short summary of packet state based on a random example.
The steps a request towards a service can be described as the following:

1. Request arrives at public Gateway IP on an exposed Port and passes through firewall towards listening Gateway Thread. The firewall forwards the request, rewriting the Destination IP to the Oakestra internal IP.

```json
Original packet fields as it arrives at Gateway:
Source IP      : Port > 93.6.1.78     : 51671
Destination IP : Port > 24.0.5.8      : 8080

after passing through firewall:

Source IP      : Port > 93.6.1.78     : 51671
Destination IP : Port > 10.30.255.253 : 8080
```

2. The Destination Port is mapped against the exposed Service in Exposed Services table. The resulting Service IP and port from the mapping are used to rewrite the Destination IP and port of the packet. Additionally, the Gateway creates an entry in the Forward table, to keep track for later retranslation. It sets the Source IP to the gateways Oakestra internal IP, keeping the port for later retranslation. An example table entry contains:
`[client_ip, client_port, service_ip, service_port, exposed_service_port] -> [93.6.1.78 , 51671 , 10.30.30.30 , 80 , 8080]`

```json
Source IP      : Port > 10.30.255.253 : 51671
Destination IP : Port > 10.30.30.30   : 80
```

3. At this point this packet looks like a regular Oakestra internal service to service Request. This packet is handed over to the NetManager, who takes decision on the underlying balancing strategy of the service IP, as well as querying the destination node. After querying, the NetManager establishes a tunnel to the destination node and forwards the request to the service instance's Namespace IP.

```json
Source IP      : Port > 10.30.255.253 : 51671
Destination IP : Port > 10.18.0.1     : 80
```

4. Upon receiving the response the NetManager hands the packet back to the Gateway Thread for retranslation.

```json
Source IP      : Port > 10.30.30.30   : 80
Destination IP : Port > 10.30.255.253 : 51671
```

5. The Gateway at this point goes ahead and fetches the Client's IP from the Forward table based on the Destination Port in order to set the Destination IP, as well as the Exposed Service Port for the Source Port. For the Source IP it uses its Oakestra internal IP. This packet can then be returned to the firewall.

```json
Source IP      : Port > 10.30.255.253 : 8080
Destination IP : Port > 93.6.1.78     : 51671
```

6. Passing through the firewall, the reverse translation of the Source IP to the public Gateway IP takes place, with the response going out to the client.

```json
Source IP      : Port > 24.0.5.8  : 8080
Destination IP : Port > 93.6.1.78 : 51671
```

### Service Outside our Cluster

-----

For packets with a destination outside our cluster, the general steps for forwarding are identical, with a small addition of a query by the cluster orchestrator, so outside of the scope of responsibility of the gateway itself.

What is done additionally is basically a query of the cluster orchestrator to the root orchestrator for the destination address of the node the service is running on, which was done in Step 3. in above example. This happens transparently to the Gateway component, so no additional configuration is necessary.

## Service to External Client

-----

An external client can be any network device outside the Oakestra network. In this chapter we summarize the behavior for Services generating traffic to the Internet, since their flows or network traversals inside Oakestra do not differ from one another. The only variable in this is the Worker Node's default gateway, which can be inside or outside the Worker's cluster.

Requests originating from inside Oakestra to the external Internet are sent through the Worker Node's Operating System, since the default gateway is pointing to the Gateway. Requests addressed to the gateway's internal Oakestra interface from inside the Oakestra network are bridged to the Gateway Firewall, which does simple NAT'ing of the connection to the outside. Reponses are then routed towards the Service in reverse.
