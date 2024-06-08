import React, { useId, useState } from 'react';
import './Calculator.css';

const inputFieldsConfig = {
  AperiodicFirstOrder: ["k", "T"],
  AperiodicSecondOrder: ["k", "T1", "T2"],
  Vibrational: ["k", "T", "zeta"],
  Conservateur: ["k", "T"],
  DifferentiatingInertial: ["k", "T"],
  InterialForcing: ["k", "T1", "T2"],
  nonMinimalPhase: ["k", "T1", "T2"],
  Isodromic: ["k", "T"],
  IntegratingInertial: ["k", "T"],
  delay: ["tau"],
  PID: ["Kp", "Ki", "Kd"]
};

const FunctionSelector = ({ onChangeParams, onChangeType, currentType, onRemove, param, isOnlyOne }) => {
  //console.log(param);

  const idInput_T = useId();
  const idInput_T1 = useId();
  const idInput_T2 = useId();
  const idInput_k = useId();
  const idInput_zeta = useId();
  const idInput_tau = useId();
  const idInput_Kp = useId();
  const idInput_Ki = useId();
  const idInput_Kd = useId();

  const [input_T, setInput_T] = useState(param?.T ?? 1);
  const [input_k, setInput_k] = useState(param?.k ?? 3);
  const [input_zeta, setInput_zeta] = useState(param?.zeta ?? 0.1);
  const [input_T1, setInput_T1] = useState(param?.T1 ?? 1);
  const [input_T2, setInput_T2] = useState(param?.T2 ?? 2);
  const [input_tau, setInput_tau] = useState(param?.tau ?? 0.5);
  const [input_Kp, setInput_Kp] = useState(param?.Kp ?? 0.5);
  const [input_Ki, setInput_Ki] = useState(param?.Ki ?? 0.2);
  const [input_Kd, setInput_Kd] = useState(param?.Kd ?? 0.1);

  

  const handleTypeChange = (e) => {
    const type = e.target.value;
    onChangeType(type);
  };
  

  const renderInput = (label, id, value, onChange) => (
    <div key={id}>
      <label htmlFor={id}>{label}</label>
      <input
        step="0.1"
        type="number"
        id={id}
        value={value}
        onChange={onChange}
      />
    </div>
  );

  const inputsToRender = inputFieldsConfig[currentType].map(field => {
    switch (field) {
      case "k":
        return renderInput("k", idInput_k, input_k, (e) => {
          setInput_k(e.target.value);
          onChangeParams({ k: e.target.value || 1});
        });
      case "T":
        return renderInput("T", idInput_T, input_T, (e) => {
          setInput_T(e.target.value);
          onChangeParams({ T: e.target.value || 1});
        });
      case "T1":
        return renderInput("T1", idInput_T1, input_T1, (e) => {
          setInput_T1(e.target.value);
          onChangeParams({ T1: e.target.value || 1});
        });
      case "T2":
        return renderInput("T2", idInput_T2, input_T2, (e) => {
          setInput_T2(e.target.value);
          onChangeParams({ T2: e.target.value || 1});
        });
      case "zeta":
        return renderInput("zeta", idInput_zeta, input_zeta, (e) => {
          setInput_zeta(e.target.value);
          onChangeParams({ zeta: e.target.value || 0.1});
        });
      case "tau":
        return renderInput("tau", idInput_tau, input_tau, (e) => {
          setInput_tau(e.target.value);
          onChangeParams({ tau: e.target.value || 0.1});
        });
      case "Kp":
        return renderInput("Kp", idInput_Kp, input_Kp, (e) => {
          setInput_Kp(e.target.value);
          onChangeParams({ Kp: e.target.value || 1});
        });
      case "Ki":
          return renderInput("Ki", idInput_Ki, input_Ki, (e) => {
            setInput_Ki(e.target.value);
            onChangeParams({ Ki: e.target.value || 1});
          });
      case "Kd":
        return renderInput("Kd", idInput_Kd, input_Kd, (e) => {
          setInput_Kd(e.target.value);
          onChangeParams({ Kd: e.target.value || 1});
        });
      default:
        return null;
    }
  });

  return (
    <div className="FunctionSelectorWrapper">
      <div className="SelectColumn">
        <label htmlFor="function-type">Выберите тип функции:</label>
        <select id="function-type" value={currentType} onChange={handleTypeChange}>
            <option value="PID">ПИД-регулятор</option>
            <option value="AperiodicFirstOrder">Апериодическое звено первого порядка</option>
            <option value="AperiodicSecondOrder">Апериодическое звено второго порядка</option>
            <option value="Vibrational">Колебательное звено</option>
            <option value="Conservateur">Консервативное звено</option>
            <option value="DifferentiatingInertial">Дифференцирующее инерционное звено</option>
            <option value="InterialForcing">Инерционно-форсирующее звено</option>
            <option value="nonMinimalPhase">Устойчивое неминимально-фазовое звено первого порядка</option>
            <option value="Isodromic">Изодромическое звено</option>
            <option value="IntegratingInertial">Интегрирующее инерционное звено</option>
            <option value="delay">Запаздывание</option>
        </select>
      </div>
      <div className="InputColumn">
        {inputsToRender}
      </div>
      <button
        onClick={onRemove}
        disabled={isOnlyOne}
        className={isOnlyOne ? "RemoveButton Disabled" : "RemoveButton"}>
          Удалить звено
      </button>
    </div>
  );
};

export default FunctionSelector;