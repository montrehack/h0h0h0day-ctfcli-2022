FROM node:16

COPY . /src/
COPY startup.sh /src/startup.sh

WORKDIR /src

RUN npm ci

RUN npm run build

EXPOSE 80 

RUN chmod +x /src/startup.sh

ENV FLAG FLAG{Y0u_W0uldnt_Mem0ize_A_Car}

ENV TESTING_OPTIONS -b user=admin

ENTRYPOINT ["/src/startup.sh"]
