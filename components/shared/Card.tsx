import { formatDateTime } from '@/lib/utils'
import { IEvent, UserMeta } from '@/types'
import { auth } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import DeleteConfirmation from './DeleteConfirmation'

interface Props {
	event: IEvent
	hasOrderLink?: boolean
	hidePrice?: boolean
}

const Card = ({ event, hasOrderLink, hidePrice }: Props) => {
	const { sessionClaims } = auth()

	const userMeta = (sessionClaims?.userMeta as UserMeta) || {}

	const userId = userMeta?.userId || ''

	const isEventCreator = userId === event.organizerId

	return (
		<div className=' group relative flex min-h-[380px] md:min-h-[438px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg'>
			<Link
				href={`/events/${event.id}`}
				style={{
					backgroundImage: `url(${event.imageUrl})`,
				}}
				className=' flex-center flex-grow bg-gray-50 bg-cover bg-center text-gray-500'
			></Link>
			{isEventCreator && !hidePrice && (
				<div className=' absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all'>
					<Link href={`/events/${event.id}/update`}>
						<Image src={'/assets/icons/edit.svg'} alt='edit' width={20} height={20}></Image>
					</Link>
					<DeleteConfirmation eventId={event.id} />
				</div>
			)}
			<div className=' flex min-h-[230px] flex-col gap-3 p-5 md:gap-4'>
				{!hidePrice && (
					<div className=' flex gap-2'>
						<span className=' p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-60'>
							{event.isFree ? 'FREE' : `$${event.price}`}
						</span>
						<p className=' p-semibold-14 w-min rounded-full bg-gray-500/10 px-4 py-1 text-gray-500 line-clamp-1'>
							{event.category.name}
						</p>
					</div>
				)}
				<p className=' p-medium-16 p-medium-18 text-gray-500'>{formatDateTime(event.startDateTime).dateTime}</p>
				<Link href={`/events/${event.id}`}>
					<p className=' p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black'>{event.title}</p>
				</Link>
				<div className=' flex-between w-full'>
					<p className=' p-medium-14 md:p-medium-16 text-gray-600'>
						{event.organizer.firstName} {event.organizer.lastName}
					</p>
					{hasOrderLink && (
						<Link className=' flex gap-2' href={`/orders?eventId=${event.id}`}>
							<p className=' text-primary-500'>Order Details</p>
							<Image src={'/assets/icons/arrow.svg'} alt='search' width={10} height={10}></Image>
						</Link>
					)}
				</div>
			</div>
		</div>
	)
}

export default Card
