import Die from "./components/Die";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {

  // Eventually had to use Chatgpt to help me debug this code and I was blown away by its efficiency and accuracy. 

  // I have the previous rolls feature working and it displays the last roll of the user per gameplay


  // Total rolls has been added correctly that makes sure that the total rolls resets on page refresh but accumulates throughout the game plays i.e. before refresh.
    
  

  /* 
  There is a subtle bug that causes the number of the first click registered after pressing the roll button to be set to 2. This doesn't affect any functionality but it bugged me before. Decided to ignore it since it doens't seem to affect anything and I can't seem to reproduce it any longer.
  */
 

  const [dice, setDice] = useState(allNewDice([1, 2, 3, 4, 5, 6]));

  const [tenzies, setTenzies] = useState(false);

  const [rollCount, setRollCount] = useState(0);

  const [prevRollCount, setPrevRollCount] = useState(
    JSON.parse(localStorage.getItem("die")) || 0
  );

  const [displayPrevRollCount, setDisplayPrevRollCount] = useState(prevRollCount);

  const [totalRolls, setTotalRolls] = useState(0
    // parseInt(localStorage.getItem("totalRolls")) || 0
  ); 
  // I had to comment out that line because the value of totalRolls was being persisted across refreshes so the total rolls before a refresh is added to the total rolls after a refresh

  const [startTime, setStartTime] = useState(0);

  const [endTime, setEndTime] = useState(0);



  console.log(localStorage.die);

  console.log("Prev Roll Count", prevRollCount);

  // const date = new Date();

  // const time = 0;
  // const startDate = date.getSeconds();
  // const endDate = date.getSeconds();


  //This effect is majorly responsible for checking a win
  useEffect(() => {  

    /* 
    // My buggy implementation that checks if the user won the game.
    
    for (let i = 0; i < dice.length; i++) {
      const checkIsHeld = dice[i].isHeld;
      const checkValue = dice[i].value;

      if (checkIsHeld && checkValue) {
        setTenzies(true);
        console.log("Wins");
      }
      else {
        console.log("No wins");
      }
    } */


    // This is from the Scrimba tutorial

    const checkIsHeld = dice.every((die) => die.isHeld);
    const baseValue = dice[0].value; // Doesn't matter which value we pick as we wanted to use it to check whether the dice has the same value;

    const hasAllValueCheck = dice.every((die) => die.value === baseValue);

    if (checkIsHeld && hasAllValueCheck) {
      setTenzies(true);
    
      if (tenzies) {
        setRollCount(0);
      }
      
      else {
        setRollCount(rollCount);
      }      
      
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dice]);


  useEffect(() => {
    if (tenzies && startTime === 0) {
      setStartTime(Date.now());
    }
    if (tenzies && startTime !== 0 && endTime === 0) {
      setEndTime(Date.now());
    }
  }, [tenzies, startTime, endTime]);


  console.log(localStorage);


  const elapsedTime = Math.floor((endTime - startTime ) / 1000);

  // Helps to save the previous roll count in localStorage when there is a change in the prevRollCount state
  useEffect(() => {

    // Main problem was that I was setting the value into localstorage without really knowing if it was updated.
    localStorage.setItem("die", JSON.stringify(prevRollCount));

    // let timeOut = setTimeout(updateTime, 1000);

    // console.log("Local Storage in useEffect", localStorage);

  }, [prevRollCount]);


  // Helps to get the stored value of prevRollCount and update to the UI when the game session ends i.e. on page refresh
  useEffect(() => {
    const storedPrevRollCount = JSON.parse(localStorage.getItem("die"));
    setPrevRollCount(storedPrevRollCount);
    setDisplayPrevRollCount(storedPrevRollCount); // Update the displayed value
  }, []);
  

  useEffect(() => {
    localStorage.setItem("totalRolls", totalRolls);
  }, [totalRolls]);


  // Created new random dice values
  function allNewDice(arr) {
    const randomNumArr = [];

    for (let i = 0; i < 10; i++) {
      const randomNum = arr[Math.floor(Math.random() * arr.length)];

      randomNumArr.push({
        value: randomNum,
        isHeld: false,
        id: nanoid(),
      });
    }

    // console.log(randomNumArr);
    // console.log(randomNumArr[0].id);
    return randomNumArr;
  }


  const dieMapped = dice.map((eachDie, index) => (
    <Die
      key={eachDie.id}
      value={eachDie.value}
      isHeld={eachDie.isHeld}
      holdDice={() => holdDice(eachDie.id)}
    />
  ));


  // Resets the value of tenzies to false and the roll count back to zero when we win the game and also updates the prevRollCount with the value of rollCount so that on a new game, it sets the prevRollCount to track the number of current rolls which would now be the value for our previoous count and saves that value into our localStorage.
  function updateRollCount() {
    setTenzies(false);
    setDice(allNewDice([1, 2, 3, 4, 5, 6]));
    // Update prevRollCount and displayPrevRollCount
    setPrevRollCount(rollCount);
    setDisplayPrevRollCount(rollCount);

    // Update totalRolls
    setTotalRolls(totalRolls + rollCount);

    // Update localStorage
    localStorage.setItem("die", JSON.stringify(rollCount));
    setRollCount(0);
    setStartTime(0); // Reset the start time
    setEndTime(0); // Reset the end time
  }

  
  // Checks if we haven't won and updates the dice when we have held values and click on the roll button. 
  function rollDice() {
    if (!tenzies) {
      setDice((prevValue) => {
        return prevValue.map((die, index) => {
          // console.log(die);
          return die.isHeld
            ? { ...die }
            : (die = allNewDice([1, 2, 3, 4, 5, 6])[index]);
        });
      });

      if (startTime === 0) {
        setStartTime(Date.now());
      }
    }  

    else {
      setTenzies(false);
      setDice(allNewDice([1, 2, 3, 4, 5, 6]));
    }


    // Updates state for the number of rolls
    setRollCount(prevRollCount => 
      prevRollCount + 1
    );

  }


  // Helps to save or hold the state of the die clicked on throughout rolls.
  function holdDice(id) {
    // console.log(id);

    setDice((prevValue) => {
      return prevValue.map((value) => {
        return value.id === id 
          ? { ...value, isHeld: !value.isHeld } 
          : value;
      });
    });

  }


  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <div className="game-stats">
      
      <h3>Previous Rolls: {displayPrevRollCount}</h3>
        
      {tenzies 
        ? <h4>
          Time elapsed is: {elapsedTime > 0 ? elapsedTime : 0} secs
        </h4>
        : ""
      }

      <h3>Current Rolls: {rollCount}</h3>
      <h3>Total Rolls: {totalRolls}</h3>

      <br />

      </div>
      
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze at its
        current value between rolls.
      </p>

      <div className="dice-container">{dieMapped}</div>

      {tenzies && <h4 className="win-text">You win!</h4>}

      {tenzies 
        ? (
        <button 
          onClick={updateRollCount} 
          className="roll-dice"
        >
          New Game
        </button>
        ) 

        : (
        <button 
          onClick={rollDice} 
          className="roll-dice"
        >
          Roll
        </button>
        )
      }

      {/*<button onClick={rollDice} className="roll-dice">
          {tenzies ? "New Game" : "Roll"}
        </button> 
      */}
    </main>
  );
}
