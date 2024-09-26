import getList from './src/api/get-list';
import SvbTable from './src/components/svb-table/SvbTable';
import './src/scss/main.scss';

const request = getList();
const tableWrapper = document.querySelector('#table-wrapper');

const createButton = document.getElementById('create-row');
const deleteButton = document.getElementById('delete-row');
const pinButton = document.getElementById('pin-row');
const unpinButton = document.getElementById('unpin-row');

request.then((response) => {
    const { settings, columns, rows } = response;
    
    const svbTable = new SvbTable(settings, columns);

    svbTable.loadRows(rows);

    tableWrapper.appendChild(svbTable.element);

    // Добавить элемент 
    createButton.addEventListener('click', () => {
        svbTable.addRow(rows);
    });

    // Удалить элемент 
    deleteButton.addEventListener('click', () => {
        svbTable.removeRow();
    });

    // Закрепить столбец
    pinButton.addEventListener('click', () => {
        svbTable.pinRow();
    });

    // Открепить столбец
    unpinButton.addEventListener('click', () => {
        svbTable.unpinRow();
    });

    // Установки значения в конкретной ячейке 
    svbTable.setValue(['89326d90-fd15-4070-a8a0-538e2c9dd386', 'docdate', '500000']);
    
    // Получения значения из конкретной ячейки 
    const contractor = svbTable.getValue(['89326d90-fd15-4070-a8a0-538e2c9dd386', 'sum']);

    console.log('ответь getValue(): ', contractor);

});
