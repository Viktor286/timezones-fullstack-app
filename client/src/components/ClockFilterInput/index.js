import React from 'react';

const ClockFilterInput = React.forwardRef(({ setFilterInput, resetFilter }, ref) => {
  return (
    <>
      <input
        id="clocks-filter"
        name="filter"
        type="text"
        placeholder="filter clocks..."
        autoComplete="off"
        onChange={(e) => setFilterInput(e.currentTarget.value)}
        ref={ref}
      />{' '}
      <button className="input-reset-filter" onClick={resetFilter}>
        reset
      </button>
    </>
  );
});

export default ClockFilterInput;
