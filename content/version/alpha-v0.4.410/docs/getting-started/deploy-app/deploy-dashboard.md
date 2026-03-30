---
title: "With the Dashboard"
description: "Deploy your app using the Oakestra Dashboard"
summary: ""
date: 2023-09-07T16:06:50+02:00
lastmod: 2023-09-07T16:06:50+02:00
draft: false
weight: 103020000
toc: true
sidebar:
  collapsed: false
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

<span class="lead">
You can also manage your infrastructure and deploy/monitor applications using Oakestra frontend dashboard.
</span>

{{< callout context="tip" title="Dashboard features" icon="outline/rocket">}}
- View the applications currently running on the cluster
- Create and modify individual services
- Check the status of running services
- Configure service-level agreements (SLAs)
{{< /callout >}}


## Deployment

{{< callout context="caution" title="Requirements" icon="outline/alert-triangle">}}
- You have a running Oakestra setup (Root and Cluster Orchestrator)
- You can access the APIs at `<IP_OF_CLUSTER_ORCHESTRATOR>:10000`
{{< /callout >}}

### Automatic Deployment

When you start Oakestra using the standard installation scripts (as described in the [Create your first Oakestra Orchestrator](../../oak-environment/create-your-first-oakestra-orchestrator/) section), **the dashboard is automatically deployed along with the other Oakestra components**.

You don't need to perform any additional steps to deploy the dashboard.

### Manual Deployment

If you need to deploy the dashboard manually (e.g., for custom configurations or when using override files to exclude the dashboard), please refer to the [Dashboard Manual Deployment](../../../manuals/dashboard-features/dashboard-manual-deployment/) guide.

## Accessing the Dashboard

Once Oakestra is running, you can access the dashboard at:

```bash
http://<IP_OF_CLUSTER_ORCHESTRATOR>
```

Replace `<IP_OF_CLUSTER_ORCHESTRATOR>` with the IP address of the machine hosting your Cluster Orchestrator.

{{< callout context="danger" icon="outline/alert-octagon">}}
If the Oakestra components are not running or configured correctly, you can reach the login screen but will not be able to log in.
{{< /callout >}}

### Default Credentials

Upon launching the system for the first time, an administrative user is automatically created.
This user can create and manage other users and organizations within the system, more on [User Management](../../../manuals/dashboard-features/organizations/#user-management) later.

{{< details "**Click here to view dashboard credentials**" >}}

> Username: `Admin`\
> Password: `Admin`

**After setting up the cluster manager immediately change the password of the admin user!**

{{< /details >}}

## Organization Login

To log in to an organization check the *Organization login* box and enter the organization name. If the box is not checked or the organization
name is left empty, then you will logged in to the default root organization.

{{< link-card
  title="Organizations"
  description="More on organizations"
  href="../../../manuals/dashboard-features/organizations/"
  target="_blank"
>}}

Here you can see the login to the *sampleOrga* organization.

![](orga-login.gif)

<!-- Todo: Move somewhere else -->
## Applications, Services, Namespaces

In Oakestra there are applications, services and namespaces. One Application can encompass multiple services and one user can create
multiple applications on one system. Namespaces allow you to create applications and services by the same name in different namespaces,
e.g. `production` and `development`.

### Creating an Application

First you will have to create an application. Choose a concise name, the namespace and optionally a description.

![](add-app.gif)

### Creating a Service

In the [previous section](../with-the-api) we discussed registering
deployment descriptors via the API. This is great for automated deployments, but the SLAs were not designed with human readability in mind.
While the dashboard still allows you to upload SLAs as a JSON file, it also provides you with an interactive form.

Once you have created an application you can create services. Once again you will have to choose a concise name, a namespace and optionally a description.
However this is far from it; system requirements, environmental variables, connection details and much more can be specified here.

You will have to choose a virtualization method (Container or Unikernel) and tell Oakestra where it can find your code.
Hit save and your service is ready for deployment!

![](create-service.gif)

### Service Details

Once a service has been created and deployed, you can check on it's status and other details. Choose a service from the *Service List* and from the drop-down
menu, choose an instance and click on *View Instance Details*.


{{< callout context="note" title="Something Missing?" icon="outline/building-factory">}}
If you have any new feature ideas or if you find any bugs please open an issue in the [GitHub repository](https://github.com/oakestra/dashboard).
{{< /callout >}}
