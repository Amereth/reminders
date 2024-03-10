import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
} from '@clerk/clerk-react'

export const PageHeader = () => {
  return (
    <header className='flex items-center py-2 shadow-md shadow-slate-400 md:py-4'>
      <SignedOut>
        <SignInButton />
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  )
}
