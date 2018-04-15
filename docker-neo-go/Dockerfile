FROM golang:alpine
LABEL maintainers="anthdm,stevenjack"

RUN apk update && apk add git make && rm -rf /var/cache/apk/*

RUN mkdir -p /go/src/github.com/CityOfZion
RUN mkdir -p /go/src/github.com/anthdm

RUN git clone https://github.com/CityOfZion/neo-go /go/src/github.com/CityOfZion/neo-go
RUN git clone https://github.com/anthdm/neo-go /go/src/github.com/anthdm/neo-go

WORKDIR /go/src/github.com/CityOfZion/neo-go

RUN go get -u github.com/golang/dep/cmd/dep
RUN dep ensure

ADD compile.sh /compile.sh
RUN chmod u+x /compile.sh

RUN make build

ENTRYPOINT ["/compile.sh"]
