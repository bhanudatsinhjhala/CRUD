let categoryInput = document.querySelector(".category-input");
let productInput = document.querySelector(".product-input");
let priceInput = document.querySelector(".price-input");
let showGroupTable = document.querySelector(".group-table");
let tableBody = document.querySelector(".table-body");
let searchBox = document.querySelector(".search-input");

let sortingArrowId = document.querySelector(".arrows-id");
let sortingArrowCategory = document.querySelector(".arrows-category");
let sortingArrowProduct = document.querySelector(".arrows-product");
let sortingArrowPrice = document.querySelector(".arrows-price");

if (sessionStorage.getItem("records") === null) {
  sessionStorage.setItem("records", JSON.stringify([]));
}
showRecord();

function getRecords() {
  return JSON.parse(sessionStorage.getItem("records"));
}
searchBox.addEventListener("change", searchData);

function onDataInput(e) {
  e.preventDefault();
  let category = categoryInput.value.toLowerCase();
  let product = productInput.value.toLowerCase();
  let price = parseInt(priceInput.value);
  if (!category || !product || !price) {
    alert("You can not leave any field empty or null");
    return;
  }
  alert(`${category} , ${price} , ${product}`);
  createRecord(product, price, category);
  showRecord();
  categoryInput.value = "";
  productInput.value = "";
  priceInput.value = "";
}

function createRecord(product, price, category) {
  let records = getRecords();
  console.log(records);
  let isRecordDuplicate = records.every((record) => record.product !== product);
  if (!isRecordDuplicate) {
    alert("Please do not enter duplicate product");
    return;
  }
  let id = records.length === 0 ? 1 : records.length + 1;
  records.push({
    id,
    product,
    price,
    category,
  });
  sessionStorage.setItem("records", JSON.stringify(records));
}

function showRecord(records = getRecords()) {
  tableBody.innerHTML = "";
  records.forEach((record) => {
    let editClass = `edit-btn-${record.id}`;
    let deleteClass = `delete-btn-${record.id}`;
    let categoryClass = `category-btn-${record.id}`;
    let productClass = `product-btn-${record.id}`;
    let priceClass = `price-btn-${record.id}`;
    tableBody.innerHTML =
      tableBody.innerHTML +
      `
        <tr>
        <td>${record.id}</td>
        <td class=${categoryClass}>${record.category}</td>
        <td class=${productClass}>${record.product}</td>
        <td class=${priceClass}>${record.price}</td>
        <td>
            <input type="button" name="edit" value="Edit" class=${editClass} onclick="showEditInput(${record.id})">
            <input type="button" name="delete" value="Delete" class=${deleteClass} onclick="deleteRecord(${record.id})">
        </td>
        </tr>`;
  });
  if (showGroupTable.style.visibility === "visible") {
    showGroup();
  }
}

function showEditInput(id) {
  let editBtn = document.querySelector(`.edit-btn-${id}`);
  if (editBtn.value !== "Edit") {
    editBtn.value = "Edit";
    updateRecord(id);
    return;
  }
  editBtn.value = "Update";
  let records = getRecords();
  let index = records.findIndex((record) => record.id === id);
  let product = document.querySelector(`.product-btn-${id}`);
  let category = document.querySelector(`.category-btn-${id}`);
  let price = document.querySelector(`.price-btn-${id}`);
  product.innerHTML = `<input type="text" name="editProduct" class="edit-product-${id}" value=${records[index].product} />`;
  category.innerHTML = `<input type="text" name="editCategory" class="edit-category-${id}" value=${records[index].category} />`;
  price.innerHTML = `<input type="text" name="editPrice" class="edit-price-${id}" value=${records[index].price} />`;
}

function deleteRecord(id) {
  let records = getRecords();
  records = records.filter((record) => record.id !== id);
  sessionStorage.setItem("records", JSON.stringify(records));
  showRecord();
}

function updateRecord(id) {
  let product = document.querySelector(`.product-btn-${id}`);
  let category = document.querySelector(`.category-btn-${id}`);
  let price = document.querySelector(`.price-btn-${id}`);
  let editProductInput = document.querySelector(`.edit-product-${id}`);
  let editCategoryInput = document.querySelector(`.edit-category-${id}`);
  let editPriceInput = document.querySelector(`.edit-price-${id}`);

  let records = getRecords();
  let index = records.findIndex((record) => record.id === id);
  records[index].product = editProductInput.value;
  records[index].category = editCategoryInput.value;
  records[index].price = editPriceInput.value;
  sessionStorage.setItem("records", JSON.stringify(records));

  product.innerHTML = records[index].product;
  price.innerHTML = records[index].price;
  category.innerHTML = records[index].category;
}

function showGroup() {
  showGroupTable.style.visibility = "visible";
  let groups = calcGroupPrices();
  let groupTableBody = document.querySelector(".group-table-body");
  groupTableBody.innerHTML = "";
  groups.forEach((group) => {
    let categoryClass = `category-btn-${group.id}`;
    let priceClass = `price-btn-${group.id}`;
    groupTableBody.innerHTML =
      groupTableBody.innerHTML +
      `
        <tr>
        <td>${group.id}</td>
        <td class=${categoryClass}>${group.category}</td>    
        <td class=${priceClass}>${group.price}</td>
        </tr>`;
  });
}

function calcGroupPrices() {
  let records = getRecords();
  let groups = [];
  records.forEach((record) => {
    let index = groups.findIndex((group) => group.category === record.category);
    if (index === -1) {
      groups.push({
        id: groups.length + 1,
        category: record.category,
        price: parseInt(record.price),
      });
      return;
    }
    groups[index].price += parseInt(record.price);
  });
  return groups;
}

function searchData() {
  let searchInputValue = searchBox.value;
  if (searchInputValue === "") {
    showRecord();
    return;
  }
  let records = getRecords();
  let searchResult;
  if (isNaN(searchInputValue)) {
    searchResult = records.filter((record) =>
      record.product.match(searchInputValue)
    );
    searchResult = searchResult.concat(
      records.filter((record) => record.category.match(searchInputValue))
    );
    showRecord(searchResult);
    return;
  }
  searchResult = records.filter((record) =>
    record.price.toString().match(searchInputValue)
  );
  showRecord(searchResult);
}

function sortTable(header) {
  let sortColumn = {
    id: sortingArrowId,
    category: sortingArrowCategory,
    product: sortingArrowProduct,
    price: sortingArrowPrice,
  };
  console.log(sortColumn[header].value);
  sortArray(sortColumn[header].value);
  if (sortColumn[header].value === "asc")
    return (sortColumn[header].value = "desc");
  sortColumn[header].value = "asc";

  function sortArray(order) {
    let records = getRecords();
    records.sort((a, b) => {
      if (order === "asc") {
        if (a[header] < b[header]) return -1;
        if (a[header] > b[header]) return 1;
        return 0;
      }
      if (a[header] < b[header]) return 1;
      if (a[header] > b[header]) return -1;
      return 0;
    });
    showRecord(records);
  }
}
