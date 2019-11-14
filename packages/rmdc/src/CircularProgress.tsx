import classNames from 'classnames'
import React from 'react'

interface Props {
  className?: string
  size?: number
}

export const CircularProgress: React.FC<Props> = ({ size, className }) => {
  return (
    <div
      className={classNames(className, 'mdc-circular-progress')}
      style={{ ['--size' as any]: `${size}px` }}
    >
      <div className="mdc-circular-progress__container">
        <div className="mdc-circular-progress__layer">
          <div className="mdc-circular-progress__circle-clipper mdc-circular-progress__spinner-left">
            <div className="mdc-circular-progress__spinner-circle"></div>
          </div>
          <div className="mdc-circular-progress__gap-patch">
            <div className="mdc-circular-progress__spinner-circle"></div>
          </div>
          <div className="mdc-circular-progress__circle-clipper mdc-circular-progress__spinner-right">
            <div className="mdc-circular-progress__spinner-circle"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
