import placeHolderImg from '../images/placeholder.png';

function createCardNode({
  cardTemplate,
  id,
  title,
  imageUrl,
  likesCount,
  showDelete,
  isLiked,
  onLikeButtonClick,
  onImageClick,
  onDeleteClick,
}) {
  if (cardTemplate === null) {
    console.error('Темплейт карточки не найден');
    return;
  }

  const card = cardTemplate.content.cloneNode(true);
  const cardRoot = card.querySelector('.places__item');
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

  cardRoot.setAttribute('data-id', id);
  cardTitle.textContent = title;
  cardImage.src = imageUrl;
  cardImage.alt = title;
  likesAmount.textContent = likesCount;

  cardLikeButton.addEventListener('click', () => {
    if (typeof onLikeButtonClick === 'function') {
      onLikeButtonClick(id, cardLikeButton, likesAmount);
    }
  });

  cardImage.addEventListener('click', () => {
    if (typeof onImageClick === 'function') {
      onImageClick(cardImage.src, title);
    }
  });

  cardImage.addEventListener('error', () => {
    cardImage.src = placeHolderImg;
  });

  if (showDelete === true) {
    cardDeleteButton.addEventListener('click', () => {
      if (typeof onDeleteClick === 'function') {
        onDeleteClick(id, title);
      }
    });
  }

  return card;
}

function addCardToList(cardList, card) {
  cardList.prepend(card);
}

function removeCardFromList(cardId) {
  const card = document.querySelector(`[data-id='${cardId}']`);
  if (card) {
    card.remove();
  }
}

function updateCardLikeUI({ likeButton, likeText, likeCount }) {
  likeButton.classList.toggle('card__like-button_is-active');
  likeText.textContent = likeCount;
}

export { createCardNode, addCardToList, removeCardFromList, updateCardLikeUI };
