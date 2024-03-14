import { SupabaseContext } from '@/lib/providers/SupabaseProvider'
import { useContext } from 'react'

export const useSupabase = () => useContext(SupabaseContext)
