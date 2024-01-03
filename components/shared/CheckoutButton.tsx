'use client'
import { IEvent } from '@/types'
import { useUser } from '@clerk/nextjs'
import React from 'react'

interface Props {
	event: IEvent
}

const CheckoutButton = ({ event }: Props) => {
	const { user } = useUser()
	const userId = user?.publicMetadata.userId as string
	const hasEventFinished = new Date(event.endDateTime) < new Date()
	console.log(user)

	return <div>CheckoutButton</div>
}

export default CheckoutButton
