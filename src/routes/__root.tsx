import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { UserButton } from '@clerk/clerk-react'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <header className="sticky top-0 z-10 bg-light dark:bg-dark p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
        Memorypie Share
        <UserButton />
      </header>
      <Outlet />
    </React.Fragment>
  )
}
