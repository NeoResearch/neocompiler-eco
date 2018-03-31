FROM nikolauska/phoenix:1.6

#RUN apk update && apk upgrade && \
#    apk add --no-cache git

RUN apk update && apk upgrade && \
     apk --no-cache --update add git bash
#    apk --no-cache --update add git bash nodejs nodejs-npm #This was an workaround on previous version of phoenix

# Replace with regular neo-scan after this is merged:
# https://github.com/CityOfZion/neo-scan/pull/118
RUN git clone https://github.com/slipo/neo-scan.git /data
#RUN git clone https://github.com/CityOfZion/neo-scan.git /data
WORKDIR /data
# Fix some checkout hash to ensuring stability
# Last working version was e41af7a31ff47b3aa2fbfc7e30f19a79e11ae178
RUN git checkout seed-config
#RUN git checkout master

# Here are the default environment variables you can override.
ENV POSTGRES_USERNAME='postgres'
ENV POSTGRES_PASSWORD='postgres'
ENV POSTGRES_DATABASE='neoscan_dev'
ENV POSTGRES_HOSTNAME='postgres'
ENV NEO_SEED_1="http://neo-privnet:30333"
ENV NEO_SEED_2="http://neo-privnet:30334"
ENV NEO_SEED_3="http://neo-privnet:30335"
ENV NEO_SEED_4="http://neo-privnet:30336"

RUN mix deps.get
RUN cd apps/neoscan_web/assets && npm install

EXPOSE 4000

COPY neo-scan/neoscan_dev.exs /data/apps/neoscan/config/dev.exs
COPY neo-scan/neoscan_monitor_config.exs /data/apps/neoscan_monitor/config/config.exs

#NeoCompiler personal configuration
COPY neo-scan/neoscan_web_prod.exs /data/apps/neoscan_web/config/prod.exs

# We have to do all this in the command because otherwise the environment variables don't work.
# The sleep is here to make sure postgres is fully started first.
# It should eventually be replaced with a connection check on a loop.
CMD sleep 3 && \
  #mix deps.get && \
  mix ecto.create && mix ecto.migrate && \
  #cd apps/neoscan_web/assets && npm install && \
  mix phx.server

# We have to do all this in the command because otherwise the environment variables don't work.
# The sleep is here to make sure postgres is fully started first.
#ADD neo-scan-docker-startup.sh /opt

#CMD /opt/neo-scan-docker-startup.sh
