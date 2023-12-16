# Build the files

1. install npm
2. install node > 16
3. (optional) install nvm
4. (optional) `nvm install-latest-npm`. This will automatically run the latest version, necessary for the challenge.
5. `npm i`
6. `npm run build`

# Or just run the Docker container

1. install docker on your machine
2. run `docker build -t hackme . &> /dev/null`
3. run `docker run -it hackme &> /dev/null`
    1. You can remove `&> /dev/null`. They are added to not spoil yourself the answers.
