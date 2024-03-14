SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;

--
-- Cơ sở dữ liệu: `ambertaxidb`
--
CREATE DATABASE IF NOT EXISTS `ambertaxidb` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `ambertaxidb`;

CREATE TABLE `User`(
    `uuid`      VARCHAR(256)    NOT NULL PRIMARY KEY DEFAULT UUID(),
    `fullName`  VARCHAR(64)     NOT NULL,
    `gender`    VARCHAR(6)      ,
    `address`   VARCHAR(256)    NOT NULL,
    `phone`     VARCHAR(11)     NOT NULL UNIQUE,
    `email`     VARCHAR(128)    NOT NULL UNIQUE,
    `password`  VARCHAR(128)    NOT NULL,
    `role`      VARCHAR(24)     NOT NULL,
    `dob`       DATE            NOT NULL,
    `cic`       VARCHAR(12)     NOT NULL UNIQUE,
    `avatar`    VARCHAR(64)     NOT NULL DEFAULT 'avatar_default.png',
    `createdAt` DATETIME        DEFAULT NOW()
);

INSERT INTO `User` (`uuid`, `fullName`, `gender`, `address`, `phone`, `email`, `password`, `role`, `dob`, `cic`) VALUES
('4c57822f-c988-11ee-8e91-5820b173002f', 'Quản Trị Viên', 'female', 'TPHCM', '0968472914', 'admin@gmail.com', '$2b$10$WHAZtR76jfvQBHCE/ShGNuKeodPQYQ9MUU5qCH2ce45s7/OzKbM2y', 'Admin', '2000-10-24', '087200002595'),
('4c57822f-c988-11ee-8e91-5820b173296f', 'Hoàng Thị Thùy Trang', 'female', 'TPHCM', '0968472915', 'trang@gmail.com', '$2b$10$WHAZtR76jfvQBHCE/ShGNuKeodPQYQ9MUU5qCH2ce45s7/OzKbM2y', 'CallAgent', '2000-02-19', '087200002596'),
('4c57822f-c988-11ee-8e91-5820a173296f', 'Trang Hoàng', 'female', 'TPHCM', '0968472916', 'tranghoang@gmail.com', '$2b$10$WHAZtR76jfvQBHCE/ShGNuKeodPQYQ9MUU5qCH2ce45s7/OzKbM2y', 'CallAgent', '2000-10-24', '087200002597'),
('4c57822f-c988-11ee-8e91-5820d173296f', 'Lưu Quang Thắng', 'male', 'TPHCM', '0968472917', 'thang@gmail.com', '$2b$10$WHAZtR76jfvQBHCE/ShGNuKeodPQYQ9MUU5qCH2ce45s7/OzKbM2y', 'Driver', '2000-10-24', '087200002599'),
('4c57822f-c988-11ee-8e91-582ee173200f', 'Hà Quốc Toàn', 'male', 'TPHCM', '0968472918', 'haquoctoan@gmail.com', '$2b$10$WHAZtR76jfvQBHCE/ShGNuKeodPQYQ9MUU5qCH2ce45s7/OzKbM2y', 'Driver', '2000-10-24', '087200002960'),
('4c57822f-c988-11ee-8e91-582ee173200b', 'Quốc Toàn', 'male', 'TPHCM', '0968472920', 'toan@gmail.com', '$2b$10$WHAZtR76jfvQBHCE/ShGNuKeodPQYQ9MUU5qCH2ce45s7/OzKbM2y', 'Customer', '2000-10-24', '087200002010');


CREATE TABLE `CallCenterAgent`(
    `uuid`                  VARCHAR(256)    NOT NULL PRIMARY KEY DEFAULT UUID(),
    `userId`                VARCHAR(256)    NOT NULL,
    `state`                 TINYINT(1)      NOT NULL DEFAULT 0,
    FOREIGN KEY (`userId`)  REFERENCES      `User`(`uuid`) ON DELETE CASCADE
);
INSERT INTO `CallCenterAgent`(`userId`) VALUES 
('4c57822f-c988-11ee-8e91-5820b173296f'),
('4c57822f-c988-11ee-8e91-5820a173296f');


CREATE TABLE `Driver`(
    `uuid`                  VARCHAR(256)    NOT NULL PRIMARY KEY DEFAULT UUID(),
    `userId`                VARCHAR(256)    NOT NULL,
    `drivingLicenceNumber`  VARCHAR(12)     NOT NULL,
    `expiryDate`            DATE            NOT NULL,
    `state`                 VARCHAR(12)     NOT NULL DEFAULT "OFFLINE",        
    FOREIGN KEY (`userId`)  REFERENCES      `User`(`uuid`) ON DELETE CASCADE
);
INSERT INTO `Driver`(`userId`, `drivingLicenceNumber`, `expiryDate`) VALUES 
('4c57822f-c988-11ee-8e91-5820d173296f', 'SG-98-87965410', '2025-10-24'),
('4c57822f-c988-11ee-8e91-582ee173200f', 'HN-98-87965455', '2025-10-24');


