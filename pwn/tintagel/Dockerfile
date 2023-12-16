FROM ubuntu:22.04
RUN apt-get update -y && apt-get install -y build-essential gcc
ADD tintagel.c .
ADD Makefile .
RUN make

FROM ubuntu:22.04
RUN apt-get update -y && apt-get install -y strace moreutils xinetd faketime
RUN useradd -m arthur && chmod 700 -R /home/arthur
COPY flag.txt /home/arthur/flag.txt
RUN chmod 644 /home/arthur/flag.txt
COPY --from=0 tintagel /home/arthur/
COPY xinetd.conf /etc/xinetd.d/tintagel
COPY runchal /usr/bin/runchal
RUN chmod +x /usr/bin/runchal
WORKDIR /home/arthur

CMD ["/usr/sbin/xinetd", "-dontfork"]
