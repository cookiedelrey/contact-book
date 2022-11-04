const API = "http://localhost:8000/contact";

// переменные для инпутов
let name = document.querySelector("#name");
let mail = document.querySelector("#mail");
let image = document.querySelector("#image");
let btnAdd = document.querySelector("#btn-add");

// ? переменные для инпутов
let editName = document.querySelector('#edit-name');
let editMail = document.querySelector('#edit-mail');
let editImage = document.querySelector('#edit-image');
let editSaveBtn = document.querySelector('#btn-save-edit');
let exampleModal = document.querySelector('#exampleModal');

let list = document.querySelector("#contact-list");

btnAdd.addEventListener("click", async function () {
  let obj = {
    name: name.value,
    mail: mail.value,
    image: image.value,
  };
  // проверка на заплненнность полей
  if (
    !obj.name.trim() ||
    !obj.mail.trim() ||
    !obj.image.trim()
  ) {
    alert("Fill the area!");
    return;
  }
  await fetch(API, {
    method: "POST", // указываем метод запроса
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });
  // очищаем инпуты после добавления
  name.value = "";
  mail.value = "";
  image.value = "";

  render();
});

// отображение карточек

async function render() {
  let contact = await fetch(API) // отправляем GET запрос
    .then((res) => res.json()) // переводим в JSON формат
    .catch((err) => console.log(err)); // отллавливаем ошибку

  list.innerHTML = "";
  contact.forEach((element) => {
    let newElem = document.createElement("div");
    newElem.id = element.id;

    newElem.innerHTML = `<div class="card m-5" style="width: 18rem;">
        <img src=${element.image} class="card-img-top" alt="Image">
        <div class="card-body">
          <h5 class="card-title">${element.name}</h5>
          <p class="card-text">${element.mail} $</p>
          <a href="#" id="${element.id}" onclick = 'deleteProduct (${element.id})' class="btn btn-dark btn-delete">Delete</a>
          <a href="#" id=${element.id} class="btn btn-dark btn-edit" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</a>
        </div>
      </div>`;

    list.append(newElem);
  });
}
render();

//! удаление
// document.addEventListener("click", (e) => {
//   if (e.target.classList.contains("btn-delete")) {
//     let id = e.target.id;
//     fetch(`${API}/${id}`, { method: "DELETE" }).then(() => render());
//   }
// });

function deleteProduct(id){
    fetch(`${API}/${id}`, { method: "DELETE" }).then(() => render());
  };

//   !

document.addEventListener('click', function(e){
    if(e.target.classList.contains('btn-edit')){
        let id = e.target.id;
        fetch(`${API}/${id}`).then((res) => res.json().then((data) =>{
            editName.value = data.name;
            editMail.value = data.mail;
            editImage.value = data.image;

            editSaveBtn.setAttribute('id', data.id)
        }))
    }
});

editSaveBtn.addEventListener('click', function(){
    let id = this.id; // вытаскиваем из кнопки id и ложим его в пременную
    // сохраняем значения инпутов
    let name = editName.value;
    let mail = editMail.value;
    let image = editImage.value;

    if(!name || !mail || !image) return; // проверкка на заполненность

    let editedContact = {
        name: name,
        mail: mail,
        image: image
    };

    saveEdit(editedContact, id)
});

function saveEdit(editedContact, id){
    fetch(`${API}/${id}`, {
        method: 'PATCH',
        headers:{
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(editedContact)
    }).then(() =>{
        render();
    });
    let modal = bootstrap.Modal.getInstance(exampleModal);
    modal.hide()
}