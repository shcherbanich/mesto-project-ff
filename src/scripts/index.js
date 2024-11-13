import '../pages/index.css';

import { cardAPI, currentUserAPI } from './api';
import { enablePopup } from './popup';
import {
  enableValidation,
  clearValidation,
  clearInputValues,
  customFormEvents,
} from './validation';
import { createCardNode, updateCardLikeUI, addCardToList, removeCardFromList } from './cards';

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inputErrorClass: 'popup__input_type_error',
};

const currentUser = {
  name: '',
  description: '',
  avatar: '',
  id: '',
};

const userDom = {
  profileName: document.querySelector('.profile__title'),
  profileDescription: document.querySelector('.profile__description'),
  profileImage: document.querySelector('.profile__image'),
};

const userFormDom = {
  form: document.querySelector("form[name='edit-profile']"),
  name: document.querySelector("input[name='name']"),
  description: document.querySelector("input[name='description']"),
};

const avatarFormDom = {
  form: document.querySelector("form[name='avatar']"),
  link: document.querySelector("input[name='avatar-link']"),
};

const profilePopup = enablePopup({
  popupSelector: '.popup_type_edit',
  triggerSelector: '.profile__edit-button',
  onShowPopup: () => {
    setUserDataOnPopup();
    clearValidation(userFormDom.form, validationConfig);
  },
});

const avatarPopup = enablePopup({
  popupSelector: '.popup_type_edit-avatar',
  triggerSelector: '.profile__image',
  onShowPopup: () => {
    setUserAvatarDataOnPopup();
    clearValidation(avatarFormDom.form, validationConfig);
  },
});

function onUserDataLoaded(data) {
  currentUser.name = data.name ?? '';
  currentUser.description = data.about ?? '';
  currentUser.avatar = data.avatar ?? '';
  currentUser.id = data._id ?? '';
  updateUserDataOnUI();
}

function updateUserDataOnUI() {
  if (
    userDom.profileName === null ||
    userDom.profileDescription === null ||
    userDom.profileImage === null
  ) {
    console.error('Нет необходимого html для отображения данных пользователя');
    return;
  }

  userDom.profileName.textContent = currentUser.name;
  userDom.profileDescription.textContent = currentUser.description;
  userDom.profileImage.style.backgroundImage = `url(${currentUser.avatar})`;
}

function setUserDataOnPopup() {
  if (userFormDom.name === null || userFormDom.description === null) {
    console.error('Нет необходимого html для отображения данных пользователя в попапе');
    return;
  }

  userFormDom.name.value = currentUser.name;
  userFormDom.description.value = currentUser.description;
}

function setUserAvatarDataOnPopup() {
  if (avatarFormDom.link === null) {
    console.error('Инпут аватара профиля не найден');
    return;
  }

  avatarFormDom.link.value = currentUser.avatar;
}

