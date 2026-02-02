import ResetPassword from '@views/ResetPassword'
import { resetPassword } from '@/app/server/actions/auth'
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
    title: 'Reset Password',
    description: 'Reset your account password'
}

const ResetPasswordPage = async () => {
    const mode = await getServerMode()

    return (
        <div className='flex flex-col justify-center items-center min-bs-[100dvh] p-6'>
            <ResetPassword mode={mode} resetPasswordAction={resetPassword} />
        </div>
    )
}

export default ResetPasswordPage
