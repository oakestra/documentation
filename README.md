# Oakestra Documentation

## Dependencies

In order to build the webside you need to install:
- [`npm`](https://nodejs.org/en/download/package-manager)
- [`golang`](https://go.dev/doc/install)

then you can install all the project dependencies using

```
npm install
```

## How to test?

This repo is based on the GoHugo Doks theme. Follow the instructions [here](https://getdoks.org/docs/start-here/installation/#install-dependencies) to build it.

You can just serve a development version of your website locally using:

```
npm run dev
```

## How to build and test the production website locally?

Build the website using:

```
hugo
```

then move to the `public/` directory and run a local server using:

```
python3 -m http.server
```

Reach the website at `http://localhost:8000` and test the build.
The website should look like the production one deployed at [oakestra.com](https://oakestra.com).

> **N.b.** While `npm run dev` is a good way to test your website during development, sometimes artifacts occur in the build process that are not present in the development website. For this reason, it is always a good idea to test the production build locally before deploying.

## Weights Explained

Weights are necessary for the orderning shown in the left side bar as well as for the "Prev" and "Next" pages displayed at the bottom of every page.

Every page should have a weight - e.g:
```md
---
title: "High-Level Architecture"
summary: ""
draft: false
weight: 201000000
toc: true
...
---
```
One can thing about pages and their weights as nodes on a tree structure.
The following example helps you to visualize how we use weights:

```
- 📁 Getting Started                  | 01 00 00 00 00  
    - 📄 Welcome to Oakestra ...      | 01 01 00 00 00
    - 📁 Create your first ...        | 01 02 00 00 00
        - 📄 High Level Setup ...     | 01 02 01 00 00
        - 📄 Create your first ...    | 01 02 02 00 00
- 📁 Concepts                         | 02 00 00 00 00 
- 📁 Manuals                          | 03 00 00 00 00
    - ... 
    - 📁 Federated Learning (FLOps)   | 03 07 00 00 00
        - 📄 FLOps Overview           | 03 07 01 00 00
        - 📄 FLOps API Endpoints      | 03 07 02 00 00
        - 📁 System Preparations      | 03 07 03 00 00
            - 📄 ... Overview         | 03 07 03 01 00
            - 📄 Prepare Image ...    | 03 07 03 02 00
        - 📁 FLOps Project Workflow   | 03 07 04 00 00
            - 📄 ... Overview         | 03 07 04 01 00
            - 📁 Project Stages       | 03 07 04 02 00
                - 📄 Stage 0 ...      | 03 07 04 02 01 
                - 📄 ...
    - ...
- 📁 Contributng Guide                | 04 00 00 00 00
- 📁 Reference                        | 05 00 00 00 00
```
We are working with a maximum document/tree depth of 5.
We are using 10 digits for the weight - 2 digits per depth level.
Thus every level can fit 99 documents.
(Why so many? -> Because 10 in one level is easily breached.)
Each digit pair from left to right represents how deep the respective page/folder is located in.
Each folder requires an _index.md file that contains its weight. 
