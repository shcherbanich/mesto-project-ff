const customFormEvents = {
    formLoading: new Event("form-loading"),
    formStopLoading: new Event("form-stop-loading"),
};

const validators = {
    notEmpty: (val) => {
        if (val && val.length > 0) {
            return true;
        }
        return "Вы пропустили это поле";
    },
    minLength: (val, length) => {
        if (val && val.length >= length) {
            return true;
        }
        return `Минимальное количество символов: ${length}. Длина текста сейчас: ${val.length}`;
    },
    maxLength: (val, length) => {
        if (val && val.length <= length) {
            return true;
        }
        return `Максимальное количество символов: ${length}. Длина текста сейчас: ${val.length}`;
    },
    text: (val) => {
        const regex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
        if (regex.test(val)) {
            return true;
        }
        return "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы";
    },
    url: (val) => {
        try {
            new URL(val);
            return true;
        } catch (error) {
            return "Введите ссылку";
        }
    },
};

function inputValidator({
    selector,
    errorSelector,
    inputErrorClass,
    validators,
    onInput,
}) {
    const group = document.querySelector(selector);
    if (group === null) {
        console.error("Селектор инпут группы не верен");
        return;
    }

    const input = group.querySelector("input");
    const error = group.querySelector(errorSelector);

    if (input === null || error === null) {
        console.error("Инпут и сообщение об ошибке отсутствуют в DOM");
        return;
    }

    function validate() {
        return Array.from(validators).every(
            (item) => item.rule(input.value, item.param) === true
        );
    }

    function showError(message) {
        error.textContent = message;
        input.classList.add(inputErrorClass);
    }

    function resetError() {
        error.textContent = "";
        input.classList.remove(inputErrorClass);
    }

    function reset() {
        resetError();
        input.value = "";
    }

    input.addEventListener("input", () => {
        for (let index = 0; index < validators.length; index++) {
            const item = validators[index];
            const result = item.rule(input.value, item.param);

            if (typeof onInput === "function") {
                onInput();
            }

            if (typeof result === "string") {
                showError(result);
                return;
            } else {
                resetError();
            }
        }
    });

    return {
        validate,
        reset,
    };
}

function enableValidation({
    formSelector,
    submitButtonSelector,
    formErrorSelector,
    inputErrorClass,
    validationConfig,
}) {
    const form = document.querySelector(formSelector);
    const button = document.querySelector(submitButtonSelector);
    const formInputs = [];

    if (form === null || button === null) {
        console.error(
            "Попап не содержит нужных DOM элементов для работы валидации"
        );
        return;
    }

    let buttonInitialText = button.textContent;

    function buttonStateToggle() {
        const isValid = formInputs.every((item) => item.validate());
        if (isValid) {
            button.removeAttribute("disabled");
        } else {
            button.setAttribute("disabled", "disabled");
        }
    }

    function validate() {
        if (formInputs.length === 0) {
            Array.from(validationConfig).forEach((el) => {
                const validator = inputValidator({
                    selector: el.groupSelector,
                    errorSelector: formErrorSelector,
                    inputErrorClass: inputErrorClass,
                    validators: el.validators,
                    onInput: buttonStateToggle,
                });
                formInputs.push(validator);
            });
        }

        buttonStateToggle();
    }

    function reset() {
        formInputs.forEach((input) => {
            input.reset();
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
    });

    form.addEventListener(customFormEvents.formLoading.type, (e) => {
        const buttonText = e.text ?? "Ждите...";

        button.setAttribute("disabled", "disabled");
        button.textContent = buttonText;
    });

    form.addEventListener(customFormEvents.formStopLoading.type, () => {
        button.removeAttribute("disabled");
        button.textContent = buttonInitialText;
    });

    return {
        validate,
        reset,
    };
}

export { validators, customFormEvents, enableValidation };
