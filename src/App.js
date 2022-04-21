import logo from './logo.svg';
import './App.css';
import {useState} from "react";

const rowStyle = {
  display: 'flex'
}

const squareStyle = {
  'width':'60px',
  'height':'60px',
  'backgroundColor': '#ddd',
  'margin': '4px',
  'display': 'flex',
  'justifyContent': 'center',
  'alignItems': 'center',
  'fontSize': '20px',
  'color': 'white'
}

const boardStyle = {
  'backgroundColor': '#eee',
  'width': '208px',
  'alignItems': 'center',
  'justifyContent': 'center',
  'display': 'flex',
  'flexDirection': 'column',
  'border': '3px #eee solid'
}

const containerStyle = {
  'display': 'flex',
  'alignItems': 'center',
  'flexDirection': 'column'
}

const instructionsStyle = {
  'marginTop': '5px',
  'marginBottom': '5px',
  'fontWeight': 'bold',
  'fontSize': '16px',
}

const buttonStyle = {
  'marginTop': '15px',
  'marginBottom': '16px',
  'width': '80px',
  'height': '40px',
  'backgroundColor': '#8acaca',
  'color': 'white',
  'fontSize': '16px',
}

function Square({value, handleClick}) {

  return (
      <div
          className="square"
          style={squareStyle} onClick={handleClick}>
        {value}
      </div>
  );
}

function Board({arr, handleClick, squares, resetGame, winner, xNext, step}) {

  const renderSquare = (i) => {
    let color = false
    if( arr && arr.length === 3){
      color = arr.includes(i) ? true : false
    }
    return(
        <Square key={i} color={color} value={squares[i]} handleClick={() => {
          handleClick(i)

        }}/>
    )
  }

  const renderContent = (x, y) => {
    let content = []
    for (let i = 0; i < x; i++){
      content.push(
          <div className="board-row" style={rowStyle}>{renderRow(i,y)}</div>
      )
    }
    return content
  }

  const renderRow = (x, y) => {
    let content = []
    for (let i = 0; i < y; i++) {
      let num = x * 3 + i
      content.push(
          renderSquare(num)
      )
    }
    return content
  }

  return (
      <div style={containerStyle} className="gameBoard">
        <div id="statusArea" className="status" style={instructionsStyle}>{
          step === 9 ? "Game Over, Draw" :
          xNext ? "Next player: X" : "Next player: O"}</div>
        <div id="winnerArea" className="winner" style={instructionsStyle}>Winner: <span>{winner ? winner : 'None'}</span></div>
        <button style={buttonStyle} onClick={resetGame}>Reset</button>
        <div style={boardStyle}>

          {renderContent(3,3)}

        </div>
      </div>
  );
}

function Game() {
  const [step, setStep] = useState(0)
  const [xNext, setXNext] = useState(true)
  const [arrPosition, setArrPosition] = useState([])
  const [arr, setArr] =useState([])
  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null)
    }
  ])

  const handleClick = (i) => {
    const historyTemp = [...history]
    const current = historyTemp[historyTemp.length - 1]
    const squares = current.squares;
    if (calculateWinner(squares) || squares[i]) {

      return
    }
    const arrPositionTemp = arrPosition.slice(0, step)
    arrPositionTemp.push(i)
    squares[i] = xNext ? "X" : "O"

    setArrPosition(arrPositionTemp)
      setHistory(historyTemp.concat([
        {
          squares: squares
        }
      ]))
      setStep(history.length)
      setXNext(!xNext)

  }


  const eachStepInfo = () => {
    const arrPositionTemp = arrPosition
    if (arrPositionTemp.length === 0) {
      return ''
    }
    else {
      const arr = [[1, 1], [1, 2], [1, 3],
        [2, 1], [2, 2], [2, 3],
        [3, 1], [3, 2], [3, 3]]

      const content = arrPositionTemp.map((item, index) => {
        if (index >= step) {
          return
        }
        let position = arr[item]
        const text = `Step${index + 1}:   ${index % 2 === 0 ? 'X ' : 'O '}`
        const text1 = ` NO.${position[0]} Row，NO.${position[1]} Column`
        return (
            <div key={index}>
              <span className='content-span'>{text}</span>
              <span>{text1}</span>
            </div>
        );
      });
      return content
    }
  }


  const resetGame = () => {
    setStep(0)
    setXNext(true)
    setArrPosition([])
    setArr([])
    setHistory([
      {
        squares: Array(9).fill(null)
      }
    ])
  }

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]; }
    }
    return null;
  }
  const current = history[step]

  return (
      <div className="game">

        <div className="game-board">
          <Board arr={arr} squares={current.squares} handleClick={(i)=>handleClick(i)}
                 resetGame={()=>resetGame()} winner={calculateWinner(current.squares)}
                 xNext={xNext} step={step}

          />
        </div>
        <div>{eachStepInfo()}</div>
      </div>
  );
}





function App() {
  return (
    <div className="App">
      <Game/>
    </div>
  );
}

export default App;
