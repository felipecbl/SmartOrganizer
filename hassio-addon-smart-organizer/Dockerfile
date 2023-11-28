ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apk add --no-cache nodejs npm

COPY package.json /
COPY index.js /
COPY index.html /
ADD client /client
RUN cd / && npm install --unsafe-perm

COPY run.sh /
RUN chmod a+x /run.sh
RUN chmod a+x /index.html
RUN chmod a+x -R /client

CMD [ "/run.sh" ]