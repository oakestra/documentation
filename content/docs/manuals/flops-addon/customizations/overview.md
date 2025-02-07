---
title: "FLOps Customizations Overview"
summary: ""
draft: false
weight: 380
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

{{< callout context="caution" title="Requirements" icon="outline/alert-triangle">}}
  - You have carefully read the [base-case FLOps project workflow](/docs/manuals/flops-addon/flops-project-workflow/flops-projects-overview/).
{{< /callout >}}

## Customizing your FLOps Project (SLA)

The FLOps manager can only instantiate a new project via an SLA. This service layer
agreement currently has the following structure:

```json
{
  % This key enables more verbose logging in the manager and project observer.
  "verbose": true, % default=false, optional
  % This ID should be the same as for the orchestrator.
  "customerID": "Admin", 
  % FLOps has only been tested for GitHub so far.
  "ml_repo_url": "https://github.com/Malyuk-A/flops_ml_repo_mnist_sklearn",
  % Supported flavors include: sklearn, pytorch, tensorflow, keras.
  "ml_model_flavor": "sklearn",
  % This key only works for special repositories intended for development.
  % It tells the builder to use prebuilt base images to significantly speed up image builds and development.
  "use_devel_base_images": false, % default=false, optional
  % This key expects a list of target platforms on which the built images should run.
  % It supports linux/amd64 and linux/arm64.
  "supported_platforms": ["linux/amd64"], % default=["linux/amd64"], optional
  "training_configuration": {
      % This key specifies the FL type.
      % FLOps supports classic and hierarchical modes.
      "mode": "classic", % default="classic", optional
      % Requested data tags should match available data on learner nodes.
      % Multiple different tags can be requested.
      % The ML data server will use local data fragments that match any of the provided tags.
      % If no data tags are provided the learner will notify watchers that it cannot find any data.
      "data_tags": ["mnist"],
      % Training cycles only apply to the hierarchical mode.
      "training_cycles: 1, % default=1, optional
      % This key tells learners the number of training and evaluation rounds to perform.
      "training_rounds": 3, % default=3, optional
      % Clients mean learners in this context.
      "min_available_clients": 2, % default=1, optional
      "min_fit_clients": 2, % default=1, optional
      "min_evaluate_clients": 2 % default=1, optional
  },
  % FLOps supports these two post-training steps.
  "post_training_steps": ["build_image_for_trained_model", "deploy_trained_model_image"], % default=[], optional
  % These are optional values that require fine-tuning.
  % Note that these values are not recommendations but placeholder values.
  "resource_constraints": {
      "memory": 250, % in MB
      "vcpus": 1,
      "storage": 25 % in MB
  }
}
```

The following SLA shows a simple classic FL project configuration with both post-training steps enabled.
It requires two learners for training.


```json
{
  "verbose": true,
  "customerID": "Admin",
  "ml_repo_url": "https://github.com/Malyuk-A/flops_ml_repo_mnist_sklearn",
  "ml_model_flavor": "sklearn",
  "training_configuration": {
      "data_tags": ["mnist"],
      "min_available_clients": 2,
      "min_fit_clients": 2,
      "min_evaluate_clients": 2
  },
  "post_training_steps": ["build_image_for_trained_model", "deploy_trained_model_image"],
}
```

The next SLA displays a more advanced configuration with HFL, multi-platform support, and more FL actors.

```json
{
  "customerID": "Admin",
  "ml_repo_url": "https://github.com/Malyuk-A/flops_ml_repo_cifar10_pytorch",
  "ml_model_flavor": "pytorch",
  "supported_platforms": ["linux/amd64", "linux/arm64"],
  "training_configuration": {
      "mode": "hierarchical",
      "data_tags": ["cifar10"],
      "training_cycles": 10,
      "training_rounds": 5,
      "min_available_clients":3,
      "min_fit_clients": 3,
      "min_evaluate_clients": 3
  },
  "post_training_steps": ["build_image_for_trained_model", "deploy_trained_model_image"],
}
```


### Using Custom ML Git Repositories

---
---

The ML model flavor indicator tells FLOps what ML framework to expect and work with. Examples include Keras, Sklearn, or
Pytorch. Each project is associated with exactly one ML code repository. This repository
can be owned by the user or be a public one. Thus, multiple users can reuse the same
repository, and each user can create multiple FLOps projects per repository. These
properties are based on the SLA from the user request.

