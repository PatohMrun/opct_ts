// app/api/mpesa-payout/route.js

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  // console.log('CONSUMER_KEY:', process.env.CONSUMER_KEY);
  // console.log('CONSUMER_SECRET:', process.env.CONSUMER_SECRET);
  // console.log('BASE_URL:', process.env.BASE_URL);

  try {
    const { phoneNumber, amount } = await request.json();

    // Generate access token
    const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString('base64');
    const tokenResponse = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const accessToken = tokenResponse.data.access_token;

    // Prepare payout request
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`174379bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919${timestamp}`).toString('base64');
    const OriginatorConversationID = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const payoutResponse = await axios.post(
  'https://sandbox.safaricom.co.ke/mpesa/b2c/v3/paymentrequest',
  {
    OriginatorConversationID: OriginatorConversationID,
    InitiatorName: "testapi",
    InitiatorPassword: "Safaricom999!*!",
    SecurityCredential: "CHYLJWaroiJrs71I+gIXvYXEqsT0C5Jmhlotz/TqLHW3WpSy9HfbzYJ4idU2CczuSjL4+eXjXppa4zPZ0suG1DaMPg1FMnSFTSrAGskm/tJpGUIOpPcGn3T4Yt5fPg8pxtC1dTVYT3HUhRvAgom5IWeRgw/a83k7BxU/h3oharooeqWRO4ZSHlE4PDMdglgPfE66NJWQ9VMiFPYd1IlUyiGF/q+lW3qCbKjhpqNCzI+fyXijAwNPvwGbclFbwIdNbc1JX/mzEOEseF1wSmUtO7i+nWGxd4xkKkqDTEHFdmr0PHwtc9xivQqyGtXHlf2BbAkua+VvGUH2GdFpxErb/Q==",
    CommandID: "PromotionPayment",
    Amount: amount,
    PartyA: "174379",  // Sandbox business short code
    PartyB: phoneNumber,
    Remarks: "Test payout",
    QueueTimeOutURL: `${process.env.BASE_URL}/api/mpesa-callback`,
    ResultURL: `${process.env.BASE_URL}/api/mpesa-callback`,
    Occasion: "Testing"
  },
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }
);
  console.log(phoneNumber, amount, payoutResponse.data);

    return NextResponse.json(payoutResponse.data);
  } catch (error) {
    console.error('M-Pesa Payout Error:', error.response ? error.response.data : error.message);
    return NextResponse.json({ error: 'Failed to process M-Pesa payout', details: error.response ? error.response.data : error.message }, { status: 500 });
  }
}