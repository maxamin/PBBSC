#!/bin/bash

read -p "LOGIN: " username
read -s -p "PASSWORD: " password
echo

password_hash=$(echo -n "$password" | sha256sum | awk '{print $1}')

mysql -uphoniex --password="..deadcode.." -e "use \`bot\`; INSERT INTO User (username, password, role, tag, permissions) VALUES ('$username', '$password_hash', 'admin', 'ALL', '1111111');"
