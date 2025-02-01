import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (purchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
            description: course.description,
          },
          unit_amount: Math.round(course.price * 100),
        },
      },
    ];

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (stripeCustomer) {
      
      try {
        await stripe.customers.retrieve(stripeCustomer.stripeCustomerId);
      } catch (error) {
        if (error instanceof Stripe.errors.StripeInvalidRequestError && error.message.includes("No such customer")) {
          stripeCustomer = null;
        } else {
          throw error;
        }
      }
    }

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });

      try {
        stripeCustomer = await db.stripeCustomer.upsert({
          where: {
            userId: user.id,
          },
          update: {
            stripeCustomerId: customer.id,
          },
          create: {
            userId: user.id,
            stripeCustomerId: customer.id,
          },
        });
      } catch (error) {
        console.error("Error creating stripeCustomer in database:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
      metadata: {
        courseId: course.id,
        userId: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("COURSE_ID_CHECKOUT", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}