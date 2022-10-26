# Oakestra documentation 
hosted at [oakestra.io](oakestra.io)

The contents from this repository are hosted on the Oakestra website. This documentation contains component descriptions and user guides.

- documentation: [oakestra.io/docs](oakestra.io/docs)

The Oakestra site is written in [Markdown](https://www.markdownguide.org/) and published via [goHugo](https://gohugo.io/) and the [Docsy theme](https://www.docsy.dev/).

# Files Strucutre 

/
├── content/    ---> This is where the website files are
│   ├── _index.html   ---> website landing page
│   ├── about/  ---> about category
│   └── docs/  ---> documentation subfolder
│   
├── static/  ---> folder where all the static files are
└── the remaining files are framework realted, avoid touching them :)

# Build

## Prerequisites

In order to visualize the documentation website you need to set up your Hug Environment. 
Check out Step 1 of [Getting started with goHugo](https://gohugo.io/getting-started/quick-start/)

## Publish the docs and update the website

1. Just push the source codes to this repo. The website will build automatically.  

## Run development server website

If you want to visualize the website locally to preview your changes, you can use the command `hugo serve`.
Once the preview website is ready you can visualize it at `localhost:1313`
