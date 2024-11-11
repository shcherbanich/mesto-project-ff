import { cardAPI, currentUserAPI } from './api';
import {
  avatarFormHandler,
  onUserDataLoaded,
  setUserAvatarDataOnPopup,
  setUserDataOnPopup,
  userFormHandler,
} from './current-user';
import { cardFormHandler, onCardListLoaded } from './cards';
import { enablePopup } from './popup';
import { enableValidation, validators } from './validation';
import '../pages/index.css';

function loadInitialData() {
  Promise.all([currentUserAPI.load(), cardAPI.loadList()])
    .then((response) => {
      const userData = response[0];
      const cardsData = response[1];

      onUserDataLoaded(userData);
      onCardListLoaded(cardsData);
    })
    .catch((error) => {
      console.log(error);
    });
}

const profilePopup = enablePopup({
  popupSelector: '.popup_type_edit',
  triggerSelector: '.profile__edit-button',
  onShowPopup: onShowProfilePopup,
  onHidePopup: onHideProfilePopup,
});

const profileForm = enableValidation({
  formSelector: '.popup_type_edit .popup__form',
  submitButtonSelector: '.popup_type_edit .popup__button',
  formErrorSelector: '.popup__error',
  inputErrorClass: 'popup__input_type_error',
  validationConfig: [
    {
      groupSelector: '[data-name="name"]',
      validators: [
        {
          rule: validators.notEmpty,
        },
        {
          rule: validators.minLength,
          param: 2,
        },
        {
          rule: validators.maxLength,
          param: 40,
        },
        {
          rule: validators.text,
        },
      ],
    },
    {
      groupSelector: '[data-name="description"]',
      validators: [
        {
          rule: validators.notEmpty,
        },
        {
          rule: validators.minLength,
          param: 2,
        },
        {
          rule: validators.maxLength,
          param: 200,
        },
        {
          rule: validators.text,
        },
      ],
    },
  ],
});

function onShowProfilePopup() {
  setUserDataOnPopup();
  profileForm.validate();
}

function onHideProfilePopup() {
  setTimeout(() => {
    profileForm.reset();
  }, 1000);
}

const cardPopup = enablePopup({
  popupSelector: '.popup_type_new-card',
  triggerSelector: '.profile__add-button',
  onShowPopup: onShowCardPopup,
  onHidePopup: onHideCardPopup,
});

const cardForm = enableValidation({
  formSelector: '.popup_type_new-card .popup__form',
  submitButtonSelector: '.popup_type_new-card .popup__button',
  formErrorSelector: '.popup__error',
  inputErrorClass: 'popup__input_type_error',
  validationConfig: [
    {
      groupSelector: '[data-name="place-name"]',
      validators: [
        {
          rule: validators.notEmpty,
        },
        {
          rule: validators.minLength,
          param: 2,
        },
        {
          rule: validators.maxLength,
          param: 30,
        },
        {
          rule: validators.text,
        },
      ],
    },
    {
      groupSelector: '[data-name="link"]',
      validators: [
        {
          rule: validators.notEmpty,
        },
        {
          rule: validators.url,
        },
      ],
    },
  ],
});

function onShowCardPopup() {
  cardForm.validate();
}

function onHideCardPopup() {
  setTimeout(() => {
    cardForm.reset();
  }, 1000);
}

const avatarPopup = enablePopup({
  popupSelector: '.popup_type_edit-avatar',
  triggerSelector: '.profile__image',
  onShowPopup: onShowAvatarPopup,
  onHidePopup: onHideAvatarPopup,
});

const avatarForm = enableValidation({
  formSelector: '.popup_type_edit-avatar .popup__form',
  submitButtonSelector: '.popup_type_edit-avatar .popup__button',
  formErrorSelector: '.popup__error',
  inputErrorClass: 'popup__input_type_error',
  validationConfig: [
    {
      groupSelector: '[data-name="avatar-link"]',
      validators: [
        {
          rule: validators.notEmpty,
        },
        {
          rule: validators.url,
        },
      ],
    },
  ],
});

function onShowAvatarPopup() {
  setUserAvatarDataOnPopup();
  avatarForm.validate();
}

function onHideAvatarPopup() {
  setTimeout(() => {
    avatarForm.reset();
  }, 1000);
}

loadInitialData();

userFormHandler({
  onUserDataUpdate: () => {
    profilePopup.hide();
  },
});

cardFormHandler({
  onCardCreation: () => {
    cardPopup.hide();
  },
});

avatarFormHandler({
  onAvatarDataUpdate: () => {
    avatarPopup.hide();
  },
});
