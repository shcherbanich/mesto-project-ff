const currentUser = {
  name: '',
  description: '',
  avatar: '',
  id: '',
};

function onUserDataLoaded(data) {
  currentUser.name = data.name ?? '';
  currentUser.description = data.about ?? '';
  currentUser.avatar = data.avatar ?? '';
  currentUser.id = data._id ?? '';
  updateUserDataOnUI();
}

function updateUserDataOnUI() {
  const profileName = document.querySelector('.profile__title');
  const profileDescription = document.querySelector('.profile__description');
  const profileImage = document.querySelector('.profile__image');

  if (profileName === null || profileDescription === null || profileImage === null) {
    console.error('Нет необходимого html для отображения данных пользователя');
    return;
  }

  profileName.textContent = currentUser.name;
  profileDescription.textContent = currentUser.description;
  profileImage.style.backgroundImage = `url(${currentUser.avatar})`;
}

function setUserDataOnPopup() {
  const profilePopupNameInput = document.querySelector(".popup_type_edit input[name='name']");
  const profilePopupDescriptionInput = document.querySelector(
    ".popup_type_edit input[name='description']"
  );

  if (profilePopupDescriptionInput === null || profilePopupNameInput === null) {
    console.error('Нет необходимого html для отображения данных пользователя в попапе');
    return;
  }

  profilePopupNameInput.value = currentUser.name;
  profilePopupDescriptionInput.value = currentUser.description;
}

function setUserAvatarDataOnPopup() {
  const avatarInput = document.querySelector(".popup_type_edit-avatar input[name='avatar-link']");
  if (avatarInput === null) {
    console.error('Инпут аватара профиля не найден');
    return;
  }

  avatarInput.value = currentUser.avatar;
}

function userFormHandler({ onUserDataUpdate }) {
  const form = document.querySelector("form[name='edit-profile']");
  const name = form.querySelector("input[name='name']");
  const description = form.querySelector("input[name='description']");

  if (name === null || description === null) {
    console.error('Форма пользователя не найдена');
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.dispatchEvent(customFormEvents.formLoading);

    currentUserAPI
      .update({
        name: name.value,
        description: description.value,
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
        form.dispatchEvent(customFormEvents.formStopLoading);
      });
  });
}

function avatarFormHandler({ onAvatarDataUpdate }) {
  const form = document.querySelector("form[name='avatar']");
  const link = form.querySelector("input[name='avatar-link']");

  if (link === null) {
    console.error('Форма аватара не найдена');
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.dispatchEvent(customFormEvents.formLoading);

    currentUserAPI
      .updateAvatar({
        link: link.value,
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
        form.dispatchEvent(customFormEvents.formStopLoading);
      });
  });
}
