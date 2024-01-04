import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createCategory, getAllCategories } from '@/lib/actions/category.actions'
import { Category } from '@prisma/client'
import { startTransition, useEffect, useState } from 'react'
import { Input } from '../ui/input'

interface Props {
	value?: string
	onChangeHandler?: () => void
}

const Dropdown = ({ value, onChangeHandler }: Props) => {
	const [categories, setCategories] = useState<Category[]>([])

	const [newCategory, setCategory] = useState('')

	const handleAddCategory = () => {
		createCategory({
			categoryName: newCategory.trim(),
		}).then(category => {
			if (!category) return
			setCategories(state => [...state, category])
		})
	}

	useEffect(() => {
		const getCategories = async () => {
			const categoryList = await getAllCategories()
			categoryList && setCategories(categoryList)
		}

		getCategories()
	}, [])

	return (
		<Select onValueChange={onChangeHandler} defaultValue={value}>
			<SelectTrigger className=' select-field'>
				<SelectValue placeholder='Category' />
			</SelectTrigger>
			<SelectContent>
				{categories.length !== 0 &&
					categories.map(category => (
						<SelectItem key={category.id} value={category.id!} className=' select-item p-regular-40'>
							{category.name}
						</SelectItem>
					))}
				<AlertDialog>
					<AlertDialogTrigger className=' p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500'>
						Add New Category
					</AlertDialogTrigger>
					<AlertDialogContent className=' bg-white'>
						<AlertDialogHeader>
							<AlertDialogTitle>New Category</AlertDialogTitle>
							<AlertDialogDescription>
								<Input
									type='text'
									placeholder='Category Name'
									className=' input-field mt-3'
									onChange={e => setCategory(e.target.value)}
								></Input>
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={() => startTransition(handleAddCategory)}>Continue</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</SelectContent>
		</Select>
	)
}

export default Dropdown
