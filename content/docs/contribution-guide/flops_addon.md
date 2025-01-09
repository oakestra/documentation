---
title: "FLOps Addon"
summary: ""
draft: false
weight: 406000000
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

## Report a Bug or Request a Feature
Go to the FLOps addon repository and create a new Issue.

{{< link-card
  title="FLOps Addon Repository"
  description="Explore the source code"
  href="https://github.com/oakestra/addon-FLOps"
  target="_blank"
>}}


## Linting & Formatting
The FLOps addon repository uses [ruff](https://github.com/astral-sh/ruff) for Python linting and formatting.

## Local Development
For local development clone the FLOps addon repository and ensure to have Oakestra and its CLI running on your machine.

## Development Considerations + Tips & Tricks

### FlOps' Repository Images
FLOps uses multiple different pre-build images to power its features.
These images are available in its [GitHub image/package registry](https://github.com/orgs/oakestra/packages?repo_name=addon-FLOps).
When modifying these images ensure to build and push them for `linux/amd64` and `linux/arm64`.

We recommend to use the following workflow:

```bash
docker buildx create --name flopsbuilder --use

docker buildx build --platform linux/amd64,linux/arm64 \
  --output "type=image,push=true" \
  --tag ghcr.io/oakestra/addon-flops/<image>:<tag> .
```
