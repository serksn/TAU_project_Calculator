import React, { useState } from 'react';
import FunctionSelector from './FunctionSelector';
import Chart from './Charts';
import './Calculator.css';

const Calculator = () => {
  const [functions, setFunctions] = useState([{ type: "AperiodicFirstOrder", params: { k: 3, T: 1 } }]);
  const [feedbackLoops, setFeedbackLoops] = useState([
    { 
      feedbackFunctions: [],
      feedbackStart: 0,
      feedbackEnd: 0,
      sign: -1,
    }
  ]);
  const [L, setL] = useState(10);
  const [dt, setDt] = useState(0.001);

  const handleFunctionTypeChange = (index, newType) => {
    const newFunctions = [...functions];
    newFunctions[index] = { type: newType, params: {} };
    setFunctions(newFunctions);
    //handleFunctionParamsChange(index, newFunctions[index].params);
  };

  const handleFeedbackFunctionTypeChange = (loopIndex, index, newType) => {
    const newFeedbackLoops = [...feedbackLoops];
    newFeedbackLoops[loopIndex].feedbackFunctions[index] = { type: newType, params: {} };
    setFeedbackLoops(newFeedbackLoops);
  };

  const handleFunctionParamsChange = (index, newParams) => {
    const newFunctions = [...functions];
    newFunctions[index] = { ...newFunctions[index], params: { ...newFunctions[index].params, ...newParams } };
    setFunctions(newFunctions);
  };

  const handleFeedbackFunctionParamsChange = (loopIndex, index, newParams) => {
    const newFeedbackLoops = [...feedbackLoops];
    newFeedbackLoops[loopIndex].feedbackFunctions[index] = { 
      ...newFeedbackLoops[loopIndex].feedbackFunctions[index], 
      params: { ...newFeedbackLoops[loopIndex].feedbackFunctions[index].params, ...newParams } 
    };
    setFeedbackLoops(newFeedbackLoops);
  };

  const handleFeedbackStartChange = (loopIndex, value) => {
    const newFeedbackLoops = [...feedbackLoops];
    newFeedbackLoops[loopIndex].feedbackStart = Math.min(parseInt(value, 10), functions.length-1);
    setFeedbackLoops(newFeedbackLoops);
  };

  const handleFeedbackEndChange = (loopIndex, value) => {
    const newFeedbackLoops = [...feedbackLoops];
    newFeedbackLoops[loopIndex].feedbackEnd = Math.min(parseInt(value, 10), functions.length-1);
    setFeedbackLoops(newFeedbackLoops);
  };

  const handleFeedbackSignChange = (loopIndex, value) => {
    const newFeedbackLoops = [...feedbackLoops];
    newFeedbackLoops[loopIndex].sign = value;
    setFeedbackLoops(newFeedbackLoops);
  };

  const addFunction = () => setFunctions([...functions, { type: "AperiodicFirstOrder", params: { k: 3, T: 1 } }]);

  const removeFunction = (index) => setFunctions(functions.filter((_, i) => i !== index));

  const addFeedbackFunction = (loopIndex) => {
    const newFeedbackLoops = [...feedbackLoops];
    newFeedbackLoops[loopIndex].feedbackFunctions.push({ type: "AperiodicFirstOrder", params: { k: 3, T: 1 } });
    setFeedbackLoops(newFeedbackLoops);
  };

  const removeFeedbackFunction = (loopIndex, index) => {
    const newFeedbackLoops = [...feedbackLoops];
    newFeedbackLoops[loopIndex].feedbackFunctions = newFeedbackLoops[loopIndex].feedbackFunctions.filter((_, i) => i !== index);
    setFeedbackLoops(newFeedbackLoops);
  };

  const addFeedbackLoop = () => {
    setFeedbackLoops([
      ...feedbackLoops,
      {
        feedbackFunctions: [],
        feedbackStart: 0,
        feedbackEnd: 0,
        sign: 1,
      }
    ]);
  };

  const removeFeedbackLoop = (index) => {
    setFeedbackLoops(feedbackLoops.filter((_, i) => i !== index));
  };

  const handleLChange = (e) => setL(e.target.value);

  const handleDtChange = (e) => setDt(e.target.value);

  return (
    <div>
      <div>
        <label>
          L:
          <input type="number" value={L} onChange={handleLChange} />
        </label>
        <label>
          dt:
          <input type="number" value={dt} onChange={handleDtChange} step="0.001" readOnly />
        </label>
      </div>
      <button onClick={addFunction}>Добавить звено в последовательное соединение</button><br/>
      <button onClick={addFeedbackLoop}>Добавить петлю обратной связи</button>
      <div className='ContentWrapper'>
        {functions.map((func, index) => (
          <FunctionSelector
            key={index}
            param={func.params}
            onChangeType={(newType) => handleFunctionTypeChange(index, newType)}
            onChangeParams={(newParams) => handleFunctionParamsChange(index, newParams)}
            currentType={func.type}
            onRemove={() => removeFunction(index)}
            isOnlyOne={functions.length === 1}
          />
        ))}
      </div>
      <div className='ContentWrapper'>
        {feedbackLoops.map((loop, loopIndex) => (
          <div key={loopIndex} className="FeedbackLoopWrapper">
            <h3>Обратная связь {loopIndex + 1}</h3>
            {loop.feedbackFunctions.map((func, index) => (
              <FunctionSelector
                key={index}
                param={func.params}
                onChangeType={(newType) => handleFeedbackFunctionTypeChange(loopIndex, index, newType)}
                onChangeParams={(newParams) => handleFeedbackFunctionParamsChange(loopIndex, index, newParams)}
                currentType={func.type}
                onRemove={() => removeFeedbackFunction(loopIndex, index)}
              />
            ))}
            <button onClick={() => addFeedbackFunction(loopIndex)}>Добавить звено обратной связи</button>
            <div>
              <label>
                Вид связи:
                <select value={loop.sign} onChange={(e) => handleFeedbackSignChange(loopIndex, e.target.value)}>
                  <option value="1">Положительная</option>
                  <option value="-1">Отрицательная</option>
                </select>
              </label>
              <label>
                Начало обратной связи:
                <input 
                  type="number" 
                  min='1' 
                  max={functions.length} 
                  step="1" 
                  value={loop.feedbackStart + 1} 
                  onChange={(e) => handleFeedbackStartChange(loopIndex, e.target.value - 1)} 
                />
              </label>
              <label>
                Конец обратной связи:
                <input 
                  type="number" 
                  min='1' 
                  max={functions.length} 
                  step="1" 
                  value={loop.feedbackEnd + 1} 
                  onChange={(e) => handleFeedbackEndChange(loopIndex, e.target.value - 1)} 
                />
              </label>
            </div>
            <button className='RemoveButton' onClick={() => removeFeedbackLoop(loopIndex)}>Удалить петлю обратной связи</button>
          </div>
        ))}
      </div>

      <Chart functions={functions} feedbackLoops={feedbackLoops} L={L} dt={dt} />
    </div>
  );
};

export default Calculator;