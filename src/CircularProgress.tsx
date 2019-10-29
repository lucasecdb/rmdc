import React from 'react'

const CircularProgress: React.FC = () => {
  return (
    <div className="mdc-circular-progress">
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

export default CircularProgress
