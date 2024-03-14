CREATE TABLE `CallingHistory`(
  `uuid`      			VARCHAR(256)    NOT NULL PRIMARY KEY,
  `idUserCall` 			VARCHAR(256)     ,
  `idUserAnswer`		VARCHAR(256)     ,
  `beginCallingTime`	DATETIME	 		NOT NULL,
  `endCallingTime`    	DATETIME     		NOT NULL,
  `callingStatus`				VARCHAR(32)		,
  `phone`				VARCHAR(32)	 	,
  `createdAt` 			DATETIME        DEFAULT NOW()
);

DELIMITER ;;
CREATE TRIGGER `CallingHistory_Before_Insert` BEFORE INSERT ON `CallingHistory` FOR EACH ROW
BEGIN
  IF NEW.uuid IS NULL THEN
    SET NEW.uuid = UUID();
    SET @lastest_uuid = NEW.uuid;
  END IF;
END;;
DELIMITER ;
