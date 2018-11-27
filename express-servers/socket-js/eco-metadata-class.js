const fs = require('fs');

class EcoData {
  constructor() {
    this.Connections = 0;
    this.FileName = './eco-metadata.json';
    this.updateFromFile();
  }

  get connections() {
    return this.Connections
  }

  get connectionsSince() {
    return this.ConnectionsSince
  }

  addConnection() {
    this.Connections += 1;
    this.ConnectionsSince += 1
    this.UpdateFile();
  }

  removeConnection() {
    this.Connections -= 1;
  }

  get compilationsSince() {
    return this.CompilationsSince
  }

  get deploysSince() {
    return this.DeploysSince
  }

  get invokesSince() {
    return this.InvokesSince
  }

  addCompilation() {
    this.CompilationsSince += 1;
    this.UpdateFile();
  }

  addDeploy() {
    this.DeploysSince += 1;
    this.UpdateFile();
  }

  addInvoke() {
    this.InvokesSince += 1;
    this.UpdateFile();
  }

  UpdateFile(){
    let conn = {
        Connections: this.ConnectionsSince,
        Compilations: this.CompilationsSince,
        Deploys: this.DeploysSince,
        Invokes: this.InvokesSince
    };
    let data = JSON.stringify(conn);
    fs.writeFileSync(this.FileName, data);
  }

  updateFromFile(){
    if (fs.existsSync(this.FileName)) {
      let rawdata = fs.readFileSync(this.FileName);
      let conns = JSON.parse(rawdata);
      this.ConnectionsSince = conns['Connections'];
      this.CompilationsSince = conns['Compilations'];
      this.DeploysSince = conns['Deploys'];
      this.InvokesSince = conns['Invokes'];
    } else
    {
      this.ConnectionsSince = 0;
      this.CompilationsSince = 0;
      this.DeploysSince = 0;
      this.InvokesSince = 0;
    }

  }

};

module.exports = EcoData;
