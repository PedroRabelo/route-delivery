module.exports = {
  apps : [{
    name   : "route-api",
    script : "./dist/main.js",
    env: {
	DATABASE_URL: "3.230.101.136",
	DATABASE_USERNAME: "sistema",
	DATABASE_PWD: "dbaGest@",
	DATABASE_NAME: "roterizador"
    }
  }] 
}
