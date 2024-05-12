import { withSuspenseLoader } from '@/hoc/with-suspense'
import MultiSelect from '@/components/multi-select'
import { useEventLabelsQuery } from '@/hooks/api/events/labels'
import { map } from 'remeda'
import { useFormContext } from 'react-hook-form'
import { FormModel } from './event-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'

type LabelsSelectorProps = {
  className?: string
}

export const LabelsSelector = withSuspenseLoader(
  ({ className }: LabelsSelectorProps) => {
    const { data } = useEventLabelsQuery(
      map(({ id, label }) => ({ value: id.toString(), label })),
    )

    const { control } = useFormContext<FormModel>()

    return (
      <FormField
        control={control}
        name='labels'
        render={({ field }) => (
          <FormItem>
            <FormLabel>labels</FormLabel>
            <FormControl>
              <MultiSelect
                defaultOptions={data}
                className={className}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  },
)
