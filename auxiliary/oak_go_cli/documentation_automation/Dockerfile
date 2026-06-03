# Use the official Golang image as a base image
FROM golang:1.25.0


# Install git
RUN apt-get update && apt-get install -y git

# Set the working directory
WORKDIR /app

# Clone the repository
RUN git clone https://github.com/oakestra/oakestra-cli.git .

# Change directory to oak_go_cli
WORKDIR /app/oak_go_cli

# copy _index.md file
COPY _index.md .

# Generate the documentation
RUN go run -tags docs . ./docs
RUN cp _index.md ./docs/_index.md
