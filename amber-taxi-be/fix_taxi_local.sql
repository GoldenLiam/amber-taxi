DELIMITER ;;
CREATE PROCEDURE Get_Inserted_Uuid_Record(
    IN r_uuid VARCHAR(256)
)
BEGIN
    SELECT r_uuid;
END ;;
DELIMITER ;


CREATE TABLE `User`(
    `uuid`      VARCHAR(256)    NOT NULL PRIMARY KEY,
    `firstName` VARCHAR(64)     NOT NULL,
    `lastName`  VARCHAR(64)     NOT NULL,
    `gender`    VARCHAR(6)      ,
    `address`   VARCHAR(256)    NOT NULL,
    `phone`     VARCHAR(11)     NOT NULL UNIQUE,
    `email`     VARCHAR(128)    NOT NULL UNIQUE,
    `password`  VARCHAR(128)    NOT NULL,
    `role`      VARCHAR(12)     NOT NULL,
    `dob`       DATE            NOT NULL,
    `cic`       VARCHAR(12)     NOT NULL UNIQUE,
    `online`    BOOLEAN         NOT NULL DEFAULT FALSE,
    `createdAt` DATETIME        DEFAULT NOW()
);

DELIMITER ;;
CREATE TRIGGER `User_Before_Insert` BEFORE INSERT ON `User` FOR EACH ROW
BEGIN
  IF NEW.uuid IS NULL THEN
    SET NEW.uuid = UUID();
    CALL get_inserted_uuid_record(NEW.uuid);
  END IF;
END;;
DELIMITER ;

INSERT INTO `User` (`firstName`, `lastName`, `address`, `phone`, `email`, `password`, `role`, `dob`, `cic`) VALUES
('Viên', 'Quản Trị', 'Quận 7 TPHCM', '0968472914', 'admin@gmail.com', '$2b$10$WHAZtR76jfvQBHCE/ShGNuKeodPQYQ9MUU5qCH2ce45s7/OzKbM2y', 'Admin', '2000-10-24', '087200002595');



CREATE TABLE `CallCenterAgent`(
    `uuid`                  VARCHAR(256)    NOT NULL PRIMARY KEY,
    `userId`                VARCHAR(256)    NOT NULL,
    `state`                 TINYINT(1)      NOT NULL DEFAULT 0,
    FOREIGN KEY (`userId`)  REFERENCES      `User`(`uuid`) ON DELETE CASCADE
);

DELIMITER ;;
CREATE TRIGGER `CallCenterAgent_Before_Insert` BEFORE INSERT ON `CallCenterAgent` FOR EACH ROW
BEGIN
  IF NEW.uuid IS NULL THEN
    SET NEW.uuid = UUID();
    CALL get_inserted_uuid_record(NEW.uuid);
  END IF;
END;;
DELIMITER ;



CREATE TABLE `Driver`(
    `uuid`                  VARCHAR(256)    NOT NULL PRIMARY KEY,
    `userId`                VARCHAR(256)    NOT NULL,
    `drivingLicenceNumber`  VARCHAR(12)     NOT NULL,
    `expiryDate`            DATE            NOT NULL,
    `state`                 TINYINT(1)      NOT NULL DEFAULT 0,        
    FOREIGN KEY (`userId`)  REFERENCES      `User`(`uuid`) ON DELETE CASCADE
);

DELIMITER ;;
CREATE TRIGGER `Driver_Before_Insert` BEFORE INSERT ON `Driver` FOR EACH ROW
BEGIN
  IF NEW.uuid IS NULL THEN
    SET NEW.uuid = UUID();
    CALL get_inserted_uuid_record(NEW.uuid);
  END IF;
END;;
DELIMITER ;



CREATE TABLE `Customer`(
    `uuid`                  VARCHAR(256)    NOT NULL PRIMARY KEY,
    `userId`                VARCHAR(256)    ,
    FOREIGN KEY (`userId`)  REFERENCES      `User`(`uuid`) ON DELETE CASCADE
);

DELIMITER ;;
CREATE TRIGGER `Customer_Before_Insert` BEFORE INSERT ON `Customer` FOR EACH ROW
BEGIN
  IF NEW.uuid IS NULL THEN
    SET NEW.uuid = UUID();
    CALL get_inserted_uuid_record(NEW.uuid);
  END IF;
