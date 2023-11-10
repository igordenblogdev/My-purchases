// Переменные
const inputProduct = document.getElementById('product');
const inputPrice = document.getElementById('price');
const inputEditProduct = document.getElementById('editProduct')
const inputEditPrice = document.getElementById('editPrice')
const listShoping = document.getElementById('listShoping');
const createBtn = document.getElementById('createBtn');
const checkBtn = document.getElementById('checkBtn');
const updatePurchase = document.getElementById('updatePurchase');
const openEditModalWindow = document.getElementById('editModalPopup');
const closeEditModalWindow = document.getElementById('closeWindow');


// Функция закрытия окна
closeEditModalWindow.onclick = function() {
    openEditModalWindow.style.top = '-50%';
}


// Функцмя проверки наличия в LocalStorage
function checkLocalStorage() {
    if(localStorage.getItem('purchases') !== null) {
        renderPurchases()
    } else {
        localStorage.setItem('purchases', JSON.stringify([]));
        renderPurchases()
    }
}
checkLocalStorage()

// Функция. которая выводит записи из массива
function renderPurchases() {
    listShoping.innerHTML = '';
        if(JSON.parse(localStorage.getItem('purchases')).length === 0) {
            listShoping.innerHTML = `
                <li style="border: none; justify-content: center;">
                    <div class="text" style="width: 100%;">
                        <span
                            class="product"
                            style="
                                width: 100%;
                                text-align: center;
                                font-weight: 800; 
                            "
                        >
                            Покупки не запланированы
                        </span>
                    </div>
                </li>
        `
        }

        for(i = 0; i < JSON.parse(localStorage.getItem('purchases')).length; i++) {
            listShoping.insertAdjacentHTML(
                'beforeend',getPurchaseTemplate(
                    JSON.parse(localStorage.getItem('purchases'))[i].product,
                    JSON.parse(localStorage.getItem('purchases'))[i].price,
                    JSON.parse(localStorage.getItem('purchases'))[i].completed, i
                )
            );
        }
        countPlannedPurchases()
}
renderPurchases()


// Функция ввода новой покупки
createBtn.onclick = function() {
    // Условие на пустоту товара и цены
    if(inputProduct.value.length === 0 || inputPrice.value.length === 0) {
        return
    }

    const newPurchase = {
        product: inputProduct.value,
        price: inputPrice.value,
        completed: false
    }

    purchases = JSON.parse(localStorage.getItem('purchases'))
    purchases.push(newPurchase);
    // Сохраняем в LocalStorage
    localStorage.setItem('purchases', JSON.stringify(purchases));
    renderPurchases();
    // Очищаем поля после ввода
    inputProduct.value = '';
    inputPrice.value = '';
}

// Функция клика для нахождения определенных кнопок
listShoping.onclick = function(event) {
    if(event.target.dataset.index) {
        // создаем переменную для индекса
        const index = Number(event.target.dataset.index);
        // создаем переменную для типа кнопки
        const type = event.target.dataset.type;
        // проверяем условие на нажатие кнопки сделанной покупки
        if(type === 'check') {
            JSON.parse(localStorage.getItem('purchases'))[index].completed
            // выбираем из LocalStorage по индексу определенную покупки и проверяем на завершенность
            if( JSON.parse(localStorage.getItem('purchases'))[index].completed === false) {
                // создаем новый массив из LocalStorage
                const newArray = JSON.parse(localStorage.getItem('purchases'));
                // Меняем выполненность на противоположную
                newArray[index].completed = true
                // сохроняем в LocalStorage
                localStorage.setItem('purchases', JSON.stringify(newArray))
                // Обновляем список
                // renderPurchases()
            } else if(JSON.parse(localStorage.getItem('purchases'))[index].completed === true) {
                const newArray = JSON.parse(localStorage.getItem('purchases'));
                newArray[index].completed = false
                console.log(newArray)
                localStorage.setItem('purchases', JSON.stringify(newArray))
                // renderPurchases()
            }
            renderPurchases()
        }
        // проверяем условие на нажатие кнопки редактирования покупки
        if(type === 'edit') {
            openEditModalWindow.style.top = '50%';

            inputEditProduct.value = JSON.parse(localStorage.getItem('purchases'))[index].product;
            inputEditPrice.value = JSON.parse(localStorage.getItem('purchases'))[index].price;

            updatePurchase.onclick = function() {
                const newArray = JSON.parse(localStorage.getItem('purchases'));
                newArray[index].product = inputEditProduct.value;
                newArray[index].price = inputEditPrice.value;
                newArray[index].completed = newArray[index].completed;
                
                localStorage.setItem('purchases', JSON.stringify(newArray))
                renderPurchases();
                openEditModalWindow.style.top = '-50%';
            }
        }
        // проверяем условие на нажатие кнопки удаления покупки
        if(type === 'remove') {
            const newArray = JSON.parse(localStorage.getItem('purchases'));
            newArray.splice(index, 1);
            localStorage.setItem('purchases', JSON.stringify(newArray))
            renderPurchases();
        }
    }
} 


