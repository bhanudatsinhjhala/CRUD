let categoryInput = document.querySelector(".category-input");

let productInput = document.querySelector(".product-input");

let priceInput = document.querySelector(".price-input");

let createRecordBtn = document.querySelector(".create-record");

let showGroupBtn = document.querySelector(".show-group");

let showGroupTable = document.querySelector(".group-table");

let tableBody = document.querySelector(".table-body");

let searchBox = document.querySelector(".search-input");


showRecord();

createRecordBtn.addEventListener("click", onFormSubmit);

showGroupBtn.addEventListener("click", showGroup);

searchBox.addEventListener("change", searchData);

function onFormSubmit(e) {
    e.preventDefault();
    category = categoryInput.value;
    product = productInput.value;
    price = priceInput.value;
    if (category && product && price) {
        alert(`${category} , ${price} , ${product}`);
        createRecord(product.toLowerCase(), parseInt(price), category.toLowerCase());
        showRecord();
        categoryInput.value = "";
        productInput.value = "";
        priceInput.value = "";
    } else {
        alert("You can not leave any field empty or null");
    }
}

function createRecord(product, price, category) {
    let records = JSON.parse(sessionStorage.getItem("records"));

    let isRecordDuplicate = records.find((record) => record.product === product);
    if (!isRecordDuplicate) {

        let id = records.length === 0 ? 1 : records.length + 1;
        records.push({
            id,
            product,
            price,
            category,
        });

        sessionStorage.setItem("records", JSON.stringify(records));
    } else {
        alert("Please do not enter duplicate product");
    }
}

function showRecord(records = JSON.parse(sessionStorage.getItem("records"))) {
    tableBody.innerHTML = "";
    records.forEach((record) => {
        let editClass = `edit-btn-${record.id}`;
        let deleteClass = `delete-btn-${record.id}`;
        let categoryClass = `category-btn-${record.id}`;
        let productClass = `product-btn-${record.id}`;
        let priceClass = `price-btn-${record.id}`;
        tableBody.innerHTML = tableBody.innerHTML + `
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
    if (editBtn.value === "Edit") {
        editBtn.value = "Update"
        let records = JSON.parse(sessionStorage.getItem('records'));
        let index = records.findIndex(record => record.id === id);
        let product = document.querySelector(`.product-btn-${id}`);
        let category = document.querySelector(`.category-btn-${id}`);
        let price = document.querySelector(`.price-btn-${id}`);
        product.innerHTML = `<input type="text" name="editProduct" class="edit-product-${id}" value=${records[index].product} />`
        category.innerHTML = `<input type="text" name="editCategory" class="edit-category-${id}" value=${records[index].category} />`
        price.innerHTML = `<input type="text" name="editPrice" class="edit-price-${id}" value=${records[index].price} />`
    } else {
        editBtn.value = "Edit";
        updateRecord(id);
    }
}

function deleteRecord(id) {
    let records = JSON.parse(sessionStorage.getItem('records'));

    records = records.filter((record) => record.id !== id);
    sessionStorage.setItem('records', JSON.stringify(records));
    showRecord();
}

function updateRecord(id) {
    // console.log("idssssss", id);
    let product = document.querySelector(`.product-btn-${id}`);
    let category = document.querySelector(`.category-btn-${id}`);
    let price = document.querySelector(`.price-btn-${id}`);

    let editProductInput = document.querySelector(`.edit-product-${id}`);
    let editCategoryInput = document.querySelector(`.edit-category-${id}`);
    let editPriceInput = document.querySelector(`.edit-price-${id}`);
    let records = JSON.parse(sessionStorage.getItem('records'));

    let index = records.findIndex(record => record.id === id);
    records[index].product = editProductInput.value;
    records[index].category = editCategoryInput.value;
    records[index].price = editPriceInput.value;

    // console.log("updated record ===>", records[index]);
    sessionStorage.setItem('records', JSON.stringify(records));

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
        groupTableBody.innerHTML = groupTableBody.innerHTML + `
        <tr>
        <td>${group.id}</td>
        <td class=${categoryClass}>${group.category}</td>    
        <td class=${priceClass}>${group.price}</td>
        </tr>`;
    })
}

function calcGroupPrices() {
    let records = JSON.parse(sessionStorage.getItem('records'));
    let groups = [];
    records.forEach((record) => {
        // console.log("record ===>", record.product);
        let isCategory = groups.filter((group) => group.category === record.category);
        // console.log("isCategory==>", isCategory);
        if (isCategory.length !== 0) {
            let index = groups.findIndex(group => group.category === record.category);
            groups[index].price += parseInt(record.price);
        } else {
            groups.push({
                id: groups.length + 1,
                category: record.category,
                price: parseInt(record.price)
            })
        }
    });

    return groups;
}

function searchData() {
    let searchInputValue = searchBox.value;
    console.log("search works ===>", searchInputValue);
    if (searchInputValue !== "") {

        let records = JSON.parse(sessionStorage.getItem('records'));

        let searchResult = records.filter((record) => record.product.match(searchInputValue));
        searchResult = searchResult.concat(records.filter((record) => record.price.toString().match(searchInputValue)));
        searchResult = searchResult.concat(records.filter((record) => record.category.match(searchInputValue)));

        console.log(searchResult);
        showRecord(searchResult);
    } else {
        showRecord();
    }
}