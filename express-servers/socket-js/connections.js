const fs = require('fs');

class Connections {
  constructor() {
    this.Connections = 0;
    this.FileName = './socket-js/connections.json';
    this.ConnectionsSince = this.readFromFile();
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

  UpdateFile(){
    let conn = {
        Connections: this.ConnectionsSince,
    };
    let data = JSON.stringify(conn);
    fs.writeFileSync(this.FileName, data);
  }

  readFromFile(){
    if (fs.existsSync(this.FileName)) {
      let rawdata = fs.readFileSync(this.FileName);
      let conns = JSON.parse(rawdata);
      return conns['Connections'];
    }
    return 0;
  }

};

module.exports = Connections;
