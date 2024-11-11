const config = {
  baseUrl: 'https://nomoreparties.co/v1/cohort-mag-4',
  headers: {
    authorization: '37fbf8d3-fcee-4506-bb54-03f43938c259',
    'Content-Type': 'application/json',
  },
};

const currentUserAPI = {
  load: async () => {
    return fetch(`${config.baseUrl}/users/me`, {
      method: 'GET',
      headers: config.headers,
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(`Ошибка API при получении данных пользователя: ${response.status}`);
      }
    });
  },
  update: async ({ name, description }) => {
    return fetch(`${config.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: config.headers,
      body: JSON.stringify({
        name: name,
        about: description,
      }),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(`Ошибка API при обновлении данных пользователя: ${response.status}`);
      }
    });
  },
  updateAvatar: async ({ link }) => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: config.headers,
      body: JSON.stringify({
        avatar: link,
      }),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(`Ошибка API при обновлении аватара: ${response.status}`);
      }
    });
  },
};

const cardAPI = {
  loadList: async () => {
    return fetch(`${config.baseUrl}/cards`, {
      method: 'GET',
      headers: config.headers,
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(`Ошибка API при получении списка карточек: ${response.status}`);
      }
    });
  },
  create: async ({ name, link }) => {
    return fetch(`${config.baseUrl}/cards`, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(`Ошибка API при создании новой карточки: ${response.status}`);
      }
    });
  },
  like: async (cardId) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
      method: 'PUT',
      headers: config.headers,
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(`Ошибка API при лайкании карточки: ${response.status}`);
      }
    });
  },
  removeLike: async (cardId) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
      method: 'DELETE',
      headers: config.headers,
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(`Ошибка API при убирании лайка карточки: ${response.status}`);
      }
    });
  },
  delete: async (cardId) => {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: config.headers,
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(`Ошибка API при удалении карточки: ${response.status}`);
      }
    });
  },
};

export { cardAPI, currentUserAPI };
