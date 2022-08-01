FROM node:14
WORKDIR /app
COPY . /app
RUN mkdir -p /app && \
    groupadd -r app && \
    useradd -r -s /bin/false -g app app && \
    chown -R app:app /app && \
    npm install -g @mapbox/node-pre-gyp && \
    npm install --production
USER app
CMD [ "node", "./src/index.js" ]
