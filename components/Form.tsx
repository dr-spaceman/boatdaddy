import {
  useState,
  createElement,
  forwardRef,
  cloneElement,
  SyntheticEvent,
} from 'react'

import classes from '@/styles/components/form.module.scss'

export type Form = {
  children: React.ReactElement
  className?: string
} & React.ComponentPropsWithoutRef<'form'>

export function Form({ children, className = null, ...rest }) {
  const classNameString = [classes.form, className].filter(i => !!i).join(' ')

  return (
    <form className={classNameString} {...rest}>
      {children}
    </form>
  )
}

export type FormGroupProps = {
  label: string
  input: React.ReactElement
  className?: string
} & React.ComponentPropsWithoutRef<'div'>

export function FormGroup({ label, input, className = null }: FormGroupProps) {
  const classNameString = [classes.formGroup, className]
    .filter(i => !!i)
    .join(' ')
  const id = `form__${label}`

  return (
    <div className={classNameString}>
      <label htmlFor={id}>{label}</label>
      {cloneElement(input, { id })}
    </div>
  )
}

function format(text) {
  return text != null ? text : ''
}

function unformat(text: string) {
  return text.trim().length === 0 ? null : text
}

export type TextInputProps = {
  type?: string
  tag?: 'input' | 'textarea'
  name?: string
  value?: string
  onChange?: (event: any, text: string) => void
} & Omit<JSX.IntrinsicElements['input'], 'onChange'> // Necessary because of some strange error

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => {
    const {
      type = 'text',
      tag = 'input',
      name,
      value,
      onChange = null,
      ...fieldProps
    } = props
    const [textValue, setTextValue] = useState<string | null>(format(value))

    const handleBlur = (event: SyntheticEvent) => {
      if (onChange) {
        onChange(event, unformat(textValue))
      }
    }

    const handleChange = (event: SyntheticEvent) => {
      const { value } = event.target as HTMLInputElement
      setTextValue(value)
    }

    if (tag === 'input') {
      return (
        <input
          type={type}
          {...fieldProps}
          name={name}
          value={textValue}
          onBlur={handleBlur}
          onChange={handleChange}
          ref={ref}
          className="input"
        />
      )
    }

    // if (tag === 'textarea') {
    //   return (
    //     <textarea
    //       {...fieldProps}
    //       name={name}
    //       onBlur={handleBlur}
    //       onChange={handleChange}
    //       rows={4}
    //     >
    //       {textValue}
    //     </textarea>
    //   )
    // }

    // // What other tag types...?
    // return createElement(tag, {
    //   ...fieldProps,
    //   value: textValue,
    //   onBlur: handleBlur,
    //   onChange: handleChange,
    // })
  }
)
