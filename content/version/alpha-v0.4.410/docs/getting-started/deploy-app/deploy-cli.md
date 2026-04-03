---
title: "With the CLI"
description: "Deploy your app using the Oakestra CLI"
summary: ""
date: 2023-09-07T16:06:50+02:00
lastmod: 2023-09-07T16:06:50+02:00
draft: false
weight: 104010000
toc: true
sidebar:
  collapsed: false
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
asciinema: true
---

<span class="lead">
You can interact with you oakestra installation using any terminal on any machine you like.
</span>

{{< callout context="caution" title="Requirements" icon="outline/alert-triangle">}}
  - You have a running Oakestra setup.
{{< /callout >}}


## The `oak-cli`

{{< callout context="note" title="Benefits of `oak-cli`" icon="outline/rocket">}}

- Every machine where you installed at least one Oakestra component, already has the CLI installed.
- Native interface for the Oakestra APIs
  - Eliminates the need to use external third-party tools
- Accelerated & simpler workflows
  - Removes the need to memorize necessary API endpoints
  - The CLI commands can be chained together and used in custom scripts
{{< /callout >}}


## CLI Setup
**Any machine where you installed at least 1 Okaestra component already has the CLI installed.**
If you want to install the CLI on an external machine and manage your Oakestra deployment from there, follow these commands:

{{< tabs "Install" >}}
{{< tab "🐧 Linux/ 🍎 MacOS" >}}
From your terminal, run:
```bash
curl -sfL oakestra.io/oak.sh | bash
```
{{< /tab >}}
{{< tab " 🚮 Windows" >}}
From your terminal, run:
```bash
irm oakestra.io/oak.ps1 | iex
```
{{< /tab >}}
{{< /tabs >}}

Execute `oak -h` and you will be welcomed into the Oakestra CLI world 🌎

![`oak-cli` Initial Welcome ASCII Art](cli-images/welcome-message.png)

Finally, you can configure the IP of your Oakestra Root Orhcestrator

```bash
oak config set root_orchestrator_address <IP OF YOUR ROOT ORCHESTRATOR>
```

For further information about the CLI configuration see the [CLI Configuration Manuals](/docs/manuals/cli/features/configuration).


## Basic CLI Usage
The root command for the CLI is **oak**

{{< callout context="note" title="Need Help?" icon="outline/info-circle" >}}
  Every `oak` CLI command comes with its own help text to support your understanding.

  Simply add `--help` or `-h` to any command to find out more.
{{< /callout >}}


### Working with deployment descriptors
Oakestra apps and services are described in deployment descriptor files called `SLA`.<br>
The `oak-cli` comes with a set of pre-defined default SLAs inside the folder `~/oak_cli/SLAs`.<br>
All available SLAs can be inspected via the `oak application sla` command.

Your personal SLA files describing your applications can be stored in any folder in your machine.

{{< link-card title="Learn more about the SLA specifications" href="/docs/reference/application-sla-description">}}

### Managing Applications
Now that you are familiar with the SLAs we can start creating applications based on them.<br>

- Run `oak application show` (`oak a s`) to see the currently registered applications.<br>
- The `oak application create` (`oak a c`) command asks you what SLA from the **predefined** ones should be used as the blueprint for the new application and creates that app for you.<br>
- The `oak application create [file]` (`oak a c [file]`) allows you to specify a custom SLA file to be used for the creation of an application and its services. E.g. `oak a c mysla.json`, assuming we have a local SLA called `mysla.json`
- Delete one or all currently running apps via `oak application delete` (`oak a d`).
{{< asciinema key="create_app" poster="0:32" idleTimeLimit="1" >}}


### Deploying Services
The services of our applications are not yet deployed.<br>
To deploy instances of these services we need to know the service IDs.<br>
The IDs are visible when running `oak service show` (`oak s s`).<br>
Click on your desired Service ID value in the Service ID column and copy it via `Ctrl+C`.<br>
To deploy a new instance run `oak service deploy <SERVICE_ID|SERVICE_NAME>`.
{{< asciinema key="oakdeploy" poster="0:15" idleTimeLimit="1">}}

You can undeploy all instances of a service or only specific ones by providing the appropriate command option: <br>
`oak service undeploy <service-id|name> [instance-number]`.

{{< callout context="note" title="Combine Create & Deploy" icon="outline/bolt" >}}
  You can create an application and automatically deploy its services by providing the `-d` *(for deploy)* flag to the `oak app create (-d)` command.
{{< /callout >}}

### Inspecting Services

Using `oak service inspect <SERVICE_ID|SERVICE_NAME> [instance number]` you can either check the status of all the instances of a service or a specific instance if you provide the instance number. From here you can inspect the details of an instance, such as the worker where it is deployed, the detailed status explanation or failures reasons.

Using `oak service logs <SERVICE_ID|SERVICE_NAME> <instance number>` you can check the logs of a running instance.

{{< asciinema key="oakinspect" poster="0:13" idleTimeLimit="1">}}

### Scaling up and down multiple instances

The `oak service scale up <SERVICE_ID|SERVICE_NAME> <number>` allows you to scale up or down a certain `<number>` of isntances of a service give its ID or Name.

{{< asciinema key="oakscale" poster="0:13" idleTimeLimit="1">}}

## Further Details
This page only highlights a small subset of available `oak-cli` capabilities.

{{< link-card
  title="CLI Manuals"
  description="Explore every available CLI command in detail and more"
  href="../../../reference/cli/oak"
  target="_blank"
>}}

{{< callout context="note" title="Maximize Speed & Convenience" icon="outline/bolt" >}}
  The `oak-cli` supports tab autocompletion natively.

  This means that you can press your **tab** key to either automatically complete the command you are currently typing or get a list of matching available commands.
  There is no need to memorize or fully type out the commands.

  ![Command Recommendation via Tab Auto-Completion](./cli-images/autocomplete.png)

  Simply after installation, make sure you open up a new terminal to get the up to date autocompletion setup.
{{< /callout >}}
