#!/bin/bash

apt purge mysql-server mysql-* -y
apt purge php8.1 php8.1-* -y
apt purge nginx -y
apt purge tor -y
apt purge ufw -y
apt autoremove -y

rm -rf /etc/nginx
rm -rf /etc/tor

rm /root/vnc
rm -rf /var/data/www