import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log('MPESA callback received');
  
  try {
    const data = await request.json();
    console.log('Callback data:', data);

    // Process the callback data here
    // You might want to update your database or perform other actions based on the callback

    return NextResponse.json({ message: 'Callback received successfully' });
  } catch (error) {
    console.error('Error processing M-Pesa callback:', error);
    return NextResponse.json({ error: 'Failed to process callback' }, { status: 500 });
  }
}

// If you also need to handle GET requests (e.g., for verification), you can add:
export async function GET(request) {
  return NextResponse.json({ message: 'M-Pesa callback endpoint is working' });
}