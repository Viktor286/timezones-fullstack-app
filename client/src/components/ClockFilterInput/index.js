import React from 'react';
import './index.css';

const ClockFilterInput = React.forwardRef(({ setFilterInput, resetFilter, filterInput }, ref) => {
  return (
    <div className="clocks-filter-wrapper">
      <input
        id="clocks-filter"
        name="filter"
        type="text"
        placeholder="filter clocks..."
        autoComplete="off"
        onChange={(e) => setFilterInput(e.currentTarget.value)}
        ref={ref}
      />
      {filterInput.length > 0 ? (
        <button className="input-reset-filter" onClick={resetFilter}>
          reset
        </button>
      ) : null}
    </div>
  );
});

export default ClockFilterInput;
