'use client'

import { useEffect } from 'react'
import { Grid, Button, Typography, Divider } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, nonEmpty, pipe } from 'valibot'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { withAuthCheck } from '@/utils/authWrapper'
import CustomTextField from '@core/components/mui/TextField'
import CustomIconButton from '@core/components/mui/IconButton'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'

const EditorToolbar = ({ editor }) => {
    if (!editor) return null

    return (
        <div className='flex flex-wrap gap-x-3 gap-y-1 mb-2'>
            <CustomIconButton
                {...(editor.isActive('bold') && { color: 'primary' })}
                variant='outlined'
                size='small'
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <i className='tabler-bold' />
            </CustomIconButton>
            <CustomIconButton
                {...(editor.isActive('underline') && { color: 'primary' })}
                variant='outlined'
                size='small'
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
                <i className='tabler-underline' />
            </CustomIconButton>
            <CustomIconButton
                {...(editor.isActive('italic') && { color: 'primary' })}
                variant='outlined'
                size='small'
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <i className='tabler-italic' />
            </CustomIconButton>
            <CustomIconButton
                {...(editor.isActive('strike') && { color: 'primary' })}
                variant='outlined'
                size='small'
                onClick={() => editor.chain().focus().toggleStrike().run()}
            >
                <i className='tabler-strikethrough' />
            </CustomIconButton>

            {['left', 'center', 'right', 'justify'].map(align => (
                <CustomIconButton
                    key={align}
                    {...(editor.isActive({ textAlign: align }) && { color: 'primary' })}
                    variant='outlined'
                    size='small'
                    onClick={() => editor.chain().focus().setTextAlign(align).run()}
                >
                    <i className={`tabler-align-${align === 'justify' ? 'justified' : align}`} />
                </CustomIconButton>
            ))}
        </div>
    )
}

const EditCmsForm = ({ open, fetchCms, updateCms, editedCms, handleClose, setLoading }) => {
    const { t } = useTranslation()

    const cmsSchema = object({
        title: pipe(string(), nonEmpty(t('validation.title_is_required'))),
        title_ar: pipe(string(), nonEmpty(t('validation.title_ar_required'))),
        content: pipe(string(), nonEmpty(t('validation.content_is_required'))),
        content_ar: pipe(string(), nonEmpty(t('validation.content_arabic_is_required')))
    })

    const { control, handleSubmit, reset, formState, setValue } = useForm({
        defaultValues: {
            title: '',
            title_ar: '',
            content: '',
            content_ar: ''
        },
        resolver: valibotResolver(cmsSchema)
    })

    const { errors, isSubmitting } = formState

    const editorEn = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: t('enter_content_en') }),
            TextAlign.configure({ types: ['heading', 'paragraph'] })
        ],
        content: '',
        onUpdate: ({ editor }) => setValue('content', editor.getHTML()),
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'min-h-[200px] overflow-y-auto text-gray-700 focus:outline-none'
            }
        }
    })

    const editorAr = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: t('enter_content_ar') }),
            TextAlign.configure({ types: ['heading', 'paragraph'] })
        ],
        content: '',
        onUpdate: ({ editor }) => setValue('content_ar', editor.getHTML()),
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'min-h-[200px] overflow-y-auto focus:outline-none',
                dir: 'rtl'
            }
        }
    })

    useEffect(() => {
        if (editedCms) {
            reset({
                title: editedCms.title || '',
                title_ar: editedCms.title_ar || '',
                content: editedCms.content || '',
                content_ar: editedCms.content_ar || ''
            })

            if (editorEn) editorEn.commands.setContent(editedCms.content || '')
            if (editorAr) editorAr.commands.setContent(editedCms.content_ar || '')
        }
    }, [editedCms, reset, editorEn, editorAr])

    const onSubmit = async data => {
        setLoading(true)
        try {
            const res = await withAuthCheck(() => updateCms(editedCms.id, data))
            if (!res) return
            if (!res?.status) {
                toast.error(t(res?.message) || t('validation.failed_to_update_cms'))
                return
            }

            toast.success(t(res?.message) || t('messages.cms_updated_successfully'))
            setTimeout(() => {
                handleClose()
                reset()
            }, 2000)
        } catch (err) {
            console.error('Error updating CMS:', err)
            toast.error(t(err?.response?.data?.message) || t('validation.something_went_wrong'))
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        handleClose()
        reset()
    }

    if (!editedCms) return <Typography>{t('cms_not_found')}</Typography>

    return (
        <div className='p-6 bg-white shadow-md rounded-md mb-6'>
            <div className='border-b pb-4 mb-6'>
                <Typography variant='h4'>
                    {t('edit_cms')}
                </Typography>
                <Typography>{t('manage_cms_information')}</Typography>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <Controller
                            name='title'
                            control={control}
                            render={({ field }) => (
                                <CustomTextField
                                    {...field}
                                    fullWidth
                                    label={t('title_en')}
                                    placeholder={t('enter_title_en')}
                                    error={!!errors.title}
                                    helperText={errors.title?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <Controller
                            name='title_ar'
                            control={control}
                            render={({ field }) => (
                                <CustomTextField
                                    {...field}
                                    fullWidth
                                    label={t('title_ar')}
                                    placeholder={t('enter_title_ar')}
                                    error={!!errors.title_ar}
                                    helperText={errors.title_ar?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <div className='border rounded-md p-3'>
                            <Typography variant='subtitle2' className='mb-1 text-gray-500 font-medium'>
                                {t('content_en')}
                            </Typography>

                            <EditorToolbar editor={editorEn} />
                            <Divider className='my-2' />

                            <EditorContent editor={editorEn} />

                            {errors.content && (
                                <Typography color='error' variant='caption'>
                                    {errors.content.message}
                                </Typography>
                            )}
                        </div>
                    </Grid>

                    <Grid item xs={12}>
                        <div className='border rounded-md p-3'>
                            <Typography variant='subtitle2' className='mb-1 text-gray-500 font-medium'>
                                {t('content_ar')}
                            </Typography>
                            <EditorToolbar editor={editorAr} />
                            <Divider className='my-2' />
                            <EditorContent editor={editorAr} />
                            {errors.content_ar && (
                                <Typography color='error' variant='caption'>
                                    {errors.content_ar.message}
                                </Typography>
                            )}
                        </div>
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

export default EditCmsForm
