import $ from 'jquery';
import {
  getGarageItems,
  postGarageItem,
  patchGarageItem
} from './api';
import './styles.scss';

let allItems = [];
let toggleSort = true;

const loadAllItems = async ()=> {
  allItems = await getGarageItems();
  sortItems();
  $('.list-container').html('');
  renderItems(allItems);
  setCounts();
};

const sortItems = () => {
  return toggleSort ?
    allItems.sort((a, b) => a.name > b.name) :
    allItems.sort((a, b) => a.name < b.name);
};

const changeSort = () => {
  toggleSort = !toggleSort;
  const text = toggleSort ? 'A -> Z' : 'Z -> A';
  sortItems();
  $('.list-container').html('');
  renderItems(allItems);
  $('.sort h5').text(text);
};

const renderItems = items => {
  const documentFragment = $(document.createDocumentFragment());
  items.forEach(item => {
    documentFragment.append(buildDOMItem(item));
  });
  $('.list-container').append(documentFragment);
};

const buildDOMItem = item => {
  const newItem = $('.one-item').clone(true)
    .data('id', item.id);
  $(newItem).find('h3').text(item.name);
  $(newItem).find('.item-reason').text(item.reason);
  $(newItem).find('[name="change-cleanliness"]').val(item.cleanliness);
  return newItem;
};

const setCounts = () => {
  const total = $('.list-container').find('.one-item').length;
  $('.total-count').text(total);
  const sparkling = $('.list-container').find('[value="Sparkling"]:selected').length;
  $('.sparkling-count').text(sparkling);
  const dusty = $('.list-container').find('[value="Dusty"]:selected').length;
  $('.dusty-count').text(dusty);
  const rancid = $('.list-container').find('[value="Rancid"]:selected').length;
  $('.rancid-count').text(rancid);
};

const addItem = async e => {
  e.preventDefault();
  const payload = {
    name: $('[name="name"]').val(),
    reason: $('[name="reason"]').val(),
    cleanliness: $('[name="cleanliness"]').val()
  };
  const id = await postGarageItem(payload);
  const newItem = Object.assign({}, { id: id[0] }, payload);
  allItems.push(newItem);
  loadAllItems();
  setCounts();
};

const changeCleanliness = async e => {
  const id = $(e.target).closest('.one-item').data('id');
  await patchGarageItem(id, e.target.value);
  const itemIndex = allItems.findIndex(item => id === item.id);
  allItems[itemIndex].cleanliness = e.target.value;
  setCounts();
};

$(document).ready(loadAllItems());
$('.one-item').click(e => {
  if (e.target.name !== 'change-cleanliness') {
    $(e.target).closest('.one-item').find('.item-details').toggleClass('item-details-on');
  }
});
$('[name="add-new-item"]').submit(addItem);
$('[name="change-cleanliness"]').change(changeCleanliness);
$('.sort').click(changeSort);
