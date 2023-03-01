CREATE TABLE roterizador.dbo.ZONAS (
	ID int IDENTITY(0,1) NOT NULL,
	titulo nvarchar(200) NOT NULL,
	data_exclusao smalldatetime NULL,
	CONSTRAINT ZONAS_PK PRIMARY KEY (ID)
);

CREATE TABLE roterizador.dbo.ZONAS_LAT_LONG (
	ID int IDENTITY(0,1) NOT NULL,
	latitude float NOT NULL,
	longitude float NOT NULL,
	zona_id int NOT NULL,
	CONSTRAINT ZONAS_LAT_LONG_PK PRIMARY KEY (ID),
	CONSTRAINT ZONAS_LAT_LONG_FK FOREIGN KEY (zona_id) REFERENCES roterizador.dbo.ZONAS(ID)
);

