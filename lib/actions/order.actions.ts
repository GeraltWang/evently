'use server'
import Stripe from 'stripe'
import prisma from '@/prisma/client'
import { handleError } from '../utils'
import { CheckoutOrderParams, CreateOrderParams, GetOrdersByEventParams, GetOrdersByUserParams } from '@/types'
import { redirect } from 'next/navigation'

export const createOrder = async (order: CreateOrderParams) => {
	try {
		const newOrder = await prisma.order.create({
			data: {
				stripeId: order.stripeId,
				totalAmount: order.totalAmount,
				createdAt: order.createdAt,
				event: {
					connect: {
						id: order.eventId,
					},
				},
				buyer: {
					connect: {
						id: order.buyerId,
					},
				},
			},
		})
		return newOrder
	} catch (error) {
		handleError(error)
	}
}

export const checkoutOrder = async (order: CheckoutOrderParams) => {
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

	const price = order.isFree ? 0 : Number(order.price) * 100
	try {
		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					price_data: {
						currency: 'usd',
						unit_amount: price,
						product_data: {
							name: order.eventTitle,
						},
					},
					quantity: 1,
				},
			],
			metadata: {
				eventId: order.eventId,
				buyerId: order.buyerId,
			},
			mode: 'payment',
			success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
			cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
		})
		redirect(session.url!)
	} catch (error) {
		throw error
	}
}

export const getOrdersByEvent = async ({ searchString, eventId }: GetOrdersByEventParams) => {}

export const getOrdersByUser = async ({ userId, limit = 6, page = 1 }: GetOrdersByUserParams) => {
	try {
		const skip = (Number(page) - 1) * limit

		const orders = await prisma.order.findMany({
			distinct: ['eventId'],
			skip,
			take: limit,
			where: {
				buyerId: userId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				event: {
					select: {
						id: true,
						title: true,
						description: true,
						location: true,
						imageUrl: true,
						createdAt: true,
						startDateTime: true,
						endDateTime: true,
						price: true,
						isFree: true,
						url: true,
						category: {
							select: {
								id: true,
								name: true,
							},
						},
						categoryId: true,
						organizer: {
							select: {
								id: true,
								firstName: true,
								lastName: true,
							},
						},
						organizerId: true,
					},
				},
			},
		})

		const totalOrders = await prisma.order.findMany({
			where: {
				buyerId: userId,
			},
		})

		const uniqueEventIdsLength = Array.from(new Set(totalOrders.map(order => order.eventId))).length

		// 计算总页数
		const totalPages = Math.ceil(uniqueEventIdsLength / limit)

		return {
			data: orders,
			totalPages,
		}
	} catch (error) {
		handleError(error)
	}
}
