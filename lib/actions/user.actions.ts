'use server'
import prisma from '@/prisma/client'
import { handleError } from '../utils'
import { CreateUserParams, UpdateUserParams } from '@/types'

export async function createUser(user: CreateUserParams) {
	try {
		const newUser = await prisma.user.create({
			data: user,
		})
		return newUser
	} catch (error) {
		handleError(error)
	}
}

export async function updateUser(id: string, user: UpdateUserParams) {
	try {
		const hasUser = await prisma.user.findUnique({
			where: {
				clerkId: id,
			},
		})
		if (!hasUser) {
			throw new Error('User not found')
		}

		const updatedUser = await prisma.user.update({
			where: {
				clerkId: id,
			},
			data: user,
		})
		return updatedUser
	} catch (error) {
		handleError(error)
	}
}

export async function deleteUser(id: string) {
	try {
		const hasUser = await prisma.user.findUnique({
			where: {
				clerkId: id,
			},
		})
		if (!hasUser) {
			throw new Error('User not found')
		}

		const deletedUser = await prisma.user.delete({
			where: {
				clerkId: id,
			},
		})
		return deletedUser
	} catch (error) {
		handleError(error)
	}
}
