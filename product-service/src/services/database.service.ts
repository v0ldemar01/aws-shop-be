import { Pool } from 'pg';

export default class DatabaseClient {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.PG_HOST,
      port: +process.env.PG_PORT,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,

      connectionTimeoutMillis: 2000
    });
  }

  public async connect(): Promise<void> {
    console.log(`Connecting to ${this.pool.database} database...`);
    await this.pool.connect();
  }

  public async disconnect(): Promise<void> {
    console.log(`Disconnecting from ${this.pool.database} database...`);
    await this.pool.end();
  }

  public async execute<T = any>(query: string, parameters?: string[]): Promise<T[]> {
    const { rows } = await this.pool.query(query, parameters);
    return rows;
  }
}