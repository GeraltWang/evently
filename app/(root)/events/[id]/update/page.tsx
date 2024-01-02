import EventForm from '@/components/shared/EventForm'
import { getEventById } from '@/lib/actions/event.actions'
import { UpdateEventParams, UserMeta } from '@/types'
import { auth } from '@clerk/nextjs'
import React from 'react'

interface Props {
	params: {
		id: string
	}
}

const UpdateEvent = async ({ params: { id } }: Props) => {
	const { sessionClaims } = auth()

	const userMeta = sessionClaims?.userMeta as UserMeta

	const userId = userMeta.userId || ''

	const event = await getEventById(id)

	return (
		<>
			<section className=' bg-primary-50 bfg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
				<h3 className='wrapper h3-bold text-center sm:text-left'>Update Event</h3>
			</section>
			<div className=' wrapper my-8'>
				<EventForm userId={userId} event={event} eventId={event?.id} type='Update' />
			</div>
		</>
	)
}

export default UpdateEvent