END;;
DELIMITER ;



CREATE TABLE `CarModel`(
    `uuid`                  VARCHAR(256)    NOT NULL PRIMARY KEY,
    `modelName`             VARCHAR(64)     NOT NULL,
    `modelDescription`      VARCHAR(256)    ,
    `manufactureYear`       DATE            NOT NULL,
    `color`                 VARCHAR(12)     ,
    `licensePlate`          VARCHAR(12)     NOT NULL
);

DELIMITER ;;
CREATE TRIGGER `CarModel_Before_Insert` BEFORE INSERT ON `CarModel` FOR EACH ROW
BEGIN
  IF NEW.uuid IS NULL THEN
    SET NEW.uuid = UUID();
    CALL get_inserted_uuid_record(NEW.uuid);
  END IF;
END;;
DELIMITER ;


CREATE TABLE `DriverShift`(
    `uuid`                      VARCHAR(256)    NOT NULL PRIMARY KEY,
    `driverId`                  VARCHAR(256)    NOT NULL,
    `carId`                     VARCHAR(256)    NOT NULL,
    `shiftStartTime`            DATETIME        NOT NULL,
    `shiftEndTime`              DATETIME        NOT NULL,
    FOREIGN KEY (`driverId`)    REFERENCES      `User`(`uuid`) ON DELETE CASCADE,
    FOREIGN KEY (`carId`)       REFERENCES      `CarModel`(`uuid`) ON DELETE CASCADE
);

DELIMITER ;;
CREATE TRIGGER `DriverShift_Before_Insert` BEFORE INSERT ON `DriverShift` FOR EACH ROW
BEGIN
  IF NEW.uuid IS NULL THEN
    SET NEW.uuid = UUID();
    CALL get_inserted_uuid_record(NEW.uuid);
  END IF;
END;;
DELIMITER ;



CREATE TABLE `Ride`(
    `uuid`                          VARCHAR(256)    NOT NULL PRIMARY KEY,
    `customerId`                    VARCHAR(256)    NOT NULL,
    `rideStarTime`                  DATETIME        NOT NULL DEFAULT NOW(),
    `rideEndTime`                   DATETIME        ,
    `addressStartingPoint`          CHAR(12)        NOT NULL,
    `gpsStartingPoint`              VARCHAR(12)     ,
    `addressDestinationPoint`       VARCHAR(12)     NOT NULL,
    `gpsDestinationPoint`           VARCHAR(12)     ,
    `price`                         INT             ,
    FOREIGN KEY (`customerId`)        REFERENCES      `User`(`uuid`) ON DELETE CASCADE
);

DELIMITER ;;
CREATE TRIGGER `Ride_Before_Insert` BEFORE INSERT ON `Ride` FOR EACH ROW
BEGIN
  IF NEW.uuid IS NULL THEN
    SET NEW.uuid = UUID();
    CALL get_inserted_uuid_record(NEW.uuid);
  END IF;
END;;
DELIMITER ;



CREATE TABLE `RideStatus`(
    `uuid`                          VARCHAR(256)    NOT NULL PRIMARY KEY,
    `driverId`                      VARCHAR(256)    NOT NULL,
    `driverShiftId`                 VARCHAR(256)    NOT NULL,
    `state`                         TINYINT(1)      NOT NULL DEFAULT 0,
    `stateTime`                     DATETIME        NOT NULL,
    `stateDetail`                   VARCHAR(256)    ,
    FOREIGN KEY (`driverId`)        REFERENCES      `User`(`uuid`) ON DELETE CASCADE,
    FOREIGN KEY (`driverShiftId`)   REFERENCES      `DriverShift`(`uuid`) ON DELETE CASCADE
);

DELIMITER ;;
CREATE TRIGGER `RideStatus_Before_Insert` BEFORE INSERT ON `RideStatus` FOR EACH ROW
BEGIN
  IF NEW.uuid IS NULL THEN
    SET NEW.uuid = UUID();
    CALL get_inserted_uuid_record(NEW.uuid);
  END IF;
END;;
DELIMITER ;


