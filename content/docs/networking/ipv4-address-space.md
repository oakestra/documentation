---
title: "IPv4 Address Partitioning"
date: 2023-04-21T12:56:27+02:00
draft: false
hidden: false
---

# IPv4 Address Partitioning

Let's first discuss the IPv4 address space partitioning in Oakestra.

## Network Split

Oakestra makes use of the reserved private IPv4 subnet `10.0.0.0/8` for its service addressing.

The current implementation of Oakestra uses the following network split for IPv4 networking:

| Subnet                                                  | Subnet description       | Tag      |
| ------------------------------------------------------- | ------------------------ | -------- |
| `10.18.0.0/16` | Worker subnet           | `worker`   |
| `10.30.0.0/16`                                             | Service and Instance IP subnet        | `service` `instance`|

In the following we give a short meaning for each tag.

* `worker` : subnet assigned to a single worker node associated with a cluster inside Oakestra. Worker subnet has a `/26` bitmask
* `service` : semantic service address subnet
* `instance` : single semantic service address mapped to a service instance throughout the lifetime of the instance

## Example Application

If we deploy an example application A with Service S and two instances (S1 and S2) on the worker node W, an example address configuration can be the following:

|App A|Addresses / Subnets assigned|
|-|-|
|Worker W|`10.18.30.64/26`|
|S| Round Robin: `10.30.0.1`|
|S1| Instance IP: `10.30.0.2`<br> Namespace IP: `10.18.30.65`|
|S2| Instance IP: `10.30.0.3`<br> Namespace IP: `10.18.30.66`|

Oakestra also has full IPv6 support, which you can read in the [IPv6 address partitioning](ipv6-address-space.md) chapter on Oakestra networking.