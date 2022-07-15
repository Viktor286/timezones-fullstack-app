import React from 'react';

const TimezonesClockFilterInput = React.forwardRef(({ setFilterInput, resetFilter }, ref) => {
  return (
    <>
      <input
        id="clocks-filter"
        name="filter"
        type="text"
        placeholder="filter clocks..."
        onChange={(e) => setFilterInput(e.currentTarget.value)}
        ref={ref}
      />{' '}
      <button className="input-reset-filter" onClick={resetFilter}>
        reset
      </button>
    </>
  );
});

export default TimezonesClockFilterInput;
