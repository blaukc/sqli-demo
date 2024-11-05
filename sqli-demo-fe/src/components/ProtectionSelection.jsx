import React from 'react';

const ProtectionSelection = ({selectedOption, setSelectedOption}) => {

  // Function to handle radio button change
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <h3>Choose protection:</h3>
      <label>
        <input
          type="radio"
          name="option"
          value="none"
          checked={selectedOption === 'none'}
          onChange={handleChange}
        />
        None
      </label>
      <br />
      <label>
        <input
          type="radio"
          name="option"
          value="input_validation"
          checked={selectedOption === 'input_validation'}
          onChange={handleChange}
        />
        Input Validation
      </label>
      <br />
      <label>
        <input
          type="radio"
          name="option"
          value="prepared_statements"
          checked={selectedOption === 'prepared_statements'}
          onChange={handleChange}
        />
        Prepared Statements
      </label>
      <br />
      <label>
        <input
          type="radio"
          name="option"
          value="orm"
          checked={selectedOption === 'orm'}
          onChange={handleChange}
        />
        ORM
      </label>
    </div>
  );
};

export default ProtectionSelection;
