---
title: "IPv6 Address Partitioning"
date: 2023-04-21T12:56:27+02:00
draft: false
hidden: false
---

# IPv6 Address Partitioning

Let's now discuss the IPv6 address space partitioning in Oakestra.

## Network Split

Oakestra makes use of the reserved private IPv6 subnet `fc00::/7` for its service addressing.

The current implementation of Oakestra (Accordion) uses the following network split for IPv6 networking:

| Subnet                                                  | Subnet description       | Tag      |
| ------------------------------------------------------- | ------------------------ | -------- |
| `fc00::/7`                                              | full Oakestra subnetwork | all      |
| `fc00::/120 - fdfd:ffff:ffff:ffff:ffff:ffff:ffff:0/120` | Worker subnets           | `worker`   |
| `fdfe::/16`                                             | reserved for future use  | `reserved` |
| `fdff::/16`                                             | Service IP subnet        | `service`  |
| `fdff:0000::/21`                                        | Instance IP subnet 1     | `instance` |
| `fdff:1000::/21`                                        | reserved for Closest balancing policy | `balance`  |
| `fdff:2000::/21`                                        | Round Robin balancing              | `balance`  |
| ...                                                     | ...                      | `balance`  |
| `fdff:f000::/21`                                        | Balancing 15             | `balance`  |
| `fdff:0800::/21`                                        | Instance IP subnet 2     | `instance` |
| `fdff:1800::/21`                                        | Balancing 16             | `balance`  |
| `fdff:2800::/21`                                        | Balancing 17             | `balance`  |
| ...                                                     | ...                      | `balance`  |
| `fdff:f800::/21`                                        | Balancing 30             | `balance`  |

In the following we give a short meaning for each tag.

* `all` : whole Oakestra platform
* `worker` : subnet assigned to a single worker node associated with a cluster inside Oakestra
* `service` : semantic service address subnet
* `instance` : single semantic service address mapped to a service instance throughout the lifetime of the instance
* `balance` : semantic service address, addressing all multiple instance addresses of a service in order to enable semantic addressing for balance policies

## Example Application

If we deploy an example application A with Service S and two instances (S1 and S2) on the same worker node W, an example address configuration can be the following:

|App A|Addresses / Subnets assigned|
|-|-|
|Worker W|`fc00::c0:ffee:/120`|
|S| Round Robin: `fdff:2000::30`|
|S1| Instance IP: `fdff::2f`<br> Namespace IP: `fc00::c0:ffee:2`|
|S2| Instance IP: `fdff::30`<br> Namespace IP: `fc00::c0:ffee:3`|

> **Note**: Currently the Oakestra platform makes use of the whole IPv6 address space available. This may cause issues with other applications requiring an IPv6 address from the `fc00::/7` address space.

At this point we highly recommend to continue your read with the [load balancing](load-balancing.md) chapter on Oakestra networking.