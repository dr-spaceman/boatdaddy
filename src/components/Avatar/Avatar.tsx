import React from 'react'

import {
  OverloadedElement,
  OverloadedElementProps,
} from 'interfaces/OverloadedElement'
import { Color } from 'interfaces/theme'
import Tooltip from 'components/Tooltip'
import classes from './Avatar.module.scss'

export type AvatarProps = {
  alt: string
  children?: React.ReactNode
  className?: string
  color?: Color
  size?: number
  src?: string
  tooltip?: string | boolean
} & OverloadedElementProps

const TooltipWrapper = ({ tooltipLabel, children }) =>
  tooltipLabel ? <Tooltip label={tooltipLabel}>{children}</Tooltip> : children

const Avatar: OverloadedElement<AvatarProps> = React.forwardRef<
  HTMLDivElement,
  AvatarProps
>((props, ref) => {
  const {
    alt,
    children,
    className,
    color = 'default',
    as: Component = 'div',
    size = 40,
    src,
    tooltip,
    ...rest
  } = props

  const classNames = [
    classes.avatar,
    'variant--contained', // Access global colors
    `color--${color}`,
    'no-hover',
    className && className,
  ]

  let tooltipLabel: string
  if (!!tooltip) {
    if (tooltip === true && alt) {
      tooltipLabel = alt
    } else if (typeof tooltip === 'string') {
      tooltipLabel = tooltip as string
    }
  }

  const finalProps = {
    className: classNames.join(' '),
    style: { '--size': `${size}px` } as React.CSSProperties,
    ref,
    role: 'img',
    'aria-label': alt !== children ? alt : undefined,
    ...rest,
  }

  return (
    <TooltipWrapper tooltipLabel={tooltipLabel}>
      <Component {...finalProps}>
        {src ? <img src={src} alt={alt} /> : children}
      </Component>
    </TooltipWrapper>
  )
})

export type AvatarGroupProps = {
  max?: number
  total?: number
  children: React.ReactNode
}

export const AvatarGroup = ({
  max,
  total,
  children: allChildren,
}: AvatarGroupProps) => {
  const children = React.Children.toArray(allChildren)
  const numChildren = children.length

  if (numChildren > max || numChildren < total) {
    const excess = max ? numChildren - max : total - numChildren
    const mapToIndex = max ?? numChildren
    const childrenOutput = children
      .map((child, i) => {
        if (i < mapToIndex) {
          return child
        } else {
          return null
        }
      })
      .filter(child => !!child)
      .reverse()
    childrenOutput.unshift(
      <Avatar
        alt={`There are ${excess} hidden avatars`}
        className={classes.excess}
        key="excess"
      >{`+${excess}`}</Avatar>
    )

    const classNames = [classes.group, classes.groupMax]

    return <div className={classNames.join(' ')}>{childrenOutput}</div>
  }

  return <div className={classes.group}>{children.reverse()}</div>
}

export default Avatar