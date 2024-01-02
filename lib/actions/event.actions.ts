'use server'
import prisma from '@/prisma/client'
import { handleError } from '../utils'
import { CreateEventParams } from '@/types'

export const createEvent = async ({ event, userId, path }: CreateEventParams) => {
	try {
		const organizer = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		})
		if (!organizer) {
			throw new Error('Organizer not found')
		}

		const newEvent = await prisma.event.create({
			data: {
				title: event.title,
				imageUrl: event.imageUrl,
				startDateTime: event.startDateTime,
				endDateTime: event.endDateTime,
				description: event.description,
				price: event.price,
				isFree: event.isFree,
				url: event.url,
				location: event.location,
				category: {
					connect: {
						id: event.categoryId,
					},
				},
				organizer: {
					connect: {
						id: organizer.id,
					},
				},
			},
		})
		return newEvent
	} catch (error) {
		handleError(error)
	}
}
