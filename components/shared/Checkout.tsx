import { IEvent } from '@/types'
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { loadStripe } from '@stripe/stripe-js'
import { checkoutOrder } from '@/lib/actions/order.actions'

interface Props {
	event: IEvent
	userId: string
}

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const Checkout = ({ event, userId }: Props) => {
	useEffect(() => {
		// Check to see if this is a redirect back from Checkout
		const query = new URLSearchParams(window.location.search)
		if (query.get('success')) {
			console.log('Order placed! You will receive an email confirmation.')
		}

		if (query.get('canceled')) {
			console.log('Order canceled -- continue to shop around and checkout when you’re ready.')
		}
	}, [])

	const onCheckout = async () => {
		console.log('checkout')
		const order = {
			eventTitle: event.title,
			eventId: event.id,
			price: event.price,
			isFree: event.isFree,
			buyerId: userId,
		}
		await checkoutOrder(order)
	}

	return (
		<form action={onCheckout} method='post'>
			<Button type='submit' role='link' size={'lg'} className=' button sm:w-fit'>
				{event.isFree ? 'Get Ticket' : 'Buy Ticket'}
			</Button>
		</form>
	)
}

export default Checkout