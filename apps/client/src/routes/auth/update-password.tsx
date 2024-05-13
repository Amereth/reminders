import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icon'
import { Check } from 'lucide-react'
import isStrongPassword from 'validator/es/lib/isStrongPassword'
import { supabaseClient } from '@/lib/supabase'
import { useState } from 'react'
import { Loader } from '@/components/Loader'
import { toast } from 'sonner'

const schema = z.object({
  password: z
    .string()
    .min(6)
    .max(24)
    .refine(isStrongPassword, 'should be strong password'),
})

type FormModel = z.infer<typeof schema>

const RouteComponent = () => {
  const [loading, setLoading] = useState(false)
  const form = useForm<FormModel>({ resolver: zodResolver(schema) })
  const navigate = useNavigate()

  const onSubmit = form.handleSubmit(async ({ password }) => {
    setLoading(true)
    const { error } = await supabaseClient.auth.updateUser({ password })

    if (error) {
      form.setError('password', { message: error.message })
      setLoading(false)
      return
    }

    toast.success('password updated')

    navigate({ to: '/' })
  })

  return (
    <Form {...form}>
      <div className='grid h-full place-content-center'>
        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='flex items-center gap-4'>
                      <Input {...field} />
                      <Button
                        type='submit'
                        size='icon'
                        variant='outline'
                        className='shrink-0'
                      >
                        <Icon icon={Check} />
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>enter new password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        )}
      </div>
    </Form>
  )
}

export const Route = createFileRoute('/auth/update-password')({
  component: RouteComponent,
})
