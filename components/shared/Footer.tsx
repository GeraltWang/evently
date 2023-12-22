import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

const Footer = () => {
	return (
		<footer className=' border-t'>
			<div className=' flex-center wrapper flex-between flex gap-4 p-5 text-center flex-col sm:flex-row'>
				<Link href={'/'}>
					<Image src={'/assets/images/logo.svg'} width={128} height={38} alt='Evently logo' />
				</Link>
				<p>2024 Evently. All Rights reserved.</p>
			</div>
		</footer>
	)
}

export default Footer
