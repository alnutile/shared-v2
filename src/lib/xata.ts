import { BaseClientOptions, buildClient, SchemaInference, XataRecord } from '@xata.io/client';

const tables = [
  {
    name: 'shares',
    columns: [
      { name: 'content', type: 'text' },
      { name: 'expires', type: 'datetime' },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type DatabaseSchema = SchemaInference<SchemaTables>;

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL: import.meta.env.VITE_XATA_DB_URL,
  apiKey: import.meta.env.VITE_XATA_API_KEY,
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}