'use client'
import { headerLinks } from '@/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NavItems = () => {
	const pathname = usePathname()

	return (
		<ul className=' md:flex-between md:flex-row flex flex-col items-start gap-5  w-full'>
			{headerLinks.map(link => {
				const isActive = pathname === link.route

				return (
					<li
						className={`${isActive && 'text-primary-500'} flex-center p-medium-16 whitespace-nowrap`}
						key={link.route}
					>
						<Link href={link.route}>{link.label}</Link>
					</li>
				)
			})}
		</ul>
	)
}

export default NavItems
