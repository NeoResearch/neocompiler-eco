FROM nikolauska/phoenix:1.6

RUN apk update && apk upgrade && \
     apk --no-cache --update add git bash

# Here are the default environment variables you can override.
ENV POSTGRES_USERNAME='postgres'
ENV POSTGRES_PASSWORD='postgres'
ENV POSTGRES_DATABASE='neoscan_dev'
ENV POSTGRES_HOSTNAME='postgres'
ENV NEO_SEED_1="http://neo-csharp-nodes:30333"
ENV NEO_SEED_2="http://neo-csharp-nodes:30334"
ENV NEO_SEED_3="http://neo-csharp-nodes:30335"
ENV NEO_SEED_4="http://neo-csharp-nodes:30336"
ENV NEO_PYTHON_SEED_1="http://neo-python-all-in-one:38088/v1"

EXPOSE 4000

# TODO - NeoCompiler ECO - Last checked commit: e41af7a31ff47b3aa2fbfc7e30f19a79e11ae178 - newer
RUN git clone https://github.com/CityOfZion/neo-scan.git /data && cd /data && git checkout e41af7a31ff47b3aa2fbfc7e30f19a79e11ae178

WORKDIR /data

#RUN mix deps.get

COPY neo-scan/neoscan_dev.exs /data/apps/neoscan/config/dev.exs

#This both files will be removed - TODO
COPY neo-scan/neoscan_sync_config.exs /data/apps/neoscan_sync/config/config.exs
COPY neo-scan/neoscan_monitor_config.exs /data/apps/neoscan_monitor/config/config.exs

#TODO Preparing for the newest vesions
#COPY neo-scan/neoscan_node_config.exs /data/apps/neoscan_node/config/config.exs


# We have to do all this in the command because otherwise the environment variables don't work.
# The sleep is here to make sure postgres is fully started first.
ADD neo-scan/neo-scan-docker-startup.sh /opt
ADD neo-scan/init-neo-scan.sh /opt

CMD /opt/neo-scan-docker-startup.sh
