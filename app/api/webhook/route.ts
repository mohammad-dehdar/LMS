import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import db from '@/lib/db';
import { stripe } from '@/lib/stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error(`Webhook Error: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;

  if (event.type === 'checkout.session.completed') {
    if (!userId || !courseId) {
      console.error('Webhook Error: Missing metadata');
      return new NextResponse('Webhook Error: Missing metadata', { status: 400 });
    }

    try {
      await db.purchase.create({
        data: {
          courseId: courseId,
          userId: userId,
        },
      });
    } catch (error) {
      console.error(`Database Error: ${error.message}`);
      return new NextResponse(`Database Error: ${error.message}`, { status: 500 });
    }
  } else {
    console.warn(`Unhandled event type: ${event.type}`);
    return new NextResponse(`Unhandled event type: ${event.type}`, { status: 200 });
  }

  return new NextResponse(null, { status: 200 });
}