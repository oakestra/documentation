---
title: "Network Information API"
summary: "Internal API for retrieving service networking details"
draft: false
weight: 303080000
toc: true
seo:
   title: "" # custom title (optional)
   description: "" # custom description (recommended)
   canonical: "" # custom canonical URL (optional)
   noindex: false # false (default) or true
---

The Network Information API exposes read-only HTTP endpoints to fetch the current networking configuration of an Oakestra service.
It is intended for internal use by other Oakestra components or for debugging service connectivity.

For detailed information on the available endpoints,
refer to the Swagger API documentation of a running `Root Service Manager` at `https://<root-orchestrator-ip>:10099/docs`.
All endpoints require a valid JWT in the `Authorization: Bearer <token>` header.
