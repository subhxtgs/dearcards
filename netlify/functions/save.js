exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');

    const upstream = await fetch('https://jsonblob.com/api/jsonBlob', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const location = upstream.headers.get('location') || upstream.headers.get('Location') || upstream.url || '';
    const id = location.split('/').filter(Boolean).pop();

    if (!upstream.ok || !id) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'Could not save the letter right now.' })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Something went wrong saving the letter.' })
    };
  }
};
