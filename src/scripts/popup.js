const customPopupEvents = {
  close: new Event('close-popup'),
};

function closePopupOnESC(e) {
  if (e.key === 'Escape') {
    const popup = document.querySelector('.popup_is-opened');
    if (popup) {
      popup.dispatchEvent(customPopupEvents.close);
    }
  }
}

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
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      hide();
    }
  });
  popup.addEventListener(customPopupEvents.close.type, hide);

  function show() {
    document.addEventListener('keydown', closePopupOnESC);

    popup.classList.add('popup_is-animated');
    setTimeout(() => {
      popup.classList.add('popup_is-opened');
    }, 1);

    if (typeof onShowPopup === 'function') {
      onShowPopup();
    }
  }

  function hide() {
    document.removeEventListener('keydown', closePopupOnESC);

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

export { enablePopup };
