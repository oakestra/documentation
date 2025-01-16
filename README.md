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