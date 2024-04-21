ARG BUILD_FROM
FROM ${BUILD_FROM}

ENV LANG C.UTF-8
ENV CONFIG_PATH /data/options.json
ENV DATABASE_PATH /data/db

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apk add --no-cache nodejs npm

WORKDIR /app

COPY package*.json /
COPY run.sh /

RUN cd / && npm install --unsafe-perm
COPY . .

VOLUME /data
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]