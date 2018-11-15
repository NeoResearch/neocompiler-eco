FROM golang:alpine
LABEL maintainers="anthdm,stevenjack"
ENV APP_DIRECTORY /go/src/github.com/CityOfZion/neo-go

RUN apk update && apk add git make && rm -rf /var/cache/apk/*

RUN mkdir -p $APP_DIRECTORY

RUN git clone https://github.com/CityOfZion/neo-go $APP_DIRECTORY # 0.44.10 <- just change number and docker image will be rebuilt

WORKDIR $APP_DIRECTORY

RUN go get -u github.com/golang/dep/cmd/dep
RUN dep ensure

ADD compile.sh /compile.sh
RUN chmod u+x /compile.sh

RUN make build

ENTRYPOINT ["/compile.sh"]
