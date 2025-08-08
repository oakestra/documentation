---
title: "Scheduling"
summary: ""
draft: false
weight: 202000000
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

## How does the scheduling work in Oakestra?

Oakestra's architecture consists of a two-tier design where resources are organized into clusters. Each cluster represents an aggregation of all its resources. When a job is submitted, it is first scheduled to a cluster. The cluster's scheduler then determines the target worker node to execute the job.  

{{< svg "scheduling/cluster-worker-selection" >}}

The **scheduler component** is implemented as a lightweight Asynq worker. It receives a job description and returns an allocation target. Scheduling in Oakestra operates at two levels:

1. **Root Scheduler:** Determines a suitable cluster for the job.
2. **Cluster Scheduler:** Selects the appropriate worker node within the chosen cluster.

To abstract the target resource, Oakestra employs a **Resource Abstractor**. This service transforms clusters and worker nodes into generic resources with defined capabilities. This abstraction ensures compatibility between cluster and worker selection algorithms.

{{< callout context="caution" icon="outline/alert-triangle">}}
The Resource Abstractor component is currently experimental and deployed exclusively at the root level. As of the current version, the Cluster Scheduler still interacts directly with cluster resources. Future releases will integrate the Resource Abstractor into the Cluster Scheduler to enhance interoperability and ensure consistent functionality across scheduling algorithms.  
{{< /callout >}}

## Scheduler Architecture

{{< svg "scheduling/scheduler-arch" >}}

The scheduler receives a scheduling request, containing a job descriptor, via an exposed API. The scheduling task is then enqueued using Asynq.
The scheduler calls the resource abstractor to ascertain the placement candidates (clusters or workers) and their available resources.
The job descriptor and placement candidates are forwarded to a specific scheduling algorithm, which selects a placement candidate for the job.

Scheduling algorithms can be implemented to change the scheduling decision (e.g. first-fit instead of best-fit), or to change which resources are considered (e.g. latency, proximity or price).

At each layer, the scheduling decision involves three key steps:

1. **Constraint Evaluation:** Only consider the candidates that meet the constraints (e.g. direct mapping to specific cluster/node)
2. **Filtering:** Further narrow the search space by discarding candidates that do not meet the minimum job requirements
3. **Selection:** Rank the remaining candidates according to a scoring function and choose the most appropriate candidate

This three-step approach optimizes the scheduling process by focusing the algorithm on the most suitable candidates, improving efficiency and decision quality.  

## Default Scheduling Algorithm: BestCpuMemFit

The default scheduler in Oakestra operates according to the best-fit principle with respect to the available cpu and memory.
The scheduler performs the following steps:

1. **Constraint Evaluation:** The Scheduler queries the resource abstractor to only consider candidates according to the constraints
2. **Filtering:** The scheduler discards all placement candidates that do not meet the `vcpu` and `memory` requirements outlined in the deployment descriptor
3. **Selection:** The scheduler scores the the placement candidates according to the cpu and memory usage statistics

## Generic Constraints

The **Job Deployment Descriptor** enables developers to define constraints. Every Algorithm will consider the Generic constraints, which allows a direct mapping to a cluster/worker.

The **direct** mapping constraint allows developers to explicitly define a list of target clusters and nodes in the deployment description. The scheduling algorithm will then operate only on the active clusters or nodes specified in the list.

For example, the following constraint:

```json
"constraints":[
            {
              "type":"direct",
              "node":"xavier1",
              "cluster":"cluster1"
            }
          ]
```

limits the deployment to the node `xavier1` of the cluster `cluster1`

A scheduling algorithm will consider these constraints, but can also consider more.

{{< callout context="note" icon="outline/info-circle" >}}
For more details on deployment descriptor keywords and enforcing these constraints, refer to the [SLA Description](../../reference/application-sla-description).
{{< /callout >}}

### Resources

The **Job Resource Requirements** are used to immediately exclude unsuitable candidates from the candidate list. These requirements define the bare minimum resources necessary for the job to function correctly. Below is a table of the supported resources and which scheduling algorithms consider them.

|Resource Name|Status|Algorithm|Comments
|---|---|---|---|
|`virtualization`|🟢|All|Fully functional containers and unikernel support.
|`vcpus`|🟢|BestCpuMemFit|Number of CPU cores
|`memory`|🟢|BestCpuMemFit|Memory requirements in MB
|`architecture`|🟠|None| It's possible to use the Architecture selector to specify a target hardware. 
|`vgpus`|🟠|None|Possibility of specifying the GPU cores. But not yet the available GPU drivers. Right now, the support is only for CUDA.
|`supported_addons`|🟠|None|Possibility of specifying which [addons](oakestra-extensions/addons) the candidate should support
|`vtpus`|🔴|None|Not yet under development
|`geo`|🔴|None| Under development, the possibility to filter resources based on geographical coordinates.
|`bandwidth`|🔴|None| Under development, the possibility to filter resources based on data rate limitations.
|`storage`|🔴|None| Under development, the possibility to filter resources based on available storage.

**Legend:**\
🟢 Considered by at least one scheduling algorithm\
🟠 Not considered by a scheduling algorithm, but supported by the resource abstractor\
🔴 Not supported, would require using a [custom resource](oakestra-extensions/custom-resources/)
