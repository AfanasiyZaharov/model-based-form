class FormModel {
  // inputs = {
  //   title: {
  //     value: "",
  //     handler: this.handleNameChange,
  //   },
  //   copyCreativeTitleFromFile: "",
  //   fileName: "" // some example
  // };

  // add also:
  // computable params (like showSOmething, or like this)
  // think about the way how to download some data as input option for example
  constructor(inputsConfig) {
    this.inputs = {};
    for (let i = 0; i < inputsConfig.length; i++) {
      this.inputs[inputsConfig[i].fieldName] = { ...inputsConfig[i] };
    }
    this.makeValues();
    console.log('this', this);
  }

  inputs = null;
  values = null;
  isInTransaction = false;
  lastTransactionList = null;

  startTransaction = () => {
    this.isInTransaction = true;
    this.lastTransactionList = [];
  };

  commitTransaction = () => {
    for (let i = 0; i < this.lastTransactionList.length; i++) {
      const { fieldName, newValue } = this.lastTransactionList[i];
      this.privateMakeChange(fieldName, newValue);
    }
    this.makeValues(this.lastTransactionList);
    this.notify(this.lastTransactionList);
    this.lastTransactionList = [];
    this.isInTransaction = false;
  };

  rollbackTransaction = () => {
    this.lastTransactionList = [];
    this.isInTransaction = false;
  };

  // todo make it works with object like structs
  //todo make it works with transactions
  makeValues = (lastTransactionList = null) => {
    if (!lastTransactionList) {
      this.values = {};
      for (let key in this.inputs) {
        this.values[key] = this.inputs[key].value;
      }
    } else {
      for (let i = 0; i < lastTransactionList.length; i++) {
        const { fieldName } = this.lastTransactionList[i];
        this.values[fieldName] = this.inputs[fieldName].value;
      }
    }
  };

  observers = {};

  subscribe = (fieldNames, onChange) => {
    if (onChange && typeof onChange === "function") {
      for (let i = 0; i < fieldNames.length; i++) {
        if (this.observers[fieldNames[i]]) {
          this.observers[fieldNames[i]].push(onChange);
        } else {
          this.observers[fieldNames[i]] = [onChange];
        }
      }
    }

    this.notify(fieldNames.map((fieldName) => ({fieldName})));
  };

  // todo make it more like input in form
  privateMakeChange = (fieldName, newValue) => {
    this.inputs[fieldName].value = newValue;
  };

  defaultChange(fieldName, newValue, values) {
    this.makeChange(fieldName, newValue);
  }

  makeChange = (fieldName, newValue) => {
    this.lastTransactionList.push({ fieldName, newValue });
  };

  makeInputChange = (fieldName, newValue) => {
    let input = this.inputs[fieldName];
    if (!input) {
      throw new Error("There is no such input " + fieldName);
    }
    try {
      this.startTransaction();
      if (input.handler && typeof input.handler === "function") {
        input.handler.call(this, newValue);
      } else {
        this.defaultChange(fieldName, newValue);
      }
      this.commitTransaction();
    } catch (e) {
      this.rollbackTransaction();
    }
  };

  notify = notifiersArr => {
    for (let i = 0; i < notifiersArr.length; i++) {
      const { fieldName } = notifiersArr[i];
      const preparedArgs = {
        onChange: (...args) => this.makeInputChange(fieldName, ...args),
        value: this.inputs[fieldName].value
      };
      for (let i = 0; i < this.observers[fieldName].length; i++) {
        this.observers[fieldName][i](preparedArgs);
      }
    }
  };
}

const inputsConfig = [
  {
    fieldName: "title",
    value: "",
    valueType: "string",
    handler: function(newValue) {
      if (this.values.copyCreativeTitleFromFile === true) {
        this.makeChange("copyCreativeTitleFromFile", false);
      }
      this.makeChange("title", newValue);
    }
  },
  {
    fieldName: "copyCreativeTitleFromFile",
    value: false,
    valueType: "boolean"
  },
  {
    fieldName: "fileName",
    value: "",
    valueType: "string",
    handler: function(newValue) {
      if (this.values.copyCreativeTitleFromFile === true) {
        this.makeChange("title", newValue);
      }
      this.makeChange("fileName", newValue);
    }
  }
];

const resultForm = new FormModel(inputsConfig);

export default resultForm;
