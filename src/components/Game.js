import React from 'react';
import Board from './Board.js';
import { getDatabase, ref, set, onValue, remove, update } from "firebase/database";
import app from '../firebase.js';

export default class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null)
          }
        ],
        stepNumber: 0,
        xIsNext: true,
        database: getDatabase(app),
        player: null,
        disable_btn : false
      };
    }


    updateDB() {       
          set(ref(this.state.database), {
          history: JSON.stringify(this.state.history),
          stepNumber: this.state.stepNumber,
          xIsNext: this.state.xIsNext
        });
      }

    readDB() {
        let refDB = ref(this.state.database);
        var dbval = null;
        onValue(refDB, (snapshot) => {
            dbval = snapshot.val();
            this.setState({
                history: JSON.parse(dbval.history),
                stepNumber: dbval.stepNumber,
                xIsNext: dbval.xIsNext
            });
        });
        
    }

    componentDidMount(){
      this.readDB()
      this.interval = setInterval(
        () => {this.readDB()},100)
    }

    handlePlayer = (value) => {
      this.setState({player: value, disable_btn : true});
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      
      if(!this.state.xIsNext & (this.state.player == "X")){
        return;
      }
      else if(this.state.xIsNext & (this.state.player == "O")){
        return;
      }
      else if(this.state.player == null){
        return;
      }

      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        history: history.concat([
          {
            squares: squares
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }
  
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }
  
    render() {
      this.updateDB();

      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      
      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
  
      let status;
      if (winner) {
        status = "Winner: " + winner;
      } else {
        status = "Player: " + (this.state.xIsNext ? "X" : "O") + " turn";
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
          <div>
            {this.state.disable_btn ? <p>You are player : {this.state.player}</p> : <p>Please choose X or O </p>}
            {this.state.disable_btn ? null :
              <button onClick={()=>{this.handlePlayer('X')}} disabled={this.state.disable_btn}>
                X
              </button>
            }
            {this.state.disable_btn ? null :
              <button onClick={()=>{this.handlePlayer('O')}} disabled={this.state.disable_btn}>
                O
              </button>
            }
          </div>
          {
            !this.state.disable_btn ? null :
            <div>{status}</div>
          }
          {
            !this.state.disable_btn ? null :
            <ol>{moves}</ol>
          }
          </div>
        </div>
      );
    }
  }
  
function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
}