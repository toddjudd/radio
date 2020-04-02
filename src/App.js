import React, { useReducer, useEffect } from 'react';
const RadioApp = () => {
  useEffect(() => {
    raidoDispatch({ type: 'init' });
  }, []);

  const radioReducer = (state, action) => {
    switch (action.type) {
      case 'init':
        return { rows: 5, columns: 5 };
      default:
        return null;
    }
  };
  const getGrid = (rows, columns) => {
    let grid = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        grid.push([r, c]);
      }
    }
    return grid;
  };
  const [radioState, raidoDispatch] = useReducer(radioReducer, {});
  return (
    <div className='RadioApp'>
      <h1>RadioApp</h1>
      {getGrid(radioState.rows, radioState.columns).map(cell => (
        <div className='cell'>
          row {cell[0]} column{cell[1]}
        </div>
      ))}
    </div>
  );
};
export default RadioApp;
