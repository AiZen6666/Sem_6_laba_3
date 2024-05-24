document.addEventListener("DOMContentLoaded", function() {
    createTable(stats, 'list');
})

document.addEventListener("DOMContentLoaded", function() {
    setSortSelects(stats[0], document.getElementById("sort"));
})

searchButton.addEventListener("click", () => filterTable(stats, 'list', document.getElementById("filter")))
sortButton.addEventListener("click", () => sortTable('list', document.getElementById("sort")))
fieldsFirst.addEventListener("click", ()=> changeNextSelect('fieldsSecond', document.getElementById("fieldsFirst")))
fieldsSecond.addEventListener("click", ()=> changeNextSelect('fieldsThird', document.getElementById("fieldsSecond")))


let createTable = (data, idTable) => {
    let table = document.getElementById(idTable);

    let tr = document.createElement('tr');

    for (key in data[0]){
        let th = document.createElement('th');
        th.innerHTML = key;
        tr.append(th);
    }
    table.append(tr);

    data.forEach((item) =>{
        let tr = document.createElement('tr');

        for (key in item){
            let td = document.createElement('td');
            td.innerHTML = item[key];
            tr.append(td);
        }
        table.append(tr);
    });
}

let correspond = {
    "Nickname": "nickname",
    "Country": "country",
    "Team": "team",
    "Raiting": ["ratingFrom", "ratingTo"],
    "K/D": ["kdFrom", "kdTo"]
}

let dataFilter = (dataForm) => {

    let dictFilter = {};

    for (let j = 0; j < dataForm.elements.length; j++) {

        let item = dataForm.elements[j];

        let valInput = item.value;

        if (item.type == "text") {
            valInput = valInput.toLowerCase();
        } else if (item.type == "number"){
            if (valInput === ""){
                if (item.id.includes("From")) {
                    valInput = -Infinity; 
                } else if (item.id.includes("To")) {
                    valInput = Infinity; 
                }
            }
        }
        dictFilter[item.id] = valInput;
    }
    return dictFilter;
}

let clearTable = (idTable) => {
    let table = document.getElementById(idTable);
    if (table) {

        while (table.rows.length > 0) {
            table.deleteRow(0);
        }
    }
}

let filterTable = (data, idTable, dataForm) =>{

    let datafilter = dataFilter(dataForm);

    let tableFilter = data.filter(item => {
        let result = true;

        
        for(let key in item) {
            
            let val = item[key];

            if (typeof val == "string"){
                val = item[key].toLowerCase();
                result &&= val.indexOf(datafilter[correspond[key]])!== -1;
            } else if (typeof val == "number"){
                if (correspond[key] && correspond[key].length === 2) {
                    let from = parseFloat(datafilter[correspond[key][0]]);
                    let to = parseFloat(datafilter[correspond[key][1]]);
                    result &= val >= from && val <= to;
                }
            }
        }
        return result;
    })

    clearTable(idTable);
    createTable(tableFilter, idTable);
}


document.getElementById("clearButton").onclick = function(e) {
    e.preventDefault();
    document.getElementById(`nickname`).value = "";
    document.getElementById(`country`).value = "";
    document.getElementById(`team`).value = "";
    document.getElementById(`ratingFrom`).value = "";
    document.getElementById(`ratingTo`).value = "";
    document.getElementById(`kdFrom`).value = "";
    document.getElementById(`kdTo`).value = "";

    document.getElementById("fieldsThird").value = 0;
    document.getElementById("fieldsThird").disabled = true;
    document.getElementById("fieldsSecond").value = 0;
    document.getElementById("fieldsSecond").disabled = true;
    document.getElementById("fieldsFirst").value = 0;

    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });

    clearTable('list');
    createTable(stats, 'list');
}

let createOption = (str, val) => {
    let item = document.createElement("option");
    item.text = str;
    item.value = val;
    return item;
}

let setSortSelect = (head, sortSelect)=>{

    sortSelect.append(createOption('Нет', 0));

    for (let i in head) {
        sortSelect.append(createOption(head[i], Number(i) + 1));
    }
}

let setSortSelects = (data, dataForm) => {

    let head = Object.keys(data);
    let allSelect = dataForm.getElementsByTagName('select');
    
    for (let j = 0; j < allSelect.length; j++) {
        setSortSelect(head, allSelect[j]);
    
        if (j !== 0) {
            allSelect[j].disabled = true;
        }
    }
    
    allSelect[0].addEventListener('change', function() {
        if (this.value === '0') {
            for (let k = 1; k < allSelect.length; k++) {
                allSelect[k].disabled = true;
                allSelect[k].value = '0';
            }
        }
    });
}

let changeNextSelect = (nextSelectId, curSelect) => {

    let nextSelect = document.getElementById(nextSelectId);

    console.log(nextSelect, nextSelectId);
    nextSelect.disabled = false;
   
    nextSelect.innerHTML = curSelect.innerHTML;
   
    if (curSelect.value != 0) {
        nextSelect.remove(curSelect.value);
    } else {
        nextSelect.disabled = true;
    }
}

let createSortArr = (data) => {
    let sortArr = [];

    let sortSelects = data.getElementsByTagName('select');

    for (let i = 0; i < sortSelects.length; i++) {


        let keySort = sortSelects[i].value;

        if (keySort == 0) {
            break;
        }

        let desc = document.getElementById(sortSelects[i].id + 'Desc').checked;
        sortArr.push({column: keySort - 1, order: desc});
    }

    return sortArr;
};

let sortTable = (idTable, data) => {
    let sortArr = createSortArr(data);
    if (sortArr.length === 0) {
        return false;
    }

    let table = document.getElementById(idTable);
    
    let rowData = Array.from(table.rows);

    rowData.shift();
    
    rowData.sort((first, second) => {
        for(let i in sortArr) {
            let key = sortArr[i].column;
            let order = sortArr[i].order ? -1 : 1;

            if (first.cells[key].innerHTML > second.cells[key].innerHTML) {
                return 1 * order;
            } else if (first.cells[key].innerHTML < second.cells[key].innerHTML){
                return -1 * order;
            }
        }
        return 0;
    });

    table.innerHTML = table.rows[0].innerHTML;

    rowData.forEach(item => {
        table.append(item);
    });
}


let checkboxes = document.querySelectorAll('input[type="checkbox"]');

document.getElementById("researchButton").onclick = function(e) {
    e.preventDefault();
    document.getElementById("fieldsThird").value = 0;
    document.getElementById("fieldsThird").disabled = true;
    document.getElementById("fieldsSecond").value = 0;
    document.getElementById("fieldsSecond").disabled = true;
    document.getElementById("fieldsFirst").value = 0;
    
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });
}