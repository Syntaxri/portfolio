export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return Response.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    console.log('Contact form submission:', { name, email, message });

    return Response.json({ success: true, message: 'Message received!' });
  } catch (err) {
    console.error('Contact API error:', err);
    return Response.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}