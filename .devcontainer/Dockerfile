FROM golang:1.22-bookworm

RUN apt-get update && \
    apt-get install -y \
    ca-certificates \
    nodejs \
    npm \
    wget && \
    update-ca-certificates

ARG HUGO_VERSION="0.152.2"

RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then \
        HUGO_BINARY="hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"; \
    elif [ "$ARCH" = "aarch64" ]; then \
        HUGO_BINARY="hugo_extended_${HUGO_VERSION}_linux-arm64.tar.gz"; \
    fi && \
    wget https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/${HUGO_BINARY} && \
    tar xzf ${HUGO_BINARY} && \
    rm -r ${HUGO_BINARY} && \
    mv hugo /usr/bin && \
    chmod 755 /usr/bin/hugo

WORKDIR /src
COPY ./ /src
