//All elements select
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");
const datePicker = document.querySelector("#dateCalendar");
const headerOfCalendar = document.querySelector("#calendarTitle");
const daysOfCalendar = document.querySelectorAll("#calendarDays");
const calendarDays = document.querySelector(".container-fluid");
const dateOfTodo = document.querySelector("#date");
let today = new Date();
const calendarTable = document.querySelector("#calendarTable");

eventListeners();
// All eventlisteners
function eventListeners() {
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);
    datePicker.addEventListener("change", datePickerCal);
    calendarTable.addEventListener("click", detailTodos);
}

window.onload = onLoadDateCalendar(); // that works for actual month and year of calendar.
function onLoadDateCalendar() {
    var numbers;
    var a;
    if (today.getMonth() < 9) {
        numbers = today.getMonth() + 1;
        a = "0" + numbers;
    } else {
        a = today.getMonth() + 1;
    }
    datePicker.value = String(today.getFullYear() + "-" + a);
    datePickerCal();
}

function showCalendar(month, year) {
    let selectedYear = new Date(year, month);
    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    let tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filing data about month and in the page via DOM.
    //monthAndYear.innerHTML = months[month] + " " + year;
    //selectYear.value = year;
    //selectMonth.value = month;

    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            } else if (date > daysInMonth) {
                break;
            } else {
                let cell = document.createElement("td");
                let selectedDate;
                if (date < 10) {
                    selectedDate = "0" + date
                } else {
                    selectedDate = date;
                }
                let cellText = document.createTextNode(selectedDate);
                let arrayMonth = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
                cell.id = selectedYear.getFullYear() + "-" + arrayMonth[selectedYear.getMonth()] + "-" + selectedDate;
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.className = "bg-primary";
                }
                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            }

        }

        tbl.appendChild(row); // appending each row into calendar body.

    }
    getCalendarTodo();
}

function getCalendarTodo() {
    var todosDate = localStorage.getItem("dateTodo").split('"');
    var calendarTr = document.getElementById("calendar-body").children
    var todos = localStorage.getItem("todos").split('"');

    for (let i = 0; i < todosDate.length; i++) {
        for (let a = 0; a < calendarTr.length; a++) {
            for (let b = 0; b < calendarTr[a].children.length; b++) {
                if (calendarTr[a].children[b].id === todosDate[i]) {
                    var p = document.createElement("a");
                    p.className = "d-block p-1 pl-2 pr-2 mb-1 rounded text-truncate small bg-success text-white";
                    //p.style.fontSize = "0.5rem"
                    p.innerHTML = todos[i];
                    calendarTr[a].children[b].appendChild(p);

                }
            }
        }
    }
}

function detailTodos(e) {
    if (e.target.className === "d-block p-1 pl-2 pr-2 mb-1 rounded text-truncate small bg-success text-white") {

        Swal.fire({
            title: e.target.innerHTML,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Tamamland??.',
            denyButtonText: `Kapat.`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                const liElement = document.getElementsByTagName("li");
                for (let i = 0; i < liElement.length; i++) {
                    if (e.target.innerHTML === liElement[i].innerText) {
                        deleteTodoFromStorage(liElement[i].innerText);
                        liElement[i].remove();
                        datePickerCal();
                    }
                }
                Swal.fire('Tebrikler!', '', 'success')
            }
        })

    }
}

function selectedCalendarTitle() {
    const months = ["0.Ay", "Ocak", "??ubat", "Mart", "Nisan", "May??s", "Haziran", "Temmuz", "A??ustos", "Eyl??l", "Ekim", "Kas??m", "Aral??k"];
    const selectedMonth = datePicker.value
    const result = selectedMonth.substr(5, 2);

    var b = "";
    if (result.substr(0, 1) === "0") {
        b = result.substr(1, 1);
    } else {
        b = result.substr(0, 2);
    }

    const resultMonth = months[b];
    const resultYear = selectedMonth.substr(0, 4);
    const datePickerSelected = resultMonth + " " + resultYear
    headerOfCalendar.innerHTML = datePickerSelected;
}

