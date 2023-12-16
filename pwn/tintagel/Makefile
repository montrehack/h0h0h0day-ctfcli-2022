all: tintagel

tintagel: tintagel.c
	gcc -o tintagel tintagel.c

tintagel.zip: tintagel.c tintagel chal.yml docker-compose.yml Dockerfile flag.txt runchal xinetd.conf
	rm -f tintagel.zip
	zip tintagel.zip *
