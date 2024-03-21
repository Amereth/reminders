import { SupabaseContext } from '@/components/providers/SupabaseProvider'
import { useContext } from 'react'

export const useSupabase = () => useContext(SupabaseContext)
