const config = {
  baseUrl: 'https://nomoreparties.co/v1/cohort-mag-4',
  headers: {
    authorization: '37fbf8d3-fcee-4506-bb54-03f43938c259',
    'Content-Type': 'application/json',
  },
};

async function request({ path, options, errorMessage }) {
  return fetch(`${config.baseUrl}${path}`, options).then((response) => {
    return checkResponse(response, errorMessage);
  });
}

function checkResponse(response, errorMessage) {
  if (!response.ok) {
    return Promise.reject(`${errorMessage}: ${response.status}`);
  }

  return response.json();
}

const currentUserAPI = {
  load: async () => {
    return request({
      path: '/users/me',
      options: {
        method: 'GET',
        headers: config.headers,
      },
      errorMessage: 'Ошибка API при получении данных пользователя',
    });
  },
  update: async ({ name, description }) => {
    return request({
      path: '/users/me',
      options: {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
          name: name,
          about: description,
        }),
      },
      errorMessage: 'Ошибка API при обновлении данных пользователя',
    });
  },
  updateAvatar: async ({ link }) => {
    return request({
      path: '/users/me/avatar',
      options: {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
          avatar: link,
        }),
        errorMessage: 'Ошибка API при обновлении аватара',
      },
    });
  },
};

const cardAPI = {
  loadList: async () => {
    return request({
      path: '/cards',
      options: {
        method: 'GET',
        headers: config.headers,
      },
      errorMessage: 'Ошибка API при получении списка карточек',
    });
  },
  create: async ({ name, link }) => {
    return request({
      path: '/cards',
      options: {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({
          name: name,
          link: link,
        }),
      },
      errorMessage: 'Ошибка API при создании новой карточки',
    });
  },
  like: async (cardId) => {
    return request({
      path: `/cards/likes/${cardId}`,
      options: {
        method: 'PUT',
        headers: config.headers,
      },
      errorMessage: 'Ошибка API при лайкании карточки',
    });
  },
  removeLike: async (cardId) => {
    return request({
      path: `/cards/likes/${cardId}`,
      options: {
        method: 'DELETE',
        headers: config.headers,
      },
      errorMessage: 'Ошибка API при убирании лайка карточки',
    });
  },
  delete: async (cardId) => {
    return request({
      path: `/cards/${cardId}`,
      options: {
        method: 'DELETE',
        headers: config.headers,
      },
      errorMessage: 'Ошибка API при удалении карточки',
    });
  },
};

export { cardAPI, currentUserAPI };