CREATE TABLE `Customer`(
    `uuid`                  VARCHAR(256)    NOT NULL PRIMARY KEY DEFAULT UUID(),
    `userId`                VARCHAR(256)    ,
    FOREIGN KEY (`userId`)  REFERENCES      `User`(`uuid`) ON DELETE CASCADE
);
INSERT INTO `Customer`(`userId`) VALUES
('4c57822f-c988-11ee-8e91-582ee173200b');


CREATE TABLE `Car`(
    `uuid`                  VARCHAR(256)    NOT NULL PRIMARY KEY DEFAULT UUID(),
    `modelName`             VARCHAR(64)     NOT NULL,
    `modelDescription`      VARCHAR(256)    ,
    `manufactureYear`       DATE            NOT NULL,
    `seat`                  TINYINT(1)      NOT NULL DEFAULT 2,
    `color`                 VARCHAR(12)     ,
    `carImage`              VARCHAR(64)     NOT NULL,
    `licensePlate`          VARCHAR(12)     NOT NULL UNIQUE
);
INSERT INTO `Car`(`uuid`, `modelName`, `modelDescription`, `manufactureYear`, `seat`, `color`, `carImage`, `licensePlate`) VALUES
('87a31447-de03-11ee-80f6-5820b173002f', 'YARIS 1.5G CVT', 'Dài x rộng x cao (mm) 4.140 x 1.733 x 1.500, Chiều dài cơ sở (mm) 2.550, Khoảng sáng gầm xe (mm) 135', '2024-1-1', 4, 'white', '', '28G-496.27'),
('87a32c47-de03-11ee-80f6-5820b173002f', 'FORTUNER 2.4AT 4X2', 'Dài x rộng x cao (mm) 4.795 x 1.855 x 1.835, Chiều dài cơ sở (mm) 2.745, Khoảng sáng gầm xe (mm) 279', '2024-2-1', 7, 'white', '', '75G-145.19');


CREATE TABLE `DriverShift`(
    `uuid`                      VARCHAR(256)    NOT NULL PRIMARY KEY DEFAULT UUID(),
    `driverId`                  VARCHAR(256)    NOT NULL,
    `carId`                     VARCHAR(256)    NOT NULL,
    `shiftStartTime`            DATETIME        NOT NULL,
    `shiftEndTime`              DATETIME        NOT NULL,
    `createdAt`                 DATETIME        DEFAULT NOW(),
    FOREIGN KEY (`driverId`)    REFERENCES      `User`(`uuid`) ON DELETE CASCADE,
    FOREIGN KEY (`carId`)       REFERENCES      `Car`(`uuid`) ON DELETE CASCADE
);
INSERT INTO `DriverShift`(`uuid`, `driverId`, `carId`, `shiftStartTime`, `shiftEndTime`) VALUES
('184e410d-df8b-11ee-86aa-5820b173002f', '4c57822f-c988-11ee-8e91-5820d173296f', '87a31447-de03-11ee-80f6-5820b173002f', '2024-02-11T01:19:20.000Z', '2024-02-11T10:19:20.000Z'),
('24abcf7b-df84-11ee-86aa-5820b173002f', '4c57822f-c988-11ee-8e91-5820d173296f', '87a31447-de03-11ee-80f6-5820b173002f', '2024-02-12T01:19:20.000Z', '2024-02-12T10:19:20.000Z');


CREATE TABLE `Ride`(
    `uuid`                          VARCHAR(256)    NOT NULL PRIMARY KEY DEFAULT UUID(),
    `fullName`                      VARCHAR(64)     NOT NULL,
    `gender`                        VARCHAR(6)      ,
    `phone`                         VARCHAR(11)     NOT NULL,
    `seat`                          INT             NOT NULL DEFAULT 1,
    `rideStartTime`                 DATETIME        NOT NULL DEFAULT NOW(),
    `rideEndTime`                   DATETIME        ,
    `startingPoint`                 VARCHAR(512)    NOT NULL,
    `destinationPoint`              VARCHAR(512)    NOT NULL,
    `distance`                      FLOAT           ,
    `price`                         INT             ,
    `note`                          TEXT            
);
INSERT INTO `Ride`(`uuid`, `fullName`, `gender`, `phone`, `seat`, `rideStartTime`, `rideEndTime`, `startingPoint`, `destinationPoint`, `distance`, `price`, `note`) VALUES
( 'a71be842-df84-11ee-86aa-5820b173002f', 'Quốc Toàn', 'male', '0968472920', 1, '2024-02-12T05:19:20.000Z', '2024-02-12T05:29:20.000Z', '10.7320052;106.69846544359132;Trường Đại học Tôn Đức Thắng, 19, Đường Nguyễn Hữu Thọ, Phường Tân Phong, Quận 7, Thành phố Hồ Chí Minh, 72915, Việt Nam', '10.7628184;106.69328235;Đại học Văn Lang, 45, Nguyễn Khắc Nhu, Phường Cô Giang, Quận 1, Thành phố Hồ Chí Minh, 70200, Việt Nam', 6.28, 93122, 'Cần tài xế phụ mang đồ');

