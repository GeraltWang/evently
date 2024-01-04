'use client'
import { Button } from '@/components/ui/button'
import { IEvent } from '@/types'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Checkout from './Checkout'

interface Props {
	event: IEvent
}

const CheckoutButton = ({ event }: Props) => {
	const { user } = useUser()
	const userId = user?.publicMetadata.userId as string
	const hasEventFinished = new Date(event.endDateTime) < new Date()

	return (
		<div className=' flex items-center gap-3'>
			{/* cannot buy past event */}
			{hasEventFinished ? (
				<p className=' p-2 text-red-400'>Sorry, tickets are no longer available.</p>
			) : (
				<>
					<SignedOut>
						<Button asChild className='button rounded-full' size={'lg'}>
							<Link href={'/sign-in'}>Get Tickets</Link>
						</Button>
					</SignedOut>

					<SignedIn>
						<Checkout event={event} userId={userId} />
					</SignedIn>
				</>
			)}
		</div>
	)
}

export default CheckoutButton
