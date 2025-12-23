CREATE TABLE `User` (
  `UserId` INT NOT NULL AUTO_INCREMENT,
  `Username` VARCHAR(100) NOT NULL,
  `PasswordHash` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`UserId`),
  UNIQUE KEY `uq_user_username` (`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Famliy` (
  `FamilyId` INT NOT NULL AUTO_INCREMENT,
  `FamilyName` VARCHAR(120) NOT NULL,
  `FamilyCode` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`FamilyId`),
  UNIQUE KEY `uq_family_code` (`FamilyCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Production Line` (
  `ProductLineId` INT NOT NULL AUTO_INCREMENT,
  `ProductLineName` VARCHAR(120) NOT NULL,
  `FamilyId` INT NOT NULL,
  PRIMARY KEY (`ProductLineId`),
  KEY `idx_production_line_family_id` (`FamilyId`),
  CONSTRAINT `fk_production_line_family`
    FOREIGN KEY (`FamilyId`) REFERENCES `Famliy` (`FamilyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Product` (
  `ProductId` INT NOT NULL AUTO_INCREMENT,
  `ProductLineId` INT NOT NULL,
  `ProductName` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`ProductId`),
  KEY `idx_product_product_line_id` (`ProductLineId`),
  CONSTRAINT `fk_product_product_line`
    FOREIGN KEY (`ProductLineId`) REFERENCES `Production Line` (`ProductLineId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Processes` (
  `ProcessId` INT NOT NULL AUTO_INCREMENT,
  `ProcessName` VARCHAR(120) NOT NULL,
  `ProcessDescription` TEXT,
  PRIMARY KEY (`ProcessId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `ProsesskarakteristikkCrad` (
  `ProcessCharacteristicCardId` INT NOT NULL AUTO_INCREMENT,
  `ProcessId` INT NOT NULL,
  `Title` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`ProcessCharacteristicCardId`),
  KEY `idx_process_characteristic_process_id` (`ProcessId`),
  CONSTRAINT `fk_process_characteristic_process`
    FOREIGN KEY (`ProcessId`) REFERENCES `Processes` (`ProcessId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `ProductionLineProssesCharacterisitcsCard` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `ProductionLineId` INT NOT NULL,
  `ProcessCharacteristicCardId` INT NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `idx_plpcc_production_line_id` (`ProductionLineId`),
  KEY `idx_plpcc_process_characteristic_card_id` (`ProcessCharacteristicCardId`),
  CONSTRAINT `fk_plpcc_production_line`
    FOREIGN KEY (`ProductionLineId`) REFERENCES `Production Line` (`ProductLineId`),
  CONSTRAINT `fk_plpcc_process_characteristic`
    FOREIGN KEY (`ProcessCharacteristicCardId`) REFERENCES `ProsesskarakteristikkCrad` (`ProcessCharacteristicCardId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `ProductCharacterisicCard` (
  `ProductCharacteristicCardId` INT NOT NULL AUTO_INCREMENT,
  `ProductId` INT NOT NULL,
  `CharacteristicName` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`ProductCharacteristicCardId`),
  KEY `idx_product_characteristic_product_id` (`ProductId`),
  CONSTRAINT `fk_product_characteristic_product`
    FOREIGN KEY (`ProductId`) REFERENCES `Product` (`ProductId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `CauseCardCat` (
  `CauseCardCatId` INT NOT NULL AUTO_INCREMENT,
  `ProductCharacteristicCardId` INT NOT NULL,
  `CategoryName` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`CauseCardCatId`),
  KEY `idx_cause_card_cat_product_characteristic_id` (`ProductCharacteristicCardId`),
  CONSTRAINT `fk_cause_card_cat_product_characteristic`
    FOREIGN KEY (`ProductCharacteristicCardId`) REFERENCES `ProductCharacterisicCard` (`ProductCharacteristicCardId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `CauseCardAll` (
  `CauseCardAllId` INT NOT NULL AUTO_INCREMENT,
  `ProcessId` INT NOT NULL,
  `Summary` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`CauseCardAllId`),
  KEY `idx_cause_card_all_process_id` (`ProcessId`),
  CONSTRAINT `fk_cause_card_all_process`
    FOREIGN KEY (`ProcessId`) REFERENCES `Processes` (`ProcessId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `CauseCard` (
  `CauseCardId` INT NOT NULL AUTO_INCREMENT,
  `CauseCardCatId` INT NOT NULL,
  `CauseCardAllId` INT NOT NULL,
  PRIMARY KEY (`CauseCardId`),
  KEY `idx_cause_card_cause_card_cat_id` (`CauseCardCatId`),
  KEY `idx_cause_card_cause_card_all_id` (`CauseCardAllId`),
  CONSTRAINT `fk_cause_card_cat`
    FOREIGN KEY (`CauseCardCatId`) REFERENCES `CauseCardCat` (`CauseCardCatId`),
  CONSTRAINT `fk_cause_card_all`
    FOREIGN KEY (`CauseCardAllId`) REFERENCES `CauseCardAll` (`CauseCardAllId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `SOD-Analysis-CauseCard` (
  `SodAnalysisCauseCardId` INT NOT NULL AUTO_INCREMENT,
  `CauseCardId` INT NOT NULL,
  `Notes` TEXT,
  PRIMARY KEY (`SodAnalysisCauseCardId`),
  KEY `idx_sod_analysis_cause_card_cause_card_id` (`CauseCardId`),
  CONSTRAINT `fk_sod_analysis_cause_card`
    FOREIGN KEY (`CauseCardId`) REFERENCES `CauseCard` (`CauseCardId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `SOD-Analysis-ProductCharacterisicCard` (
  `SodAnalysisProductCharacteristicId` INT NOT NULL AUTO_INCREMENT,
  `ProductCharacteristicCardId` INT NOT NULL,
  `Notes` TEXT,
  PRIMARY KEY (`SodAnalysisProductCharacteristicId`),
  KEY `idx_sod_analysis_product_characteristic_card_id` (`ProductCharacteristicCardId`),
  CONSTRAINT `fk_sod_analysis_product_characteristic`
    FOREIGN KEY (`ProductCharacteristicCardId`) REFERENCES `ProductCharacterisicCard` (`ProductCharacteristicCardId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `SOD-Analysis-ProsesskarakteristikkCrad` (
  `SodAnalysisProcessCharacteristicId` INT NOT NULL AUTO_INCREMENT,
  `ProcessCharacteristicCardId` INT NOT NULL,
  `Notes` TEXT,
  PRIMARY KEY (`SodAnalysisProcessCharacteristicId`),
  KEY `idx_sod_analysis_process_characteristic_card_id` (`ProcessCharacteristicCardId`),
  CONSTRAINT `fk_sod_analysis_process_characteristic`
    FOREIGN KEY (`ProcessCharacteristicCardId`) REFERENCES `ProsesskarakteristikkCrad` (`ProcessCharacteristicCardId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
