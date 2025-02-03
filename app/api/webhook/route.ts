import Stripe from 'stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { stripe } from '@/lib/stripe'
import db from '@/lib/db'

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    console.log('Webhook event received:', event.type);

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;

    if (event.type === 'checkout.session.completed') {
      if (!userId || !courseId) {
        console.error('Missing metadata:', session.metadata);
        return new NextResponse('Webhook Error: Missing metadata', { status: 400 });
      }

      try {
        const purchase = await db.purchase.create({
          data: {
            courseId: courseId,
            userId: userId
          }
        });
        console.log('Purchase created:', purchase);
        
        return new NextResponse(null, { status: 200 });
      } catch (error) {
        console.error('Error creating purchase:', error);
        return new NextResponse('Error creating purchase', { status: 500 });
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error: any) {
    console.error('Webhook error:', error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }
}
