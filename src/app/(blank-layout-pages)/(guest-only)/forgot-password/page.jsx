import ForgotPassword from '@views/ForgotPassword'
import { forgotPassword } from '@/app/server/actions/auth'
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
    title: 'Forgot Password',
    description: 'Forgotten Password to your account'
}

const ForgotPasswordPage = async () => {
    const mode = await getServerMode()

    return (
        <div className='flex flex-col justify-center items-center min-bs-[100dvh] p-6'>
            <ForgotPassword mode={mode} forgotPasswordAction={forgotPassword} />
        </div>
    )
}

export default ForgotPasswordPage
