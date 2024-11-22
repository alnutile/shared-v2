const CREATE_ENDPOINT = 'https://n8n-do.dailyai.studio/webhook/81eae98a-5a6b-4fd8-9a96-816a50845a9b';
const GET_ENDPOINT = 'https://n8n-do.dailyai.studio/webhook/1dec829d-4ce7-43be-a6ee-a787a06712ca';

export async function createShare(content: string): Promise<string> {
  try {
    const response = await fetch(CREATE_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({ text: content }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.uuid;
  } catch (error) {
    console.error('Create share error:', error);
    throw new Error('Failed to create share. Please try again.');
  }
}

interface ShareResponse {
  status: 'active' | 'expired';
  uuid: string;
  text: string;
}

export async function getShare(id: string): Promise<ShareResponse | null> {
  try {
    const response = await fetch(`${GET_ENDPOINT}?uuid=${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get share error:', error);
    return null;
  }
}