'use server'
import prisma from '@/prisma/client'
import { revalidatePath } from 'next/cache'
import { handleError } from '../utils'
import {
	CreateEventParams,
	DeleteEventParams,
	GetAllEventsParams,
	GetEventsByUserParams,
	GetRelatedEventsByCategoryParams,
	UpdateEventParams,
} from '@/types'

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
		revalidatePath(path)
		return newEvent
	} catch (error) {
		handleError(error)
	}
}

export const deleteEvent = async ({ eventId, path }: DeleteEventParams) => {
	try {
		const event = await prisma.event.findUnique({
			where: {
				id: eventId,
			},
		})
		if (!event) {
			throw new Error('Event not found')
		}
		await prisma.event.delete({
			where: {
				id: event.id,
			},
		})
		revalidatePath(path)
	} catch (error) {
		handleError(error)
	}
}

export const updateEvent = async ({ userId, event, path }: UpdateEventParams) => {
	try {
		const eventToUpdate = await prisma.event.findUnique({
			where: {
				id: event.id,
			},
		})
		if (!eventToUpdate) {
			throw new Error('Event not found')
		}
		if (eventToUpdate.organizerId !== userId) {
			throw new Error('You are not authorized to update this event')
		}
		const updatedEvent = await prisma.event.update({
			where: {
				id: event.id,
			},
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
			},
		})
		revalidatePath(path)
		return updatedEvent
	} catch (error) {
		handleError(error)
	}
}

export const getEventById = async (eventId: string) => {
	try {
		const event = await prisma.event.findUnique({
			where: {
				id: eventId,
			},
			include: {
				category: {
					select: {
						id: true,
						name: true,
					},
				},
				organizer: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
					},
				},
			},
		})
		if (!event) {
			throw new Error(`Event ${eventId} not found`)
		}
		return event
	} catch (error) {
		handleError(error)
	}
}

export const getAllEvents = async ({ query, limit = 6, page, category }: GetAllEventsParams) => {
	try {
		const skip = (page - 1) * limit

		// 获取事件总数
		const totalEvents = await prisma.event.count()

		// 计算总页数
		const totalPages = Math.ceil(totalEvents / limit)

		const events = await prisma.event.findMany({
			skip,
			take: limit,
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				category: {
					select: {
						id: true,
						name: true,
					},
				},
				organizer: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
					},
				},
			},
		})
		return {
			data: events,
			totalPages,
		}
	} catch (error) {
		handleError(error)
	}
}

export const getEventsByUser = async ({ userId, limit = 6, page }: GetEventsByUserParams) => {
	try {
		const skip = (Number(page) - 1) * limit

		// 获取事件总数
		const totalEvents = await prisma.event.count({
			where: {
				organizerId: userId,
			},
		})

		// 计算总页数
		const totalPages = Math.ceil(totalEvents / limit)

		const events = await prisma.event.findMany({
			skip,
			take: limit,
			where: {
				organizerId: userId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				category: {
					select: {
						id: true,
						name: true,
					},
				},
				organizer: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
					},
				},
			},
		})
		return {
			data: events,
			totalPages,
		}
	} catch (error) {
		handleError(error)
	}
}

export const getRelatedEventsByCategory = async ({
	categoryId,
	eventId,
	limit = 3,
	page = 1,
}: GetRelatedEventsByCategoryParams) => {
	try {
		const skip = (Number(page) - 1) * limit

		// 获取符合条件的事件总数
		const totalEvents = await prisma.event.count({
			where: {
				categoryId,
				id: {
					not: eventId,
				},
			},
		})

		// 计算总页数
		const totalPages = Math.ceil(totalEvents / limit)

		const events = await prisma.event.findMany({
			skip,
			take: limit,
			orderBy: {
				createdAt: 'desc',
			},
			where: {
				categoryId,
				id: {
					not: eventId,
				},
			},
			include: {
				category: {
					select: {
						id: true,
						name: true,
					},
				},
				organizer: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
					},
				},
			},
		})

		return {
			data: events,
			totalPages,
		}
	} catch (error) {
		handleError(error)
	}
}
