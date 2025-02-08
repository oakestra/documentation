---
title: "Clustered Hierarchical FL"
summary: ""
draft: false
weight: 309060100
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

{{< callout context="caution" title="Requirements" icon="outline/alert-triangle">}}
  - You understood how FLOps performs [classic FL](/docs/concepts/flops/fl-basics/)
  - You have carefully read the [base-case FLOps project workflow](/docs/manuals/flops-addon/flops-project-workflow/flops-projects-overview/).
{{< /callout >}}

## Theory

### Clustered FL

{{< svg "clustered-fl" >}}

The figure shows the Clustered FL (CFL) architecture that groups similar learners into clusters.
CFL can form clusters based on local data distribution, training latency, available hardware, or geographical location.
The singular aggregator remains a bottleneck.
The main challenge for CFL is choosing a suitable clustering strategy and criteria for the concrete use case.
If the criteria are biased, updates from preferred clusters might be heavily favored, resulting in a biased global model with bad generalization.
Another task is to properly profile the nodes to match them to the correct cluster.
The entire cluster suffers if a slow outlier is present in a cluster.
Too intrusive profiling can lead to compromised privacy.
CFL does not really solve existing FL scalability issues on its own.
Its clustering overhead becomes critical with larger numbers of nodes.

### Hierarchical FL
