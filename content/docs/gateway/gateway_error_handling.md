---
title: "Gateway Error Handling"
date: 2023-28-01T12:56:27+02:00
draft: true
hidden: false
---

Here we summarize different scenarios which can occur during the operation of a Oakestra deployment that directly affect the operation of a Oakestra Gateway, which would need handling.

### Cluster Orchestrator stops working

-----

In case the cluster orchestrator of the deployed gateway stops working, crashes or ceases to exist, a fallback cluster orchestrator is chosen. This is usually done by providing the gateway with a list of cluster orchestrator, which are direct replicas of the currently used one and can take over in case of an error.

On a sidenote, the selection of the currently active or responsible cluster orchestrator for the gateway is determined in a selection process.

### Gateway stops working

-----

Error handling for a gateway crash itself is a multi-step process until success. The following describe the different steps.

#### Cluster orchestrator checks for alternative gateway inside cluster

-----

The initial reaction on a gateway stopping to work is the lookup for an alternative active gateway inside the cluster. If there is one, the cluster orchestrator signals the new gateway address to the Worker Nodes affected by the crashed gateway. If not, the cluster orchestrator goes to the next step.

#### Cluster scheduler tries (re-)deployment

-----

In case no alternative gateway is set up, the cluster orchestrator goes ahead and tries to redeploy the gateway either on the same Worker or on another available (and suitable) one inside the cluster. After successfull deployment the cluster orchestrator propagates the new (or old) gateway address to the Worker Nodes. If no Worker Node is available to be deployed to, the cluster orchestrator tries the following.

#### Cluster orchestrator queries for gateways in other clusters

-----

In case a redeployment is not possible, the cluster orchestrator queries other clusters for active gateways, that could take over.
