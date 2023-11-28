ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apk add --no-cache \
    nodejs \
    npm \
    git

COPY package.json /
COPY index.js /
ADD dist /dist
RUN cd / && npm install --unsafe-perm

COPY run.sh /
RUN chmod a+x /run.sh
RUN chmod a+x dist/index.html

CMD [ "/run.sh" ]