function userFormHandler({ onUserDataUpdate }) {
  if (userFormDom.form === null || userFormDom.name === null || userFormDom.description === null) {
    console.error('Форма пользователя не найдена');
    return;
  }

  userFormDom.form.addEventListener('submit', (e) => {
    e.preventDefault();
    userFormDom.form.dispatchEvent(customFormEvents.formLoading);

    currentUserAPI
      .update({
        name: userFormDom.name.value,
        description: userFormDom.description.value,
      })
      .then((response) => {
        onUserDataLoaded(response);
        if (typeof onUserDataUpdate === 'function') {
          onUserDataUpdate();
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        userFormDom.form.dispatchEvent(customFormEvents.formStopLoading);
      });
  });
}

function avatarFormHandler({ onAvatarDataUpdate }) {
  if (avatarFormDom.form === null || avatarFormDom.link === null) {
    console.error('Форма аватара не найдена');
    return;
  }

  avatarFormDom.form.addEventListener('submit', (e) => {
    e.preventDefault();
    avatarFormDom.form.dispatchEvent(customFormEvents.formLoading);

    currentUserAPI
      .updateAvatar({
        link: avatarFormDom.link.value,
      })
      .then((response) => {
        onUserDataLoaded(response);
        if (typeof onAvatarDataUpdate === 'function') {
          onAvatarDataUpdate();
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        avatarFormDom.form.dispatchEvent(customFormEvents.formStopLoading);
      });
  });
}

const cardDom = {
  cardTemplate: document.querySelector('#card-template'),
  cardList: document.querySelector('.places__list'),
};

const cardFormDom = {
  form: document.querySelector("form[name='new-place']"),
  name: document.querySelector("input[name='place-name']"),
  link: document.querySelector("input[name='link']"),
};

const cardDeleteFormDom = {
  form: document.querySelector("form[name='delete-card']"),
  cardId: document.querySelector("input[name='card-id']"),
  paragraph: document.querySelector("form[name='delete-card'] p"),
};

const cardImagePopupDom = {
  image: document.querySelector('.popup_type_image .popup__image'),
  caption: document.querySelector('.popup_type_image .popup__caption'),
};

const cardPopup = enablePopup({
  popupSelector: '.popup_type_new-card',
  triggerSelector: '.profile__add-button',
  onHidePopup: () => {
    clearInputValues(cardFormDom.form, validationConfig);
    clearValidation(cardFormDom.form, validationConfig);
  },
});

const deleteCardPopup = enablePopup({
  popupSelector: '.popup_type_delete-card',
  triggerSelector: '.hidden-popup-trigger',
});

const cardImagePopup = enablePopup({
  popupSelector: '.popup_type_image',
  triggerSelector: '.hidden-popup-trigger',
});

function onCardLike({ cardId, cardLikeButton, likesAmount }) {
  cardAPI
    .like(cardId)
    .then((response) => {
      updateCardLikeUI({
        likeButton: cardLikeButton,
        likeText: likesAmount,
        likeCount: response.likes.length,
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function onCardRemoveLike({ cardId, cardLikeButton, likesAmount }) {
  cardAPI
    .removeLike(cardId)
    .then((response) => {
      updateCardLikeUI({
        likeButton: cardLikeButton,
        likeText: likesAmount,
        likeCount: response.likes.length,
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function onCardLikeButtonClick(id, cardLikeButton, likesAmount) {
  if (cardLikeButton.classList.contains('card__like-button_is-active')) {
    onCardRemoveLike({
      cardId: id,
      cardLikeButton: cardLikeButton,
      likesAmount: likesAmount,
    });
  } else {
    onCardLike({
      cardId: id,
      cardLikeButton: cardLikeButton,
      likesAmount: likesAmount,
    });
  }
}

function onCardImageClick(url, caption) {
  if (cardImagePopupDom.image === null || cardImagePopupDom.caption === null) {
    console.error('Попап картинки карточки не найден');
    return;
  }

  cardImagePopupDom.image.src = url;
  cardImagePopupDom.image.alt = caption;
  cardImagePopupDom.caption.textContent = caption;

  cardImagePopup.show();
}

function onCardDeleteClick(id, title) {
  if (
    cardDeleteFormDom.form === null ||
    cardDeleteFormDom.paragraph === null ||
    cardDeleteFormDom.cardId === null
  ) {
    console.log('форма удаления карточки не найдена');
    return;
  }

  cardDeleteFormDom.paragraph.textContent = `Вы собираетесь удалить '${title}'.`;
  cardDeleteFormDom.cardId.value = id;

  deleteCardPopup.show();
}

function cardDataToCardNode(data) {
  const isDelete = data.owner._id === currentUser.id;
  const isLiked = data.likes.some((el) => el._id === currentUser.id);

  return createCardNode({
    cardTemplate: cardDom.cardTemplate,
    id: data._id,
    title: data.name,
    imageUrl: data.link,
    showDelete: isDelete,
    isLiked: isLiked,
    likesCount: data.likes.length,
    onLikeButtonClick: onCardLikeButtonClick,
    onImageClick: onCardImageClick,
    onDeleteClick: onCardDeleteClick,
  });
}

function getCardListContainer() {
  if (cardDom.cardList === null) {
    console.error('Контейнер карточек не найден');
    return document.createElement('div');
  }
  return cardDom.cardList;
}

function onCardListLoaded(data) {
  const cardList = getCardListContainer();
  data.forEach((item) => {
    cardList.append(cardDataToCardNode(item));
  });
}

function onNewCardCreation(data) {
  const cardNode = cardDataToCardNode(data);
  addCardToList(cardDom.cardList, cardNode);
}

function cardFormHandler({ onCardCreation }) {
  if (cardFormDom.form === null || cardFormDom.name === null || cardFormDom.link === null) {
    console.error('Форма карточки не найдена');
    return;
  }

  cardFormDom.form.addEventListener('submit', (e) => {
    e.preventDefault();
    cardFormDom.form.dispatchEvent(customFormEvents.formLoading);

    cardAPI
      .create({
        name: cardFormDom.name.value,
        link: cardFormDom.link.value,
      })
      .then((response) => {
        onNewCardCreation(response);
        if (typeof onCardCreation === 'function') {
          onCardCreation();
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        cardFormDom.form.dispatchEvent(customFormEvents.formStopLoading);
      });
  });
}

function deleteCardFormHandler({ onCardDeletion }) {
  if (cardDeleteFormDom.form === null || cardDeleteFormDom.cardId === null) {
    console.error('Форма удаления карточки не найдена');
    return;
  }

  cardDeleteFormDom.form.addEventListener('submit', (e) => {
    e.preventDefault();
    cardDeleteFormDom.form.dispatchEvent(customFormEvents.formLoading);

    cardAPI
      .delete(cardDeleteFormDom.cardId.value)
      .then(() => {
        if (typeof onCardDeletion === 'function') {
          onCardDeletion(cardDeleteFormDom.cardId.value);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        cardDeleteFormDom.form.dispatchEvent(customFormEvents.formStopLoading);
      });
  });
}

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

enableValidation(validationConfig);

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

deleteCardFormHandler({
  onCardDeletion: (cardId) => {
    removeCardFromList(cardId);
    deleteCardPopup.hide();
  },
});
