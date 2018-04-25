FROM nikolauska/phoenix:1.6

RUN apk update && apk upgrade && \
     apk --no-cache --update add git bash

RUN git clone https://github.com/CityOfZion/neo-scan.git /data
WORKDIR /data
# Last checked commit: d30cd38 
RUN git checkout master

# Here are the default environment variables you can override.
ENV POSTGRES_USERNAME='postgres'
ENV POSTGRES_PASSWORD='postgres'
ENV POSTGRES_DATABASE='neoscan_dev'
ENV POSTGRES_HOSTNAME='postgres'
ENV NEO_SEED_1="http://neo-csharp-nodes:30333"
ENV NEO_SEED_2="http://neo-csharp-nodes:30334"
ENV NEO_SEED_3="http://neo-csharp-nodes:30335"
ENV NEO_SEED_4="http://neo-csharp-nodes:30336"
ENV NEO_PYTHON_SEED_1="http://neo-csharp-nodes:38088/v1"

EXPOSE 4000

COPY neo-scan/neoscan_dev.exs /data/apps/neoscan/config/dev.exs
COPY neo-scan/neoscan_monitor_config.exs /data/apps/neoscan_monitor/config/config.exs
COPY neo-scan/neoscan_sync_config.exs /data/apps/neoscan_sync/config/config.exs

# We have to do all this in the command because otherwise the environment variables don't work.
# The sleep is here to make sure postgres is fully started first.
ADD neo-scan-docker-startup.sh /opt

CMD /opt/neo-scan-docker-startup.sh
