## Disclaimer

**Notice:** I am not the author of the Phoenix malware, and I am not responsible for any actions taken using the information provided in this repository. This repository is shared strictly for educational purposes, aimed at blue teamers, malware reverse engineers, and threat hunters. The tools and instructions provided here are intended to help cybersecurity professionals understand and mitigate the threat posed by Phoenix banking malware.

Any misuse of the information contained in this repository, including but not limited to illegal activities, is strictly prohibited and entirely the responsibility of the individual(s) involved. By using the materials provided here, you agree to use them responsibly and solely for lawful purposes.

This repository is provided "as is" without any warranties, express or implied. The author is not liable for any damage or loss caused by the use or misuse of the information and tools provided.
# PBBSC
Phoneix banking bot Source code
# Phoenix Banking Malware Deployment

This repository contains scripts and instructions for deploying the Phoenix Banking Malware analysis and management system.

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Frontend Setup](#frontend-setup)
- [Daemon Server Setup](#daemon-server-setup)
- [Settings Panel](#settings-panel)
- [MySQL Setup](#mysql-setup)
- [Starting Services](#starting-services)

## Overview

Phoenix is a sophisticated banking malware designed to steal sensitive financial information. This repository provides tools and instructions to deploy a system for analyzing and managing Phoenix malware.

## Prerequisites

- Ubuntu/Debian-based Linux distribution
- Basic knowledge of terminal commands and system administration

## Installation

1. **Update the package list and install `dos2unix`:**
    ```sh
    sudo apt update && sudo apt install dos2unix -y
    ```

2. **Convert and execute the `install.sh` script:**
    ```sh
    dos2unix install.sh
    chmod 777 install.sh
    bash install.sh
    ```

## Frontend Setup

1. **Install Node.js:**
    ```sh
    bash node.sh 
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    nvm install v19.9.0
    nvm use v19.9.0
    ```

2. **Change License:**
    - Open `/var/data/www/src/settings.js`
    - Change:
      ```js
      LicenseEnd: new Date('2030-09-26'),
      ```
      to:
      ```js
      LicenseEnd: new Date('2500-09-26'),
      ```

3. **Build Frontend:**
    ```sh
    cd /var/data/www
    npm install && npm run build
    npm start  # Verify the frontend starts correctly
    ```

## Daemon Server Setup

1. **Start Daemon Panel:**
    ```sh
    cd /var/data/www
    screen npm start
    ```

2. **Start VNC Daemon:**
    ```sh
    cd /root
    screen ./vnc
    ```

## Settings Panel

- Access the panel at `http://..urlpanel..:5000/login?secret=..loginds..`
- Access the traffic panel at `http://..trafficpanel../index.php`
- Gate URL: `http://..urlpanel..:4000`
- VNC URL: `http://..urlpanel..:9000`
- API key for the Gate: `..apicryptkey..`

## MySQL Setup

1. **MySQL Credentials:**
    - Server IP: `yourip`
    - User: `phoniex`
    - Password: `..passsql..`
    - Database: `bot`

2. **Restart MySQL and other services:**
    ```sh
    sudo service mysql restart
    sudo service nginx restart
    sudo service php8.1-fpm restart
    ```

3. **Add Admin:**
    ```sh
    cd /root && ./addadmin.sh
    ```

## Starting Services

1. **Start VNC Daemon:**
    ```sh
    cd /root
    screen ./vnc
    ```

2. **Start Frontend:**
    ```sh
    cd /var/data/www
    screen npm start
    ```

Ensure all services are running as expected by checking the respective URLs and panels.

## Useful Links

- [Analysis and trends of Android Phoenix malware](https://cryptax.medium.com/android-phoenix-authors-claims-sample-identification-and-trends-f199cbc9901d)

Stay tuned for upcoming blog articles focusing on further insights into this malware.

[Binance_ID:271854090]

[Pray for peace to 🇵🇸]

![PS Image](https://www.humeurs.be/wp-content/uploads/2023/10/PAN20231016_Crabes-1200-web-1024x838.jpg)
![PSS Image](./images.jpg)
