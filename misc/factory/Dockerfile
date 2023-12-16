FROM ubuntu:20.04

# Installation des dépendances
RUN apt-get update && apt-get install -y python2 sudo openssh-server

# Lancement de SSH
RUN service ssh start

# Création de l'utilisateur de jeu et définition du répertoire de travail
RUN useradd --create-home h0h0spy
WORKDIR /home/h0h0spy

# Copie des fichiers de CTF et gestion des accès
COPY ./files /home/h0h0spy
RUN tr -d '\r' < ctf.py > factory.py
RUN rm ctf.py
RUN echo "h0h0spy ALL = (root) NOPASSWD : /home/h0h0spy/factory.py" > /etc/sudoers
RUN chmod go-rwx .passwd
RUN chmod go-w factory.py
RUN chmod go+x factory.py

# Ouverture du port 22 du container pour la connexion SSH
RUN echo "Match User root" >> /etc/ssh/sshd_config
RUN echo "PasswordAuthentication no" >> /etc/ssh/sshd_config
RUN echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config
EXPOSE 22

RUN echo "h0h0spy:factory-input" | chpasswd

CMD ["/usr/sbin/sshd", "-D"]