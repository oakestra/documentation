---
title: "Worker Configuration"
summary: ""
draft: false
weight: 302000000
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

The Oakestra worker is managed by two components:

* The **NodeEngine** is responsible for worker ↔ cluster communication
* The **NetManager** is responsible for worker ↔ worker communication

The NodeEngine regularly collects system information and sends it to the cluster manager. It is also responsible for handling deployment commands.
Only the NodeEngine is required to register a worker with a cluster, however the NetManager is required for service-to-service communication through the overlay network.

### Useful References

{{< card-grid >}}
{{< link-card
  title="Set up a Worker"
  description="Connect your first worker to an Oakestra cluster"
  href="../../getting-started/oak-environment/add-edge-devices-workers-to-your-setup/"
  target="_blank"
>}}
{{< link-card
  title="Worker Architecture"
  description="Explore the components of an Oakestra worker"
  href="../../concepts/high-level-architecture/#worker-node"
  target="_blank"
>}}
{{< link-card
  title="Overlay Network"
  description="Learn more on the overlay network"
  href="../networking-internals/overlay-network"
  target="_blank"
>}}
{{< /card-grid >}}

## Installation

You can install the latest bundled NodeEngine and NetManager with

```bash
curl -sfL oakestra.io/install-worker.sh | sh - 
```

{{< callout context="note" title="Specify the Version" icon="outline/info-circle" >}}
You can specify which version should be installed from the [list](https://github.com/oakestra/oakestra-net/releases) by first setting

```bash
export OAKESTRA_VERSION=<release version>
```

and then re-running the above install command.
{{< /callout >}}

## Configuration

The NodeEngine and NetManager are implemented as systemd services. While it is possible to run the former without the latter, this configuration is impractical for most applications, therefore the NodeEngine service internally calls on the NetManager service. The NetManager cannot be run without the NodeEngine.

### Commands supported by both components

| Command    | Description                                                    |
|------------|----------------------------------------------------------------|
| `help`     | Displays an overview of the service and the available commands |
| `version`  | Prints the current version                                     |
| `status`   | Shows the systemd service status                               |
| `logs`     | Tails the service logs                                         |

{{< callout context="note" title="Elevated Privileges" icon="outline/info-circle" >}}
The NodeEngine and NetManager require elevated privileges for many operations. Therefore it is often necessary to execute commands as the root user with `sudo`.
{{< /callout >}}

### Configuring the NetManager

You can configure the NetManager by editing the file at `/etc/netmanager/netcfg.json`. Here you can configure the following properties:

| Property          | Description                                                                                                        |
|-------------------|--------------------------------------------------------------------------------------------------------------------|
| NodePublicAddress | The address by which the worker node can be reached                                                                |
| NodePublicPort    | The port by which the worker node can be reached (default 50103)                                                   |
| ClusterUrl        | The URL/address by which the cluster can be reached                                                                |
| ClusterMqttPort   | The port by which the cluster MQTT broker can be reached (default 10000)                                           |
| DefaultInterface  | Should the system have multiple default interfaces (e.g. `eth0` and `wlan0`) the appropriate one must be specified |
| Debug             | Toggles more verbose logging                                                                                       |
| MqttCert          | The path to the certificate file to facilitate [MQTTS](../networking-internals/mqtt-authentication)                |
| MqttKey           | The path to the key file to facilitate [MQTTS](../networking-internals/mqtt-authentication)                        |

### Running the NodeEngine

Once the worker components have been installed the NodeEngine can be run with `sudo NodeEngine`. This will start the NodeEngine service per the default configuration.
When running it for the first time, or changing the cluster the worker is being connected to, use:

```bash
sudo NodeEngine -a <Address of Cluster>
```

{{< callout context="note" title="Detach the NodeEngine" icon="outline/info-circle" >}}
To run the NodeEngine in the background use the `-d` flag.
{{< /callout >}}

### Configuring the NodeEngine

The NodeEngine is configured interactively with `NodeEngine config [command]`, the following config commands are available:

#### addon

Enables or disables [addons](../../concepts/oakestra-extensions/addons/).

| Command       | Options    | Description                                                                                                        |
|---------------|------------|--------------------------------------------------------------------------------------------------------------------|
| `FLOps`       |`[on/off]`  | Enables the [FLOps](../../concepts/flops/overview) addon                                                           |
| `imageBuilder`|`[on/off]`  | Enables the imageBuilder addon                                                                                     |

#### applogs

Change where the application logs are written to.

| Argument      | Description                                                                                                        |
|---------------|--------------------------------------------------------------------------------------------------------------------|
| `[path]`      | Specify the directory to which the applications should write their logs                                            |

#### auth

Enables [MQTT Authentication](../networking-internals/mqtt-authentication) if the following flags are set.

| Flag               | Description                                                                                                        |
|--------------------|--------------------------------------------------------------------------------------------------------------------|
| `-c`, `--certfile` | Path to the TLS certificate file                                                                                   |
| `-k`, `--keyfile`  | Path to the TLS key file                                                                                           |

#### cluster

`NodeEngine config cluster <url>` sets a new cluster connection. Similar to `NodeEngine -a <url>` except it does not start the NodeEngine.

| Flag                  | Description                                                                                                        |
|-----------------------|--------------------------------------------------------------------------------------------------------------------|
| `-p`, `--clusterPort` | Specify the port on which the cluster is reachable                                                                 |

#### default

Resets the NodeEngine configuration to the default settings.

#### network

Configures networking support and how the NetManager is integrated.

| Command            | Description                                                                                                        |
|--------------------|--------------------------------------------------------------------------------------------------------------------|
| `auto`             | Automatically manage the overlay network                                                                           |
| `manual`           | The NetManager is no longer automatically started and  must be managed manually. The NodeEngine will try to connect on the socket `/etc/netmanager/netmanager.sock`|
| `off`              | Disable the overlay network                                                                                         |

#### virtualization

Enables or disables a virtualization runtime support

| Command       | Options    | Description                                                                                                        |
|---------------|------------|--------------------------------------------------------------------------------------------------------------------|
| `unikernel`   |`[on/off]`  | Enables [Unikernel](../execution-runtimes/unikernel-deployment/) virtualization                                    |

### Manually connect to the NetManager

If you wish to manually start and connect to a custom NetManager build (e.g. for debugging) follow these steps:

1. Build the NetManager by navigating to `.../oakestra-net/node-net-manager` and executing

    ```bash
    go build .
    ```

2. Run the NetManager with

    ```bash
    sudo ./NetManager
    ```

3. Enable manual network management

    ```bash
    sudo NodeEngine config network manual
    ```

4. Start the NodeEngine

    ```bash
    sudo NodeEngine
    ```

{{< callout context="note" title="Build the NetManager" icon="outline/info-circle" >}}
The NetManager can be built and run manually from it's [source code](https://github.com/oakestra/oakestra-net)
{{< /callout >}}
