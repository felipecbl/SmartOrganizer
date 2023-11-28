ARG BUILD_FROM
FROM $BUILD_FROM

RUN apk add --no-cache nodejs npm

COPY package.json /
COPY index.js /
COPY index.html /
ADD client /
RUN cd / && npm install --unsafe-perm

COPY run.sh /
RUN chmod a+x /run.sh
RUN chmod a+x /index.html
RUN chmod a+x /client/index.html

CMD [ "/run.sh" ]