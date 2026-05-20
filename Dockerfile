FROM alpine:latest
RUN apk add --no-cache bash
CMD ["/bin/bash"]