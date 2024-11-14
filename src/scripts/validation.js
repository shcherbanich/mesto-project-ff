const customFormEvents = {
  formLoading: new Event('form-loading'),
  formStopLoading: new Event('form-stop-loading'),
};

function showInputError(formElement, inputElement, errorMessage, validationConfig) {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
  inputElement.classList.add(validationConfig.inputErrorClass);
  errorElement.textContent = errorMessage;
}

function hideInputError(formElement, inputElement, validationConfig) {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
  inputElement.classList.remove(validationConfig.inputErrorClass);
  errorElement.textContent = '';
}

function validate(formElement, inputElement, validationConfig) {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, validationConfig);
  } else {
    hideInputError(formElement, inputElement, validationConfig);
  }
}

function setEventListeners(formElement, validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);
  const buttonInitialText = buttonElement.textContent;

  toggleButtonState(inputList, buttonElement, validationConfig);

  formElement.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  formElement.addEventListener(customFormEvents.formLoading.type, (e) => {
    const buttonText = 'Ждите...';

    buttonElement.setAttribute('disabled', 'disabled');
    buttonElement.textContent = buttonText;
  });

  formElement.addEventListener(customFormEvents.formStopLoading.type, () => {
    buttonElement.removeAttribute('disabled');
    buttonElement.textContent = buttonInitialText;
  });

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      validate(formElement, inputElement, validationConfig);
      toggleButtonState(inputList, buttonElement);
    });
  });
}

function enableValidation(validationConfig) {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(formElement, validationConfig);
  });
}

function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}

function toggleButtonState(inputList, buttonElement) {
  if (hasInvalidInput(inputList)) {
    buttonElement.setAttribute('disabled', 'disabled');
  } else {
    buttonElement.removeAttribute('disabled');
  }
}

function clearValidation(formElement, validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, validationConfig);
    inputElement.setCustomValidity('');
  });
  buttonElement.setAttribute('disabled', 'disabled');
}

function clearInputValues(formElement, validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  inputList.forEach((inputElement) => {
    inputElement.value = '';
  });
}

export { enableValidation, clearValidation, clearInputValues, customFormEvents };
