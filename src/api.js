export const getGarageItems = () => {
  return fetch('/api/v1/items')
    .then(response => response.json())
    .then(parsedResponse => parsedResponse)
    .catch(err => err);
};

export const postGarageItem = item => {
  return fetch('/api/v1/items', {
    method: 'POST',
    body: JSON.stringify(item),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(parsedResponse => parsedResponse)
    .catch(err => err);
};

export const patchGarageItem = (id, cleanliness) => {
  return fetch(`/api/v1/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ cleanliness: cleanliness }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(parsedResponse => parsedResponse)
    .catch(err => err);
};
