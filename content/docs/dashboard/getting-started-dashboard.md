---
title: "Start your Dashboard"
date: 2022-10-05T09:56:27+02:00
draft: false
categories:
    - Docs
tags:
    - GetStarted
weight: -99
---

![](/wiki-banner-help.png)


The Dashboard is a sophisticated web-based user interface for the Oakestra system. 
It is designed to provide users with a comprehensive set of tools to deploy applications to a 
Oakestra cluster, effectively manage cluster resources, and troubleshoot any issues that may arise.

With the Dashboard, users can gain an insightful overview of the applications currently running on 
their cluster. It allows them to create and modify individual services, 
view the status of running services, and configure service-level agreements (SLAs) with an intuitive form. 
This feature-rich interface also enables users to monitor the state of Oakestra resources within 
their cluster and track any errors that may have occurred.

In essence, the Dashboard empowers users to harness the full potential of the Oakestra system with 
ease and efficiency, enabling them to achieve their goals and objectives in a 
seamless and hassle-free manner.

## Requirements

- You have a running Root Orchestrator.
- You can access the APIs at `<root-orch-ip>:10000`


## Preparation

Make sure the following software is installed:

* Git 2.13.2+ ([installation manual](https://git-scm.com/downloads))
* Docker 1.13.1+ ([installation manual](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/))


## Deployment

**0)** First, let's export the required environment variables

```Shell
export API_ADDRESS=IP_of_the_system_manager_api
```


**1)** Clone the repository

```shell
git clone https://github.com/oakestra/dashboard.git && cd dashboard
```

**2)** Run the dashboard

```Shell
sudo docker-compose up
```

### Running the Okakestra Framework

To be able to log into the dashboard and test all functions, at least the System Manager and 
MongoDB must be started. 
How to start them is described in this WIKI [here](../../getstarted/get-started-cluster).

