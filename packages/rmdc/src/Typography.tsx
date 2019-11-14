import classNames from 'classnames'
import React from 'react'

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
  className?: string
  tag?: keyof React.ReactHTML
}

interface EnhancedProps {
  tag: keyof React.ReactHTML
  classSuffix: string
}

const typography = (options: EnhancedProps) => {
  const { tag: defaultTag, classSuffix } = options

  const Typography: React.FC<TypographyProps> = ({
    children,
    className = '',
    tag: Tag = defaultTag,
    ...otherProps
  }) => {
    const classes = classNames(
      'mdc-typography',
      `mdc-typography--${classSuffix}`,
      className
    )

    return (
      <Tag className={classes} {...otherProps}>
        {children}
      </Tag>
    )
  }

  return Typography
}

export const Body1 = typography({
  classSuffix: 'body1',
  tag: 'p',
})

export const Body2 = typography({
  classSuffix: 'body2',
  tag: 'p',
})

// This need to be `ButtonSpan` because
// we already have an export named "Button",
// which is the actual button component
export const ButtonSpan = typography({
  classSuffix: 'button',
  tag: 'span',
})

export const Caption = typography({
  classSuffix: 'caption',
  tag: 'span',
})

export const Headline1 = typography({
  classSuffix: 'headline1',
  tag: 'h1',
})

export const Headline2 = typography({
  classSuffix: 'headline2',
  tag: 'h2',
})

export const Headline3 = typography({
  classSuffix: 'headline3',
  tag: 'h3',
})

export const Headline4 = typography({
  classSuffix: 'headline4',
  tag: 'h4',
})

export const Headline5 = typography({
  classSuffix: 'headline5',
  tag: 'h5',
})

export const Headline6 = typography({
  classSuffix: 'headline6',
  tag: 'h6',
})

export const Overline = typography({
  classSuffix: 'overline',
  tag: 'span',
})

export const Subtitle1 = typography({
  classSuffix: 'subtitle1',
  tag: 'h6',
})

export const Subtitle2 = typography({
  classSuffix: 'subtitle2',
  tag: 'h6',
})

const Typography = {
  Body1,
  Body2,
  Button: ButtonSpan,
  Caption,
  Headline1,
  Headline2,
  Headline3,
  Headline4,
  Headline5,
  Headline6,
  Overline,
  Subtitle1,
  Subtitle2,
}

export { Typography as t }
