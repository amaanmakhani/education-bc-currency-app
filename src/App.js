import { useEffect, useState } from 'react';
import Axios from 'axios';
import Dropdown from 'react-dropdown';
import { HiSwitchHorizontal } from 'react-icons/hi';
import 'react-dropdown/style.css';
import './App.css';
  
function App() {
  // Initializing all the state variables 
  const [input, setInput] = useState(0);
  const [from, setFrom] = useState("CAD");
  const [to, setTo] = useState("USD");
  const [result, setResult] = useState("");
  const [rates, setRates] = useState([]);
  const [options, setOptions] = useState([]);

  // Called when from changes
  useEffect(() => {
    console.log(process.env);
    Axios.get('https://v6.exchangerate-api.com/v6/' + process.env.REACT_APP_API_KEY + '/latest/' + from)
   .then((res) => {
      setRates(res.data.conversion_rates);
    })
  }, [from]);
  
  // Convert when from and to are switched
  useEffect(() => {
    setOptions(Object.keys(rates));
    Convert();
  }, [rates])
    
  // Function to convert the currency
  function Convert() {
    // Don't show the input if no user input exists
    if(!input)
    {
      setResult("");
      return;
    }
    var rate = rates[to];
    var output = (input * rate)||0;
    setResult(input + " " + from +" = " + output.toFixed(2) + " " + to);
  }
  
  // Switch between currencies
  function FlipCurrencies() {
    // Disappear while new currency rate is fetched and result is calculated
    setResult("");
    var temp = from;
    setFrom(to);
    setTo(temp);
  }

  function SetTwoNumberDecimal(amount) {
    var num = amount.target.value;
    var decimalPart = num.toString().split(".");
    // Handle invalid input where number has more than two decimals
    if (decimalPart.length > 1 && decimalPart[1].length > 2)
    {
      var with2Decimals = num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
      amount.target.value = with2Decimals;
    }
    setResult("");
    setInput(amount.target.value);
  }
  
  return (
    <div className="App">
      <div className="Header">
        <h1>Currency Converter</h1>
      </div>
      <div className="Body">
        <div className="Amount">
          <h3>Amount:</h3>
          <input type="number"
             placeholder="Enter the amount" 
             onChange = {(amount)=> {SetTwoNumberDecimal(amount)}} />
        </div>
        <div className="Configuration">
          <div className="CurrencyFrom">
            <h3>From:</h3>
            <Dropdown options={options} 
                      onChange={(currency) => {setFrom(currency.value)}}
            value = {from} placeholder="From" />
          </div>
          <div className="FlipValues">
            <HiSwitchHorizontal size="40px" 
                          onClick={() => { FlipCurrencies()}}/>
          </div>
          <div className="CurrencyTo">
            <h3>To:</h3>
            <Dropdown options={options} 
                      onChange={(currency) => {setTo(currency.value)}} 
            value={to} placeholder="To" />
          </div>
        </div>
      </div>
      <div className="Result">
        <button onClick={()=>{Convert()}}>Convert</button>
        <h2>Converted Amount:</h2>
        <p>{result}</p>
      </div>
    </div>
  );
}
  
export default App;