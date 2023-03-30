import { Form } from '@remix-run/react'
import React from 'react'

type Props = {
  children: React.ReactNode
  heading: string
  subheading: string
}

const AuthForm: React.FC<Props> = ({ children, heading, subheading}) => {
  return (
    <Form
      replace
      method="post"
      className="mx-auto flex w-80 flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold"> 
          {heading}
        </h1>
        <p className="text-sm text-mauveDark-11">
          {subheading}
        </p>
      </div>
      {children}
    </Form>
  )
}

export default AuthForm
