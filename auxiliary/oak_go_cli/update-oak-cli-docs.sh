#!/bin/bash

# NOTE: This is a shortcut cmd that is defined in package.json
# It can be run like this: 'npm run update-oak-cli-docs'

# Ask for the version
read -p "Enter version (default: main): " GIVEN_VERSION

# Set VERSION variable
if [ -z "$GIVEN_VERSION" ] || [ "$GIVEN_VERSION" == "main" ]; then
    unset VERSION
else
    VERSION=$GIVEN_VERSION
fi

SCRIPT_PATH="${BASH_SOURCE[0]}"
AUTO_DOC_PATH="$(dirname "${SCRIPT_PATH}")/documentation_automation"
AUTO_DOCS_DIR_NAME="cli_docs"
ARCHIVE_NAME="oak_docs_html_files.tar.gz"

MAIN_VERSION_DIR="../../../content/docs/reference/cli"
OTHER_VERSION_DIR="../../../content/version/$VERSION/docs/reference/cli"

DEPLOY_DIR="../../../static/${AUTO_DOCS_DIR_NAME}"

cd "${AUTO_DOC_PATH}"
docker build -t oak-cli-documentation-automator .
docker run -d --name oak-cli-docs-automator oak-cli-documentation-automator sleep infinity

if [ -z "$VERSION" ]; then
    cd "${MAIN_VERSION_DIR}"
else
    cd "${OTHER_VERSION_DIR}"
fi

current_dir_name=$(basename "$PWD")

# delete all files in current dir
rm -rf ./*
# copy _index.md
cp $SCRIPT_PATH/_index.md .
docker cp "oak-cli-docs-automator:/app/oak_go_cli/docs/." .
docker rm -f oak-cli-docs-automator
