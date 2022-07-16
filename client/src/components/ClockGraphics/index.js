import './index.css';

export default function ClockGraphics({ h, m, s }) {
  let hRot = (h * 360) / 12 + (m * (360 / 60)) / 12;
  let mRot = (m * 360) / 60 + (s * (360 / 60)) / 60;
  let sRot = (s * 360) / 60;

  const theme = h > 20 || h < 6 ? 'dark-theme' : 'light-theme';

  return (
    <div className={`clock-graphics ${theme}`}>
      <div className="clock-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 600 600">
          <g className="face">
            <circle className="circle" cx="300" cy="300" r="253.9" />
            <path
              className="hour-marks"
              d="M300.5 94V61M506 300.5h32M300.5 506v33M94 300.5H60M411.3 107.8l7.9-13.8M493 190.2l13-7.4M492.1 411.4l16.5 9.5M411 492.3l8.9 15.3M189 492.3l-9.2 15.9M107.7 411L93 419.5M107.5 189.3l-17.1-9.9M188.1 108.2l-9-15.6"
            />
            <circle className="mid-circle" cx="300" cy="300" r="16.2" />
          </g>
          <g className="clock-component-hour" style={{ transform: `rotate(${hRot}deg)` }}>
            <path className="arm-hour" d="M300.5 298V142" />
            <circle fill="none" cx="300" cy="300" r="253.9" />
          </g>
          <g className="clock-component-minute" style={{ transform: `rotate(${mRot}deg)` }}>
            <path className="arm-minute" d="M300.5 298V67" />
            <circle fill="none" cx="300" cy="300" r="253.9" />
          </g>
          <g className="clock-component-second" style={{ transform: `rotate(${sRot}deg)` }}>
            <path className="arm-second" d="M300.5 350V55" />
            <circle fill="none" cx="300" cy="300" r="253.9" />
          </g>
        </svg>
      </div>
    </div>
  );
}