CREATE TABLE `RideStatus`(
    `uuid`                          VARCHAR(256)    NOT NULL PRIMARY KEY DEFAULT UUID(),
    `rideId`                        VARCHAR(256)    NOT NULL,
    `driverId`                      VARCHAR(256)    ,
    `driverShiftId`                 VARCHAR(256)    ,
    `state`                         VARCHAR(12)     NOT NULL DEFAULT 'CREATED',
    `stateTime`                     DATETIME        NOT NULL DEFAULT NOW(),
    `stateDetail`                   VARCHAR(256)    ,
    FOREIGN KEY (`rideId`)          REFERENCES      `Ride`(`uuid`) ON DELETE CASCADE,
    FOREIGN KEY (`driverId`)        REFERENCES      `User`(`uuid`) ON DELETE CASCADE,
    FOREIGN KEY (`driverShiftId`)   REFERENCES      `DriverShift`(`uuid`) ON DELETE CASCADE
);
INSERT INTO `RideStatus`(`rideId`, `driverId`, `driverShiftId`, `state`, `stateTime`, `stateDetail`) VALUES
('a71be842-df84-11ee-86aa-5820b173002f', '4c57822f-c988-11ee-8e91-5820d173296f', '24abcf7b-df84-11ee-86aa-5820b173002f', 'CREATED', '2024-02-12T05:19:20.000Z', ''),
('a71be842-df84-11ee-86aa-5820b173002f', '4c57822f-c988-11ee-8e91-5820d173296f', '24abcf7b-df84-11ee-86aa-5820b173002f', 'ACCEPTED', '2024-02-12T05:20:20.000Z', ''),
('a71be842-df84-11ee-86aa-5820b173002f', '4c57822f-c988-11ee-8e91-5820d173296f', '24abcf7b-df84-11ee-86aa-5820b173002f', 'PICKED', '2024-02-12T05:25:20.000Z', ''),
('a71be842-df84-11ee-86aa-5820b173002f', '4c57822f-c988-11ee-8e91-5820d173296f', '24abcf7b-df84-11ee-86aa-5820b173002f', 'DONE', '2024-02-12T05:29:20.000Z', '');


CREATE TABLE `Message`(
    `uuid`                          VARCHAR(256)    NOT NULL PRIMARY KEY DEFAULT UUID(),
    `rideId`                        VARCHAR(256)    NOT NULL,
    `senderId`                      VARCHAR(256)    NOT NULL,
    `receiverId`                    VARCHAR(256)    NOT NULL,
    `sendingTime`                   DATETIME        NOT NULL DEFAULT NOW(),
    `message`                       VARCHAR(256)    NOT NULL,
    FOREIGN KEY (`rideId`)          REFERENCES      `Ride`(`uuid`) ON DELETE CASCADE,
    FOREIGN KEY (`senderId`)        REFERENCES      `User`(`uuid`) ON DELETE CASCADE,
    FOREIGN KEY (`receiverId`)      REFERENCES      `User`(`uuid`) ON DELETE CASCADE
);


CREATE TABLE `Call`(
    `uuid`                          VARCHAR(256)    NOT NULL PRIMARY KEY DEFAULT UUID(),
    `userCallId`                    VARCHAR(256)    NOT NULL,
    `userAnswerId`                  VARCHAR(256)    NOT NULL,
    `beginCallingTime`              DATETIME        NOT NULL DEFAULT NOW(),
    `endCallingTime`                DATETIME        ,
    `callingStatus`                 VARCHAR(16)     NOT NULL,
    FOREIGN KEY (`userCallId`)      REFERENCES      `User`(`uuid`) ON DELETE CASCADE,
    FOREIGN KEY (`userAnswerId`)    REFERENCES      `User`(`uuid`) ON DELETE CASCADE
);


CREATE TABLE `Rating`(
    `uuid`                          VARCHAR(256)    NOT NULL PRIMARY KEY DEFAULT UUID(),
    `rideId`                        VARCHAR(256)    NOT NULL,
    `driverId`                      VARCHAR(256)    NOT NULL,
    `userId`                        VARCHAR(256)    NOT NULL,
    `ratingComment`                 TEXT            ,
    `ratingTag`                     VARCHAR(128)    DEFAULT NULL,
    `ratingValue`                   INT             NOT NULL,
    `ratingTime`                    DATETIME        NOT NULL DEFAULT NOW(),
    FOREIGN KEY (`rideId`)          REFERENCES      `Ride`(`uuid`) ON DELETE CASCADE,
    FOREIGN KEY (`driverId`)        REFERENCES      `User`(`uuid`) ON DELETE CASCADE,
    FOREIGN KEY (`userId`)          REFERENCES      `User`(`uuid`) ON DELETE CASCADE
);
INSERT INTO `Rating`(`rideId`, `driverId`, `userId`, `ratingComment`, `ratingTag`, `ratingValue`, `ratingTime`) VALUES
('a71be842-df84-11ee-86aa-5820b173002f', '4c57822f-c988-11ee-8e91-5820d173296f', '4c57822f-c988-11ee-8e91-582ee173200b', 'Bác tài rất thân thiện, đúng giờ và nói chuyện rất lịch sự', 'Đúng giờ;Thân thiện', 5, '2024-02-14T05:19:20.000Z');