// Функция подсчета количество товаров (запланированных, купленных) с итоговой суммой
function countPlannedPurchases() {
        // получаем массив из LocalStorage
        plannedPurchases = JSON.parse(localStorage.getItem('purchases'));
        // console.log(plannedPurchases)
        const probas = plannedPurchases.filter(function(plannedPurchase) {
            return plannedPurchase.completed === false
            
        })
        let = sum = 0;
        // console.log(probas)
        for(i = 0 ; i < probas.length; i++) {
            
            let price = Number(probas[i].price);
            sum +=price;
            
        }
        document.getElementById('summPlannedProduct').innerHTML = `
                <span class="text">Запланировано</span>
                <span class="number"> ${probas.length}</span>
                <span class="text">на сумму</span>
                <span class="number">${sum}</span>
                <span class="text">рублей</span>
            `

        const probasTrue = plannedPurchases.filter(function(plannedPurchase) {
            return plannedPurchase.completed === true
            
        })
        let = sumTrue = 0;
        // console.log(probas)
        for(i = 0 ; i < probasTrue.length; i++) {
            
            let price = Number(probasTrue[i].price);
            sumTrue +=price;
            
        }

        document.getElementById('summAcquiredProduct').innerHTML = `
                <span class="text">Приобретено</span>
                <span class="number"> ${probasTrue.length}</span>
                <span class="text">на сумму</span>
                <span class="number">${sumTrue}</span>
                <span class="text">рублей</span>
            `
    
}
// функция получения шаблона покупки
function getPurchaseTemplate(nameProduct, priceProduct, completed, index) {
    function checkExecutionCompleted() {
       if(completed === true) {
            return `<button
                type="submit"
                id="checkBtn"
                data-index = "${index}"
                style="background: #05a380; border: 1px solid #f7f3f2"
            >
                <i
                    class='bx bx-check'
                    data-index = "${index}"
                    data-type = "check"
                >
                </i>
            </button>`
       } else {
            return `<button
                type="submit"
                id="checkBtn"
                data-index = "${index}"
                data-type = "check"
            >
            </button>`
       }
    }
    return `
    <li style="${completed ? ' background: #05a380;' : ''}">
        ${checkExecutionCompleted()}
        <div class="text" style="${completed ? 'text-decoration:line-through;color: #f7f3f2;'  : ''}">
                <span class="product">${nameProduct}</span>
                <span class="price">${priceProduct}</span>
        </div>

        <div class="actionBtn">
            <button
                type="submit"
                class="Btn"
                id="editBtn"
                style="${completed ? ' display: none' : ''}"
                
            >
                <i
                    class='bx bx-edit-alt'
                    data-index = "${index}"
                    data-type = "edit"
                ></i>
            </button>

            <button
                type="submit"
                class="Btn"
                id="deleteBtn"
            >
                <i
                    class='bx bxs-trash'
                    data-index = "${index}"
                    data-type = "remove"
                >
                </i>
            </button>
        </div>
    </li>
`
}






