import { Client } from 'pg';

export default class DatabaseClient {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      host: process.env.PG_HOST,
      port: +process.env.PG_PORT,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 2000
    });
  }

  public async connect(): Promise<void> {
    console.log(`Connecting to ${this.client.database} database...`);
    await this.client.connect();
  }

  public async disconnect(): Promise<void> {
    console.log(`Disconnecting from ${this.client.database} database...`);
    await this.client.end();
  }

  public async execute<T = any>(query: string, parameters?: string[]): Promise<T[]> {
    const { rows } = await this.client.query(query, parameters);
    return rows;
  }
}