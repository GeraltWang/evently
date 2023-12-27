'use server'
import prisma from '@/prisma/client'
import { handleError } from '../utils'
import { CreateCategoryParams } from '@/types'

export const createCategory = async ({ categoryName }: CreateCategoryParams) => {
	try {
		const category = await prisma.category.findUnique({
			where: {
				name: categoryName,
			},
		})

		if (category) {
			throw new Error(`Category <${categoryName}> already exists`)
		}

		const newCategory = await prisma.category.create({
			data: {
				name: categoryName,
			},
		})

		return newCategory
	} catch (error) {
		handleError(error)
	}
}

export const getAllCategories = async () => {
	try {
		const categories = await prisma.category.findMany()
		return categories
	} catch (error) {
		handleError(error)
	}
}
