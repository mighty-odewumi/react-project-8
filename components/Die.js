export default function Die(props) {

  const dieHeldStyle = {
    backgroundColor: props.isHeld ? "#53e391" : "whitesmoke",
  };

  return (
    <div 
      className="die-face"
      style={dieHeldStyle}
      onClick={props.holdDice}
    >
      <h3 className="die-value">
        {" ▪ ".repeat(props.value)}
      </h3>
    </div>
  )
}

