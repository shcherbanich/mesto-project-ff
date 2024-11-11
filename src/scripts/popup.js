function enablePopup({ popupSelector, triggerSelector, onShowPopup, onHidePopup }) {
  const popup = document.querySelector(popupSelector);
  const trigger = document.querySelector(triggerSelector);

  if (popup === null || trigger === null) {
    console.error('Неверный селектор для попапа и/или триггера', popupSelector, triggerSelector);
    return;
  }

  const closeButton = popup.querySelector('.popup__close');

  if (closeButton === null) {
    console.error('В попапе отсутствует кнопка закрыть', popupSelector);
    return;
  }

  trigger.addEventListener('click', show);
  closeButton.addEventListener('click', hide);

  function show() {
    popup.classList.add('popup_is-animated');
    setTimeout(() => {
      popup.classList.add('popup_is-opened');
    }, 1);

    if (typeof onShowPopup === 'function') {
      onShowPopup();
    }
  }

  function hide() {
    popup.classList.remove('popup_is-opened');
    setTimeout(() => {
      popup.classList.remove('popup_is-animated');
    }, 600);

    if (typeof onHidePopup === 'function') {
      onHidePopup();
    }
  }

  return {
    show,
    hide,
  };
}

export { enablePopup }
