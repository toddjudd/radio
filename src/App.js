import React, { useReducer, useEffect } from 'react';
import className from 'classnames';
import { capitalizeFirstLetter } from './static/helpers';
const RadioApp = () => {
  const gridsize = 10;
  const mapActions = ['island', 'sonar-hit', 'sonar-miss'];
  const radioReducer = (state, action) => {
    switch (action.type) {
      case 'init':
        return {
          rows: gridsize,
          columns: gridsize,
          grid: createGrid(gridsize, gridsize),
          mapAction: 'island',
          path: []
        };
      case 'grid':
        console.log('grid');
        return { ...state, grid: createGrid(state.rows, state.columns) };
      case 'rows':
        return { ...state, rows: action.payload };
      case 'columns':
        return { ...state, columns: action.payload };
      case 'toggle-map':
        return {
          ...state,
          mapAction:
            mapActions[
              mapActions.indexOf(state.mapAction) + 1 === mapActions.length
                ? 0
                : mapActions.indexOf(state.mapAction) + 1
            ]
        };
      case 'island':
        console.log('island');
        return {
          ...state,
          grid: state.grid.map((row, r) => {
            return row.map((cell, c) => {
              if (r === action.payload.r && c === action.payload.c) {
                return {
                  ...cell,
                  isIsland: !cell.isIsland
                };
              }
              return cell;
            });
          })
        };
      case 'sonar-hit':
        return {
          ...state,
          path: [...state.path, { action: 'sonar', type: 'hit', hit: true, cell: action.payload }]
        };
      case 'sonar-miss':
        return {
          ...state,
          path: [...state.path, { action: 'sonar', type: 'miss', hit: false, cell: action.payload }]
        };
      case 'move':
        return {
          ...state,
          path: [...state.path, { action: 'direction', type: action.payload }],
          grid: calcPath(
            state.grid,
            [...state.path, { action: 'direction', type: action.payload }],
            state.rows
          )
        };
      default:
        return null;
    }
  };

  //usecallback?
  const createGrid = (numRows, numColumns) => {
    console.log(`createGrid ${numRows} ${numColumns}`);
    let rows = [];
    for (let r = 0; r < numRows; r++) {
      rows.push(
        Array.from(Array(numColumns), (el, c) => {
          let cell = {
            isIsland: false,
            r,
            c
          };
          return cell;
        })
      );
    }
    return rows;
  };

  //usecallback?
  const calcPath = (grid, path, numRows) => {
    // console.log('calcPath');
    // console.log({ grid, path });
    return grid.map((rows, r) => {
      // console.log('rows');
      // console.log({ rows, r });
      return rows.map((cell, c) => {
        // console.log('cell');
        // console.log({ cell, c });
        if (cell.isIsland) {
          return {
            ...cell,
            possibleStartPos: false
          };
        }
        if (typeof cell.possibleStartPos === 'undefined' || cell.possibleStartPos) {
          // console.log(`cell ${cell.r}-${cell.c} is Possible Starting Pos: start Reduce.`);
          return path.reduce((accCell, pathAction, i, path) => {
            // console.log('reducing');
            if (i === 0) {
              // console.log('initial reduce - Nulling pathCell');
              accCell.pathCell = null;
            }
            if (typeof accCell.possibleStartPos !== 'undefined' && !accCell.possibleStartPos) {
              return accCell;
            }
            switch (pathAction.action) {
              case 'sonar':
                break;
              case 'direction':
                // console.log('accCell.possibleStartPos is not undefined, and is true');
                // console.log(`Direction Switch: ${i}. ${direction}`);
                switch (pathAction.type) {
                  case 'north':
                    // console.log('checking North Direction');
                    if (accCell.pathCell) {
                      // console.log('PathCell Exists');
                      if (accCell.pathCell.r - 1 < 0) {
                        // console.log('moving North on Path Cell foces out of range');
                        // console.log('returning accCell as is with False Possible Start');
                        return { ...accCell, possibleStartPos: false };
                      }
                      // console.log('setting Path cell to one Cell North');
                      accCell.pathCell = grid[accCell.pathCell.r - 1][accCell.pathCell.c];
                    } else {
                      if (accCell.r - 1 < 0) {
                        // console.log('moving North on Path Cell foces out of range');
                        // console.log('returning accCell as is with False Possible Start');
                        return { ...accCell, possibleStartPos: false };
                      }
                      // console.log('setting Path cell to one Cell North');
                      accCell.pathCell = grid[accCell.r - 1][accCell.c];
                    }
                    break;
                  case 'south':
                    // console.log('checking South Direction');
                    if (accCell.pathCell) {
                      // console.log('PathCell Exists');
                      if (accCell.pathCell.r + 1 >= numRows) {
                        // console.log('moving South on Path Cell foces out of range');
                        // console.log('returning accCell as is with False Possible Start');
                        return { ...accCell, possibleStartPos: false };
                      }
                      // console.log('setting Path cell to one Cell South');
                      accCell.pathCell = grid[accCell.pathCell.r + 1][accCell.pathCell.c];
                    } else {
                      if (accCell.r + 1 >= numRows) {
                        // console.log('moving South on Path Cell foces out of range');
                        // console.log('returning accCell as is with False Possible Start');
                        return { ...accCell, possibleStartPos: false };
                      }
                      // console.log('setting Path cell to one Cell South');
                      accCell.pathCell = grid[accCell.r + 1][accCell.c];
                    }
                    break;
                  case 'east':
                    if (accCell.pathCell) {
                      accCell.pathCell = grid[accCell.pathCell.r][accCell.pathCell.c + 1];
                    } else {
                      accCell.pathCell = grid[accCell.r][accCell.c + 1];
                    }
                    break;
                  case 'west':
                    if (accCell.pathCell) {
                      accCell.pathCell = grid[accCell.pathCell.r][accCell.pathCell.c - 1];
                    } else {
                      accCell.pathCell = grid[accCell.r][accCell.c - 1];
                    }
                    break;
                  default:
                    // return accCell;
                    break;
                }
                break;
              default:
                break;
            }
            // console.log('accCell.possibleStartPos is not undefined, and is true');
            // console.log(`Direction Switch: ${i}. ${direction}`);
            switch (pathAction.type) {
              case 'north':
                // console.log('checking North Direction');
                if (accCell.pathCell) {
                  // console.log('PathCell Exists');
                  if (accCell.pathCell.r - 1 < 0) {
                    // console.log('moving North on Path Cell foces out of range');
                    // console.log('returning accCell as is with False Possible Start');
                    return { ...accCell, possibleStartPos: false };
                  }
                  // console.log('setting Path cell to one Cell North');
                  accCell.pathCell = grid[accCell.pathCell.r - 1][accCell.pathCell.c];
                } else {
                  if (accCell.r - 1 < 0) {
                    // console.log('moving North on Path Cell foces out of range');
                    // console.log('returning accCell as is with False Possible Start');
                    return { ...accCell, possibleStartPos: false };
                  }
                  // console.log('setting Path cell to one Cell North');
                  accCell.pathCell = grid[accCell.r - 1][accCell.c];
                }
                break;
              case 'south':
                // console.log('checking South Direction');
                if (accCell.pathCell) {
                  // console.log('PathCell Exists');
                  if (accCell.pathCell.r + 1 >= numRows) {
                    // console.log('moving South on Path Cell foces out of range');
                    // console.log('returning accCell as is with False Possible Start');
                    return { ...accCell, possibleStartPos: false };
                  }
                  // console.log('setting Path cell to one Cell South');
                  accCell.pathCell = grid[accCell.pathCell.r + 1][accCell.pathCell.c];
                } else {
                  if (accCell.r + 1 >= numRows) {
                    // console.log('moving South on Path Cell foces out of range');
                    // console.log('returning accCell as is with False Possible Start');
                    return { ...accCell, possibleStartPos: false };
                  }
                  // console.log('setting Path cell to one Cell South');
                  accCell.pathCell = grid[accCell.r + 1][accCell.c];
                }
                break;
              case 'east':
                if (accCell.pathCell) {
                  accCell.pathCell = grid[accCell.pathCell.r][accCell.pathCell.c + 1];
                } else {
                  accCell.pathCell = grid[accCell.r][accCell.c + 1];
                }
                break;
              case 'west':
                if (accCell.pathCell) {
                  accCell.pathCell = grid[accCell.pathCell.r][accCell.pathCell.c - 1];
                } else {
                  accCell.pathCell = grid[accCell.r][accCell.c - 1];
                }
                break;
              default:
                // return accCell;
                break;
            }
            // console.log('current status of acc and path Cells after Direction:');
            // console.log(accCell);
            if (typeof accCell.pathCell === 'undefined' || accCell.pathCell.isIsland) {
              // console.log(
              // "pathCell is undefined or is an Island. We're off map and no loger a possibleStartPos"
              // );
              return { ...accCell, possibleStartPos: false };
            }
            // console.log('returning Acc with appended path Cell and moving on.');
            return { ...accCell, possibleStartPos: true };
          }, cell);
        }
        return cell;
      });
    });
  };

  const [radioState, raidoDispatch] = useReducer(radioReducer, {
    rows: gridsize,
    columns: gridsize,
    grid: createGrid(gridsize, gridsize),
    path: []
  });

  useEffect(() => {
    raidoDispatch({ type: 'init' });
  }, []);

  useEffect(() => {
    raidoDispatch({ type: 'grid' });
  }, [radioState.rows, radioState.columns]);

  // useEffect(() => {
  //   raidoDispatch({ type: 'cacl' });
  // }, [radioState.path]);

  return (
    <div className='RadioApp'>
      <h1>RadioApp</h1>
      <form onSubmit={e => e.prevenDefault}>
        <input
          type='number'
          name='rows'
          value={radioState.rows}
          onChange={e => raidoDispatch({ type: 'rows', payload: parseInt(e.target.value) || 1 })}
        />
        <input
          type='number'
          name='columns'
          value={radioState.columns}
          onChange={e => raidoDispatch({ type: 'columns', payload: parseInt(e.target.value) || 1 })}
        />
        <button type='button' onClick={() => raidoDispatch({ type: 'toggle-map' })}>
          Toggle{' '}
          {radioState.mapAction &&
            radioState.mapAction
              .split('-')
              .map(word => capitalizeFirstLetter(word))
              .join(' ')}
        </button>
      </form>
      <div
        className='map'
        style={{
          gridTemplateColumns: `repeat(${radioState.columns}, min-content)`,
          gridTemplateRows: `repeat(${radioState.rows}, min-content)`
        }}>
        {radioState.grid.map((rows, r) =>
          rows.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={className({
                cell: true,
                island: cell.isIsland,
                startPos: cell.possibleStartPos
              })}
              onClick={() => {
                console.log('click');
                raidoDispatch({ type: radioState.mapAction, payload: { r, c } });
              }}></div>
          ))
        )}
      </div>
      <div className='compass'>
        <button onClick={() => raidoDispatch({ type: 'move', payload: 'north' })} type='button'>
          North
        </button>
        <button onClick={() => raidoDispatch({ type: 'move', payload: 'east' })} type='button'>
          East
        </button>
        <button onClick={() => raidoDispatch({ type: 'move', payload: 'south' })} type='button'>
          South
        </button>
        <button onClick={() => raidoDispatch({ type: 'move', payload: 'west' })} type='button'>
          West
        </button>
      </div>
      <div className='log'>
        {radioState.path.map(pathAction => (
          <div className='log-entry'>
            <span className='action'>{pathAction.action}</span>
            <span className='type'>{pathAction.type}</span>
            {pathAction.cell ? (
              <span className='sonar-cell'>
                {pathAction.cell.r}-{pathAction.cell.c}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
export default RadioApp;
