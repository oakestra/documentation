# Oakestra Site 

This is the main repository which will also build the landing page. The website is hosted at [oakestra.io](oakestra.io).

- documentation: [oakestra.io/docs](oakestra.io/docs)

The Oakestra site is written in [Markdown](https://www.markdownguide.org/) and published via [goHugo](https://gohugo.io/) and the [Docsy theme](https://www.docsy.dev/).

# Files Structure 

```
/
├── content/    ---> This is where the website files are
│   ├── _index.html   ---> website landing page
│   ├── about/  ---> about category
│   └── docs/  ---> documentation subfolder
│   
├── static/  ---> folder where all the static files are
└── the remaining files are framework realted, avoid touching them :)
```

# Build

## Prerequisites

In order to visualize the documentation website you need to set up your local Hugo environment. 
Check out `Step 1` of [Getting started with goHugo](https://gohugo.io/getting-started/quick-start/)

## Publish the docs and update the website

Push the source code to this repo. The website will build automatically.  

## Run development server website

If you want to visualize the website locally to preview your changes, you can use the command `hugo serve`.

After building and deploying the site, `hugo` provides instructions on accessing and using it:

```text
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
```

Access the `http://localhost:1313/` URL in the browser to view the site.
