'use client'

import { useEffect } from 'react'
import { Grid, Button, Typography } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, nonEmpty, pipe } from 'valibot'
import CustomTextField from '@core/components/mui/TextField'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { withAuthCheck } from '@/utils/authWrapper'

const AddFaqForm = ({ open, handleClose, addFaq, editedFaq, updateFaq, refreshFaqs, setLoading }) => {
    const { t } = useTranslation()
    const addFaqSchema = object({
        question: pipe(string(), nonEmpty(t('validation.question_is_required'))),
        question_ar: pipe(string(), nonEmpty(t('validation.arabic_question_is_required'))),
        answer: pipe(string(), nonEmpty(t('validation.answer_is_required'))),
        answer_ar: pipe(string(), nonEmpty(t('validation.arabic_answer_is_required')))
    })

    const { control, handleSubmit, reset, setValue, formState } = useForm({
        defaultValues: { question: '', question_ar: '', answer: '', answer_ar: '' },
        resolver: valibotResolver(addFaqSchema)
    })
    const { isSubmitting, errors } = formState

    useEffect(() => {
        if (editedFaq) {
            setValue('question', editedFaq.question || '')
            setValue('question_ar', editedFaq.question_ar || '')
            setValue('answer', editedFaq.answer || '')
            setValue('answer_ar', editedFaq.answer_ar || '')
        } else {
            reset({ question: '', question_ar: '', answer: '', answer_ar: '' })
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [editedFaq, setValue, reset])

    const onSubmit = async data => {
        setLoading(true)
        try {
            const payload = {
                question: data.question,
                question_ar: data.question_ar,
                answer: data.answer,
                answer_ar: data.answer_ar
            }
            const res = editedFaq
                ? await withAuthCheck(() => updateFaq(editedFaq.id, payload))
                : await withAuthCheck(() => addFaq(payload))
            if (!res) return
            if (!res?.status) {
                toast.error(res?.message)
                return
            }

            toast.success(res?.message)
            refreshFaqs()
            setTimeout(() => {
                handleClose()
                reset()
            }, 1200)
        } catch (err) {
            toast.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        handleClose()
        reset()
    }

    return (
        <div style={{ display: open ? 'block' : 'none' }} className='p-6 border rounded-md mb-6 bg-white shadow-md'>
            <div className='border-b pb-4 mb-6'>
                <Typography variant='h4'>
                    {editedFaq ? t('edit_faq') : t('add_faq')}
                </Typography>
                <Typography>{t('manage_faq_information')}</Typography>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name='question'
                            control={control}
                            render={({ field }) => (
                                <CustomTextField
                                    {...field}
                                    fullWidth
                                    label={t('question')}
                                    placeholder={t('question')}
                                    error={!!errors.question}
                                    helperText={errors.question?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name='question_ar'
                            control={control}
                            render={({ field }) => (
                                <CustomTextField
                                    {...field}
                                    fullWidth
                                    label={t('arabic_question')}
                                    placeholder={t('arabic_question')}
                                    error={!!errors.question_ar}
                                    helperText={errors.question_ar?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name='answer'
                            control={control}
                            render={({ field }) => (
                                <CustomTextField
                                    {...field}
                                    fullWidth
                                    rows={3}
                                    multiline
                                    label={t('answer')}
                                    placeholder={t('answer')}
                                    error={!!errors.answer}
                                    helperText={errors.answer?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name='answer_ar'
                            control={control}
                            render={({ field }) => (
                                <CustomTextField
                                    {...field}
                                    fullWidth
                                    rows={3}
                                    multiline
                                    label={t('arabic_answer')}
                                    placeholder={t('arabic_answer')}
                                    error={!!errors.answer_ar}
                                    helperText={errors.answer_ar?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <div className='flex items-center flex-row-reverse gap-4 mt-4 border-t pt-4'>
                            <Button variant='contained' type='submit' disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <div className='flex items-center gap-2'>
                                        <i className='tabler-loader animate-spin' />
                                        <span>{t('submitting')}</span>
                                    </div>
                                ) : t('submit')}
                            </Button>
                            <Button variant='tonal' color='error' type='button' onClick={handleReset}>
                                {t('cancel')}
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
}

export default AddFaqForm
