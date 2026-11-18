FROM node:24-bookworm-slim AS node-runtime
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY foundations-runtime ./foundations-runtime

FROM python:3.12-slim-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends git libstdc++6 && rm -rf /var/lib/apt/lists/*
COPY --from=node-runtime /usr/local/bin/node /usr/local/bin/node
WORKDIR /app
COPY foundations-runtime/requirements-python.txt /tmp/requirements-python.txt
RUN python -m venv /opt/course-python && /opt/course-python/bin/pip install --no-cache-dir -r /tmp/requirements-python.txt
COPY --from=node-runtime /app /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3300 CLASSROOM_PYTHON=/opt/course-python/bin/python
EXPOSE 3300
HEALTHCHECK --interval=30s --timeout=3s CMD node -e "fetch('http://127.0.0.1:3300/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node","foundations-runtime/launch.mjs","200"]