function datePickerCal() {
    selectedCalendarTitle()
    const months = ["Ocak", "??ubat", "Mart", "Nisan", "May??s", "Haziran", "Temmuz", "A??ustos", "Eyl??l", "Ekim", "Kas??m", "Aral??k"];
    const selectedMonth = datePicker.value
    const result = selectedMonth.substr(5, 2);

    var monthData = "";
    if (result.substr(0, 1) === "0") {
        monthData = result.substr(1, 1);
    } else {
        monthData = result.substr(0, 2);
    }

    const resultYear = selectedMonth.substr(0, 4);

    showCalendar(monthData - 1, resultYear);

}

// TIME QUALIFICATION & MONTH OF THE CALENDAR 

function setTime() { // Todo listin ??st??ne gelen saat k??sm??
    const timeOfDiv = document.querySelector(".clockTime");
    const time = new Date();

    const year = time.getFullYear();
    const months = ["Ocak", "??ubat", "Mart", "Nisan", "May??s", "Haziran", "Temmuz", "A??ustos", "Eyl??l", "Ekim", "Kas??m", "Aral??k"];
    let month = months[time.getMonth()];
    const day = time.getDate();
    const hour = time.getHours();
    const min = time.getMinutes();
    const sec = time.getSeconds();

    const nowDate = day + " " + month + " " + year + " " + hour + ":" + min + ":" + sec

    timeOfDiv.innerHTML = nowDate;

}
setInterval(() => {
    setTime();
}, 1000);

window.onload = calendarTitle(); // Ekran ilk a????ld??????nda ??al??????r 

function calendarTitle() {
    const updateCalendar = new Date();
    const months = ["Ocak", "??ubat", "Mart", "Nisan", "May??s", "Haziran", "Temmuz", "A??ustos", "Eyl??l", "Ekim", "Kas??m", "Aral??k"];
    let month = months[updateCalendar.getMonth()];
    const year = updateCalendar.getFullYear();
    const nowCalendar = month + " " + year
    headerOfCalendar.innerHTML = nowCalendar;
}

//B??T??N TODOLARI S??LME -BUTONA ??ZELL??K EKLEME
function clearAllTodos(e) {
    // Aray??zden todo kald??rma
    if (confirm("T??m??n?? siliyor musu canom?")) {
        // todoList.innerHTML = ""; // yava?? olan y??ntem

        while (todoList.firstElementChild != null) /*nulle e??it de??ilse demek */ {
            todoList.removeChild(todoList.firstElementChild);
        }

        localStorage.removeItem("todos");
        localStorage.removeItem("dateTodo");
    }
}

//F??LTRELEME ??ZELL??????
function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase(); // her ??ey k??????k harf olur
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem) { // li elementlerinde tek tek gezinebilmek i??in
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filterValue) === -1) {
            //bulamad?? "indexOf" aranan verinin indexini d??ner bulursa index 1-2... artar, bulamazsa -1 d??enr
            listItem.setAttribute("style", "display: none !important");
        } // yapt??k ama aray??zde bunlar filtrelemede kaybolmad?? sebep: d-flex ??zelli??i boostraptan kaynakl?? display none olarak ??al??????yor JS ile bunu iptal edip kendi display ??zelli??imizi s??ylicez
        else {
            listItem.setAttribute("style", "display: block");
        }
    })
}

function deleteTodo(e) {
    if (e.target.className === "fa fa-remove") {


        Swal.fire({
            title: 'Silmek istedi??ine emin misin?',
            text: "Bu i??lemi geri alamayacaks??n.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Evet, sil.'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Silindi!',
                    'Todo silindi.',
                    'success'
                )
                deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
                e.target.parentElement.parentElement.remove();
                datePickerCal();
            }
        })
    }

}

