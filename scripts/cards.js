const deleteCardPopup = enablePopup({
  popupSelector: '.popup_type_delete-card',
  triggerSelector: '.hidden-popup-trigger',
});
const cardImagePopup = enablePopup({
  popupSelector: '.popup_type_image',
  triggerSelector: '.hidden-popup-trigger',
});

// это нужно для правильной работы кнопки сохранить
// чтобы она менялась во время загрузки
enableValidation({
  formSelector: '.popup_type_delete-card .popup__form',
  submitButtonSelector: '.popup_type_delete-card .popup__button',
  formErrorSelector: '.popup__error',
  inputErrorClass: 'popup__input_type_error',
  validationConfig: [],
});

function onCardLike({ cardId, cardLikeButton, likesAmount }) {
  cardAPI
    .like(cardId)
    .then((response) => {
      cardLikeButton.classList.add('card__like-button_is-active');
      likesAmount.textContent = response.likes.length;
    })
    .catch((error) => {
      console.log(error);
    });
}

function onCardRemoveLike({ cardId, cardLikeButton, likesAmount }) {
  cardAPI
    .removeLike(cardId)
    .then((response) => {
      cardLikeButton.classList.remove('card__like-button_is-active');
      likesAmount.textContent = response.likes.length;
    })
    .catch((error) => {
      console.log(error);
    });
}

function createCardNode({ id, title, imageUrl, likesCount, showDelete, isLiked }) {
  const cardTemaplate = document.querySelector('#card-template');
  if (cardTemaplate === null) {
    console.error('Тепмлейт карточки не найден');
    return;
  }

  const card = cardTemaplate.content.cloneNode(true);
  const cardImage = card.querySelector('.card__image');
  const cardDeleteButton = card.querySelector('.card__delete-button');
  const cardTitle = card.querySelector('.card__title');
  const cardLikeButton = card.querySelector('.card__like-button');
  const likesAmount = card.querySelector('.card__like-count');

  if (showDelete !== true) {
    cardDeleteButton.remove();
  }

  if (isLiked === true) {
    cardLikeButton.classList.add('card__like-button_is-active');
  }

  cardTitle.textContent = title;
  cardImage.src = imageUrl;
  likesAmount.textContent = likesCount;

  cardLikeButton.addEventListener('click', () => {
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
  });

  cardImage.addEventListener('click', () => {
    const popupImage = document.querySelector('.popup_type_image .popup__image');
    const popupCaption = document.querySelector('.popup_type_image .popup__caption');

    if (popupImage === null || popupCaption === null) {
      console.error('Попап картинки карточки не найден');
      return;
    }

    popupImage.src = cardImage.src;
    popupCaption.textContent = title;

    cardImagePopup.show();
  });

  cardImage.addEventListener('error', () => {
    cardImage.src = './images/placeholder.png';
  });

  if (showDelete === true) {
    cardDeleteButton.addEventListener('click', () => {
      const deletePopupForm = document.querySelector("form[name='delete-card']");
      const paragraph = deletePopupForm.querySelector('p');
      const input = deletePopupForm.querySelector("input[name='card-id']");

      paragraph.textContent = `Вы собираетесь удалить '${title}'.`;
      input.value = id;
      deleteCardPopup.show();
    });
  }

  return card;
}

function createCardList(data) {
  const list = [];
  data.forEach((item) => {
    list.push(cardDataToCardNode(item));
  });

  return list;
}

function getCardListContainer() {
  const cardList = document.querySelector('.places__list');
  if (cardList === null) {
    console.error('контейнер для списка карточек не найден');
    return document.createElement('div');
  }

  return cardList;
}

function clearCardsInCardList() {
  const cardList = getCardListContainer();
  while (cardList.firstChild) {
    cardList.firstChild.remove();
  }
}

function onCardListLoaded(data) {
  clearCardsInCardList();

  const cardList = getCardListContainer();
  const list = createCardList(data);
  list.forEach((item) => {
    cardList.append(item);
  });
}

function addCardToList(card) {
  const cardList = getCardListContainer();
  cardList.prepend(card);
}

function cardDataToCardNode(data) {
  const isDelete = data.owner._id === currentUser.id;
  const isLiked = data.likes.some((el) => el._id === currentUser.id);

  return createCardNode({
    id: data._id,
    title: data.name,
    imageUrl: data.link,
    showDelete: isDelete,
    isLiked: isLiked,
    likesCount: data.likes.length,
  });
}

function onNewCardCreation(data) {
  const cardNode = cardDataToCardNode(data);
  addCardToList(cardNode);
}

function cardFormHandler({ onCardCreation }) {
  const form = document.querySelector("form[name='new-place']");
  const name = form.querySelector("input[name='place-name']");
  const link = form.querySelector("input[name='link']");

  if (name === null || link === null) {
    console.error('Форма карточки не найдена');
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.dispatchEvent(customFormEvents.formLoading);

    cardAPI
      .create({
        name: name.value,
        link: link.value,
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
        form.dispatchEvent(customFormEvents.formStopLoading);
      });
  });
}

function deleteCardFormHandler({ onCardDeletion }) {
  const form = document.querySelector("form[name='delete-card']");
  const cardId = form.querySelector("input[name='card-id']");

  if (cardId === null) {
    console.error('Форма удаления карточки не найдена');
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.dispatchEvent(customFormEvents.formLoading);

    cardAPI
      .delete(cardId.value)
      .then(() => {
        if (typeof onCardDeletion === 'function') {
          onCardDeletion();
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        form.dispatchEvent(customFormEvents.formStopLoading);
      });
  });
}
deleteCardFormHandler({
  onCardDeletion: () => {
    cardAPI.loadList().then((response) => {
      onCardListLoaded(response);
    });
    deleteCardPopup.hide();
  },
});
