import $ from 'jquery';
import {
  getGarageItems,
  postGarageItem,
  patchGarageItem
} from './api';
import './styles.scss';

let allItems = [];

const loadAllItems = async ()=> {
  allItems = await getGarageItems();
  allItems.sort((a, b) => {
    return a.name - b.name;
  });
  renderItems(allItems);
  setCounts();
};

const renderItems = items => {
  $('.list-container').html('');
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
  $(newItem).find('[name="cleanliness"]').val(item.cleanliness);
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
  }
  console.log(payload);
  // const id = await postGarageItem(payload)
};

$(document).ready(loadAllItems());
$('.one-item').click(e => {
  $(e.target).closest('.one-item').find('.item-details').toggleClass('item-details-on');
});
$('form').submit(addItem);
