#!/bin/bash
# from https://maximorlov.com/automate-your-docker-deployments/
IMAGE_NAME="natoftheboonies/wordhalp"
IMAGE_TAG=$(git rev-parse --short HEAD) # first 7 characters of the current commit hash


echo "Building Docker image ${IMAGE_NAME}:${IMAGE_TAG}, and tagging as latest"
if [[ "$OSTYPE" == "darwin"* ]];
then
    echo "Building from Mac"
    docker buildx build --platform linux/amd64 -t "${IMAGE_NAME}:${IMAGE_TAG}" .
else
    echo "Building from Linux"
    docker build -t "${IMAGE_NAME}:${IMAGE_TAG}" .
fi

docker tag "${IMAGE_NAME}:${IMAGE_TAG}" "${IMAGE_NAME}:latest"

DEPLOY="wordhalp"
TARFILE="${DEPLOY}.tar"

docker save -o /tmp/${TARFILE} "${IMAGE_NAME}:latest"
scp /tmp/${TARFILE} seahorse:.
ssh seahorse "docker load -i ${TARFILE} && \
    cd docker/${DEPLOY} && docker compose down && docker compose up -d && \
    cd ../nginx && docker compose restart && rm ~/${TARFILE}"