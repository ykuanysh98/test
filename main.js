import getList from './src/api/get-list';
import SvbTable from './src/components/svb-table/SvbTable';
import './src/scss/main.scss';

const request = getList();
const tableWrapper = document.querySelector('#table-wrapper');
const createButton = document.getElementById('create-row'); // "Создат" кнопкасы
const deleteButton = document.getElementById('delete-row'); // "Удалит" кнопкасы
const pinButton = document.getElementById('pin-row'); // "Закрепит" кнопкасы
const unpinButton = document.getElementById('unpin-row'); // "Закрепит" кнопкасы

request.then((response) => {
    const { settings, columns, rows } = response;
    
    const svbTable = new SvbTable(settings, columns);

    svbTable.loadRows(rows);

    tableWrapper.appendChild(svbTable.element);

    createButton.addEventListener('click', () => {
        svbTable.addRow(rows);
    });

    deleteButton.addEventListener('click', () => {
        svbTable.removeRow();
    });

    pinButton.addEventListener('click', () => {
        svbTable.pinRow();
    });

    unpinButton.addEventListener('click', () => {
        svbTable.unpinRow();
    });

    svbTable.setValue(['89326d90-fd15-4070-a8a0-538e2c9dd386', 'docdate', '500000']);
    
    const contractor = svbTable.getValue(['89326d90-fd15-4070-a8a0-538e2c9dd386', 'sum']);

    console.log('ответь getValue(): ', contractor);
    // Пример использования после создания таблицы
    svbTable.pinFirstColumn();

    console.log(response);
});
