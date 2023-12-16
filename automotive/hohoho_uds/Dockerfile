FROM python:3.9.16-slim AS app

#FROM pwn.red/jail
#COPY --from=app / /srv
#COPY src/ /srv/app/
#COPY src/doipserver.py /srv/app/run
#RUN chmod +x /srv/app/run
#ENV JAIL_MEM=20M JAIL_PORT=13400 JAIL_TIME=300

COPY src/ /app/
COPY src/doipserver.py /app/run
RUN chmod +x /app/run
CMD /app/run
EXPOSE 13400

