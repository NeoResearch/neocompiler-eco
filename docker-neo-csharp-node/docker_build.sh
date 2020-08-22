#!/bin/bash
set -e

# To use a newer neo-cli version, just update this variable:
NEO_CLI_VERSION="3-preview-4-ongoing-neoresearch"

function usage {
    echo "Usage: $0 [--no-cache] [--neo-cli <zip-fn>]"
}

while [[ "$#" > 0 ]]; do case $1 in
    -h)
        usage
        exit 0
        ;;
    --no-cache)
        DISABLE_CACHE=1
        shift
        ;;
    --neo-cli)
        # Custom neo-cli zip filename
        NEO_CLI_CUSTOM_ZIPFN=$2
        NEO_CLI_VERSION="custom"
        if [[ -z $NEO_CLI_CUSTOM_ZIPFN ]]; then
            echo "Error: Please specify a neo-cli zip file"
            usage
            exit 1
        fi
        echo "Custom neo-cli zip: $NEO_CLI_CUSTOM_ZIPFN"
        shift; shift
        ;;
    *)
        usage
        exit 1
        ;;
  esac;
done

BASE_NAME="eco-neo-csharp-node"
IMAGE_NAME="$BASE_NAME:$NEO_CLI_VERSION"

# Definition of standard neo-cli filenames and URL based on the version
NEO_CLI_ZIPFN="neo-release-${NEO_CLI_VERSION}.zip"
#NEO_CLI_URL="https://github.com/neo-project/neo-cli/releases/download/v${NEO_CLI_VERSION}/neo-cli-linux-x64.zip"
NEO_CLI_URL="https://github.com/NeoResearch/neo-tests/raw/master/releases/neo-release-${NEO_CLI_VERSION}.zip"

if [ -z "$NEO_CLI_CUSTOM_ZIPFN" ]; then
    echo "Using downloaded neo-cli v${NEO_CLI_VERSION}"

    if [ -e "${NEO_CLI_ZIPFN}" ] && [ -z "$DISABLE_CACHE" ]
    then
        echo "- release already downloaded: ${NEO_CLI_ZIPFN}"
    else
        echo "- downloading ${NEO_CLI_URL}..."
        wget --no-check-certificate -O $NEO_CLI_ZIPFN $NEO_CLI_URL || (rm -f $NEO_CLI_ZIPFN && exit 1)
    fi
    cp $NEO_CLI_ZIPFN ./neo-cli.zip
else
    echo "Using custom neo-cli.zip: $NEO_CLI_CUSTOM_ZIPFN"
    cp $NEO_CLI_CUSTOM_ZIPFN ./neo-cli.zip
fi

if [ -z "$DISABLE_CACHE" ]; then
  docker build -t $IMAGE_NAME .
else
  echo "docker build no cache"
  docker build --no-cache -t $IMAGE_NAME .
fi

echo "docker tag $IMAGE_NAME $BASE_NAME:latest"

docker tag $IMAGE_NAME "$BASE_NAME:latest"
