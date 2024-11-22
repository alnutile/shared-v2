import { Handler } from '@netlify/functions';
import { XataClient } from '../../src/lib/xata';
import { nanoid } from 'nanoid';

const xata = new XataClient({
  apiKey: process.env.XATA_API_KEY,
  databaseURL: process.env.XATA_DB_URL,
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { content } = JSON.parse(event.body || '{}');
    if (!content) {
      return { statusCode: 400, body: 'Content is required' };
    }

    const id = nanoid(10);
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await xata.db.shares.create({
      id,
      content,
      expires,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id }),
    };
  } catch (error) {
    console.error('Error creating share:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create share' }),
    };
  }
};