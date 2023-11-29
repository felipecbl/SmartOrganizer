ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apk add --no-cache nodejs npm

WORKDIR /data

COPY package.json /
COPY index.js /
ADD client /client
ADD config /config
ADD controllers /controllers
ADD db /db
ADD middleware /middleware
ADD routes /routes
ADD utils /utils
RUN cd / && npm install --unsafe-perm

COPY run.sh /
RUN chmod a+x /run.sh
RUN chmod a+x -R /client
RUN chmod a+x -R /config
RUN chmod a+x -R /controllers
RUN chmod a+x -R /db
RUN chmod a+x -R /middleware
RUN chmod a+x -R /routes
RUN chmod a+x -R /utils

CMD [ "/run.sh" ]