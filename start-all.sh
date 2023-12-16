#!/bin/bash

pushd pwn/tintagel
docker-compose up -d
popd

pushd automotive/hohoho_uds
docker-compose up -d
popd

pushd web/wouldntdownload
docker-compose up -d
popd

pushd web/openid-portal
docker-compose up -d
popd

pushd misc/factory
docker-compose up -d
popd

