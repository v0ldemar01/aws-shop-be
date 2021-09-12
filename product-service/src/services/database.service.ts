import { Connection, ConnectionManager, createConnection, getConnectionManager } from 'typeorm'

export default class Database {
  private connectionManager: ConnectionManager

  constructor() {
    this.connectionManager = getConnectionManager()
  }

  public async getConnection(): Promise<Connection> {
    const CONNECTION_NAME = 'default';
    let connection: Connection;
    if (this.connectionManager.has(CONNECTION_NAME)) {
      connection = await this.connectionManager.get(CONNECTION_NAME);
      if (!connection.isConnected) {
        connection = await connection.connect();
      }
    }
    else {
      connection = await createConnection();
    }
    return connection;
  }
}