FLOps uses the concepts of applications and services to manage dependent compo-
nents and concepts. Each app can have multiple services. Services are bound to parent
apps and cannot exist on their own. The orchestrator creates and realizes apps and
services as usable components. Applications themselves are collectors of information
and metadata. They do not run or contain any executable code, images, or similar.
Services are the computational components that can be deployed and un-deployed.
This split is based on Oakestra’s applications and services. The two main FLOps app
types are project-based apps and customer-facing ones.
The observatory app is a customer-facing app. There is exactly one observatory
app for each user, whereas users can have multiple projects. The observatory hosts
the tracking server and project observer services. The tracking server service tracks
the projects and individual FL experiments. It hosts the GUI. (It utilizes the MLFlow
tracking server mentioned in 2.2.3.) When users request/start a new project, the
observatory is created with all its components if it does not already exist. Users can
request access to the GUI/tracking server independently from a project. A project
observer service gathers and displays information or updates regarding the project
status for the user. The project observer informs the user of any issues during the
project’s live time, such as dependency issues during the containerized image builds.
There is one project observer per project to improve readability and comprehension.
Figure 3.6 shows additional details of the ML code repositories from the core model.
Users can provide a link to ML code repositories for FLOps to augment and train. The
repository must fulfill the following structural requirements for this to be possible
and straightforward. The repository needs a dedicated file that lists all necessary
dependencies to train its model. Theoretically, it should be possible to extract these
requirements dynamically by inspecting the code. However, this is a complex and
error-prone endeavor. To avoid these issues, users should provide the dependencies
they used for training

Figure 3.7 shows further details about the contents of an FLOps project. Users can
customize their projects via the SLA (4.1.2) that is part of their API requests (4.1.1). One
possible customization is to specify resource constraints such as memory or storage.
Users can customize the FL training by changing the project’s training configuration.
The same ML repository can be trained differently depending on these configurations.
This configuration includes a mode that tells FLOps to perform different types of
FL if applicable. Currently, FLOps supports classic and (clustered) HFL. The project
will only use training data that matches the provided data tags. The training rounds
configure the number of training and evaluation rounds that each learner performs.
Only HFL uses training cycles. The training rounds mean the number of training
rounds performed on each learner per cycle. A training cycle is the number of training
rounds between the root and cluster aggregators, which resemble aggregators and
learners in classic FL. For example, if the user requests three cycles and five rounds,
the learners will train five rounds per cycle for three cycles. Each learner will train for
15 rounds during the entire project runtime. The depicted attributes are only a subset
of currently available and possible configurations.
The core figure 3.5 only alluded that a project consists of several services and depicted
only the project observer. Figure 3.8 expands upon this and shows important project
services and their relationships. There are three main project services. The FL image
builder is a service that builds containerized images. It can build the FL augmented
images for the learner, aggregator, and inference server of the trained model. Different
build plans enable this distinction. The builder clones the ML repository, handles and
checks the provided dependencies, builds the images, and pushes them to an image
registry. During and after the builder operation, the service notifies other components,
including the project observer, about its progress, current state, and potential errors.
The FL aggregator manages the FL training loop and holds the global model and
strategy for training. It starts its internal FL server so learners can register for training.

The aggregator starts and terminates learning rounds and cycles. It logs results like
metrics or the final trained model via the tracking server. Similarly to the builder, it
notifies other components during runtime about its progress and errors. The aggregator
and learners utilize the code provided in the user’s ML code repositories. They have
direct access to the model and data managers. The image builder injects both of them.
The FL learners are project services that perform the FL training on local data. They
fetch locally stored data, connect to the aggregator, and perform FL activities such as
training. The learner uses the code found in the model and data managers and wraps
itself around their implemented interface methods. As a result, users do not need to
implement the FL (boilerplate) code themselves. Therefore, a learner’s getParameters
method uses the getParameters method described in the user’s ML repository with
additional logic around it. Learners also notify other components about their progress
or failures.

---

{{< link-card
  title="Need more Customization?"
  description="Explore how to modify, extend, and contribute to FLOps"
  href="/docs/contribution-guide/flops-addon/"
>}}
