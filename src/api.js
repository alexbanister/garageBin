export const getGarageItems = () => {
  return fetch('/api/v1/items')
    .then(response => response.json())
    .then(parsedResponse => parsedResponse)
    .catch(err => err);
};

export const postGarageItem = item => {
  return fetch('/api/v1/items', {
    method: 'post',
    body: JSON.stringify(item)
  })
    .then(response => response.json())
    .then(parsedResponse => parsedResponse)
    .catch(err => err);
};

export const patchGarageItem = item => {
  return fetch('/api/v1/items', {
    method: 'patch',
    body: JSON.stringify({ cleanliness: item })
  })
    .then(response => response.json())
    .then(parsedResponse => parsedResponse)
    .catch(err => err);
};
