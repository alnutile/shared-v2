import { Handler } from '@netlify/functions';
import { XataClient } from '../../src/lib/xata';

const xata = new XataClient({
  apiKey: process.env.XATA_API_KEY,
  databaseURL: process.env.XATA_DB_URL,
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const id = event.path.split('/').pop();
    if (!id) {
      return { statusCode: 400, body: 'ID is required' };
    }

    const record = await xata.db.shares.read(id);
    
    if (!record) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Share not found' }) };
    }

    if (new Date() > record.expires) {
      await xata.db.shares.delete(id);
      return { statusCode: 404, body: JSON.stringify({ error: 'Share expired' }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        content: record.content,
        expires: record.expires.getTime(),
      }),
    };
  } catch (error) {
    console.error('Error getting share:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get share' }),
    };
  }
};