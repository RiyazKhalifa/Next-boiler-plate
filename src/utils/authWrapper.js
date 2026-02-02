import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'

export async function withAuthCheck(action) {
    try {
        const result = await action()
        if (result?.sessionExpired) {
            toast.error('Your session has expired. Please login again.')
            setTimeout(() => {
                signOut({ redirect: true, callbackUrl: '/login' })
            }, 2000)
            return null
        }
        return result
    } catch (error) {
        console.error('Action failed:', error)
        throw error
    }
}
