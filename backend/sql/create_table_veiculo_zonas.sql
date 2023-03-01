-- roteirizador.dbo.VEICULOS_ZONAS definition

-- Drop table

-- DROP TABLE roteirizador.dbo.VEICULOS_ZONAS;

CREATE TABLE roteirizador.dbo.VEICULOS_ZONAS (
	ID int IDENTITY(0,1) NOT NULL,
	zona_id int NOT NULL,
	veiculo_id int NOT NULL,
	CONSTRAINT VEICULOS_ZONAS_PK PRIMARY KEY (ID)
);


-- roteirizador.dbo.VEICULOS_ZONAS foreign keys

ALTER TABLE roteirizador.dbo.VEICULOS_ZONAS ADD CONSTRAINT VEICULOS_ZONAS_FK_VEICULOS FOREIGN KEY (veiculo_id) REFERENCES roteirizador.dbo.VEICULOS(ID);
ALTER TABLE roteirizador.dbo.VEICULOS_ZONAS ADD CONSTRAINT VEICULOS_ZONAS_FK_ZONAS FOREIGN KEY (zona_id) REFERENCES roteirizador.dbo.ZONAS(ID);