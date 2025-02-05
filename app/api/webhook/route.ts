import Stripe from 'stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { stripe } from '@/lib/stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature')
  let event: Stripe.Event

  try {
    if (!signature || !webhookSecret) {
      console.error('Missing signature or webhook secret')
      return new NextResponse('Missing signature or webhook secret', { status: 400 })
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    console.log(`Webhook event received: ${event.type}`)
    
  } catch (error) {
    console.error(`Webhook Error: ${error.message}`)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const userId = session?.metadata?.userId
  const courseId = session?.metadata?.courseId

  if (event.type === 'checkout.session.completed') {
    if (!userId || !courseId) {
      console.error('Missing metadata:', { userId, courseId })
      return new NextResponse('Missing metadata', { status: 400 })
    }

    try {
      // Check if purchase already exists
      const existingPurchase = await db.purchase.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        }
      })

      if (existingPurchase) {
        console.log('Purchase already exists:', existingPurchase)
        return new NextResponse(null, { status: 200 })
      }

      // Create new purchase
      const purchase = await db.purchase.create({
        data: {
          courseId: courseId,
          userId: userId
        }
      })

      console.log('Purchase created successfully:', purchase)

      return new NextResponse(null, { status: 200 })
    } catch (error) {
      console.error('Database Error:', error)
      return new NextResponse(`Database Error: ${error.message}`, { status: 500 })
    }
  }

  // Log unhandled events
  console.log(`Unhandled event type: ${event.type}`)
  return new NextResponse(null, { status: 200 })
}