function deleteTodoFromStorage(deletetodo) { //Localden todolar?? silmek i??in yaz??lan fonk
    let todos = getTodosFromStorage();
    let todosDate = getTodosFromStorageDate();

    todos.forEach(function(todo, index) { // array ??zerinde gezinme ve tek tek silme i??in
        if (todo === deletetodo) {
            todos.splice(index, 1); // o indexten itibaren 1 obje siler- arrayden de??er silebiliriz 
            todosDate.splice(index, 1);
        }
    });
    localStorage.setItem("todos", JSON.stringify(todos)); // locale tekrar todos arrayiin yazmam??z gerekiyor
    localStorage.setItem("dateTodo", JSON.stringify(todosDate));
}

function loadAllTodosToUI() {
    let todos = getTodosFromStorage();
    todos.forEach(function(todo) {
        addTodoUI(todo);

    })
}

function addTodo(e) {

    const newTodo = todoInput.value.trim(); //trim ba??ta ve sondaki bo??luklar?? al??r

    const dateTodo = document.querySelector("#date").value;
    const todos = JSON.parse(localStorage.getItem("todos", "dateTodo"));
    const isThatOld = false;
    if (newTodo === "") {
        /* <div class="alert alert-danger" role="alert">
                        This is a danger alert???check it out!
                      </div>  
                      bu div a??a????da dinamik olarak eklendi JS ile */

        Swal.fire('Bir todo ekleyin.');
    } else if (dateTodo === "" || dateTodo === null || dateTodo === undefined) {
        Swal.fire('Bir tarih ekleyin');
    } else {

        if (todos != null) {

            for (let i = 0; i < todos.length; i++) {
    
                
                if (newTodo === todos[i]) {
                    
                    Swal.fire('Bu todo mevcut');
                    isThatOld = true
                }
                
            }
            if(isThatOld){
                addTodoUI(newTodo);
                addTodoStorage(newTodo, dateTodo);
        
                Swal.fire('Ba??ar??l?? ??ekilde eklendi.');
            }

        } else {
            addTodoUI(newTodo);
            addTodoStorage(newTodo, dateTodo);
    
            Swal.fire('Ba??ar??l?? ??ekilde eklendi.');
        }
    }
    e.preventDefault();
    datePickerCal();
}

function getTodosFromStorage() { // Storagrdan Todolar?? al??r 
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function getTodosFromStorageDate() {
    let dateTodo;
    if (localStorage.getItem("dateTodo") === null) {
        dateTodo = [];
    } else {
        dateTodo = JSON.parse(localStorage.getItem("dateTodo"));
    }
    return dateTodo;
}

function addTodoStorage(newTodo, dateTodo) {
    let todos = getTodosFromStorage();
    todos.push(newTodo);

    let dateData = getTodosFromStorageDate();
    dateData.push(dateTodo);

    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("dateTodo", JSON.stringify(dateData));
}

function showAlert(type, message) {
    const alertmessage = document.createElement("div");
    alertmessage.className = type;
    alertmessage.innerHTML = message;

    /* <div class="alert alert-danger" role="alert">
                        This is a danger alert???check it out!
                      </div> */

    form.appendChild(alertmessage);

    //set Time Out
    setTimeout(function() {
        alertmessage.remove();
    }, 2500); // 2,5 saniye sonra yok olur 

}

function addTodoUI(newTodo) { // String de??erini li yapar

    //list item olu??turma
    const listItem = document.createElement("li");
    const divItem = document.createElement("div")
        // link olu??urma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    divItem.style.maxWidth = "15rem"
    divItem.innerHTML = newTodo;
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    listItem.className = "list-group-item d-flex justify-content-between";

    //Text Node Ekleme

    listItem.appendChild(divItem);
    listItem.appendChild(link);

    // TO do Listi  list item yapma
    todoList.appendChild(listItem);
    todoInput.value = "";
    dateOfTodo.value = "";

}