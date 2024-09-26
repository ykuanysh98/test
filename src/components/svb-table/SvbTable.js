import './styles/svb-table.scss';

export default class SvbTable {
    constructor(settings, columns) {
        this.element = null;
        this.activeRow = null;

        this.columns = columns; 
        this.settings = settings; 

        this.render();
    }

    render() {
        this.element = document.createElement('table');
        this.element.classList.add('svb-table');

        const thead = this.createTableHead();

        this.element.appendChild(thead);

        const tbody = document.createElement('tbody');

        this.element.appendChild(tbody);

        const tfoot = this.createTableFooter();

        this.element.appendChild(tfoot);
    }

    createTableHead() {
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');

        this.columns.forEach((column, index) => {
            const th = document.createElement('th');

            if (this.settings && this.settings[column] && this.settings[column].columnWidth) {
                th.style.width = `${this.settings[column].columnWidth}px`;
                th.dataset.name = this.settings[column].name;
                th.textContent = this.settings[column].represent;
                th.innerHTML = `
                    ${this.settings[column].represent}
                    <span class="icon-filter"><i class="fa fa-filter"></i></span>
                    <div class="resizer" data-column-index="${index}"></div>
                `;
            } else {
                th.style.width = '40px';
                th.textContent = '№';
                th.dataset.name = 'uuid';
                th.innerHTML = `
                    ${'№'}
                    <div class="resizer" data-column-index="${index}"></div>
                `;
                th.classList.add('fixed-col');
                th.style.backgroundColor = '#00A0E3';
            }

            this.addResizer(th, index);

            tr.appendChild(th);
        });

        thead.appendChild(tr);

        return thead;
    }

    createTableFooter() {
        const tfoot = document.createElement('tfoot');
        const tr = document.createElement('tr');

        this.columns.forEach((column) => {
            const td = document.createElement('td');

            if (this.settings && this.settings[column] && this.settings[column].columnWidth) {
                td.style.width = `${this.settings[column].columnWidth}px`;
                td.textContent = this.settings[column].represent;
            } else {
                td.style.width = '40px';
                td.textContent = '№';
                td.classList.add('fixed-col');
                td.style.backgroundColor = '#00A0E3';
            }

            td.style.color = 'white';

            tr.appendChild(td);
        });

        tfoot.appendChild(tr);

        return tfoot;
    }
 
    createTableBody(row, index) {
        const tbody = this.element.querySelector('tbody');
        const tr = document.createElement('tr');

        tr.dataset.uuid = row[0];

        row.forEach((cell, i) => {
            const td = document.createElement('td');

            if (i === 0) {
                td.style.width = '40px';
                td.textContent = index;
                td.classList.add('fixed-col');

            } else if (this.settings[this.columns[i]]) {
                td.style.width = `${this.settings[this.columns[i]].columnWidth}px`;

                if (this.columns[i] === 'contract'){
                    td.style.color = '#00A0E3';
                    td.style.textDecoration = 'underline';
                }

                td.textContent = (typeof cell === 'object' && cell !== null && cell.hasOwnProperty('r')) 
                    ? cell.r 
                    : cell;
            }

            tr.appendChild(td);
        });

        tr.dataset.uuid = row[0];
        tr.addEventListener('click', () => this.getActiveRow(tr));

        tbody.appendChild(tr);
    }

    loadRows(rows) {
        const tbody = this.element.querySelector('tbody');

        tbody.innerHTML = '';

        rows.forEach((row, i) => {
            this.createTableBody(row, i);
        });
    }

    addRow(rows) {
        let tempRows;

        if(!tempRows) {
            tempRows = rows
        }

        const newRow = [
            `${crypto.randomUUID()}`,
            `${new Date().toISOString()}`,
            { v: 'new-attachment', r: `Приложение №${tempRows.length}` },
            { v: 'new-contract', r: `Договор №${tempRows.length}` },
            { v: 'new-project', r: `Проект №${tempRows.length}` },
            { v: 'new-contractor', r: `TОО Подрядчик N${tempRows.length}` },
            'NКБN',
            { v: 'new-job', r: `Работы ${tempRows.length}` },
            `${ Math.floor(Math.random() * 100000) + 250000 }`,
            `${ Math.floor(Math.random() * 100000) + 310000 }`,
            `${20 + tempRows.length} д.`
        ];

        this.createTableBody(newRow, tempRows.length);
        tempRows.push(newRow);
    }

    removeRow() {
        if (this.activeRow) {
            this.activeRow.remove();
            this.activeRow = null; 
        } else {
            alert('Нет выбронный элемент')
        }
    }

    getActiveRow(row) {
        if (this.activeRow === row) {
            this.activeRow.classList.remove('active-row');
            this.activeRow = null;

        } else if (this.activeRow) {
            this.activeRow.classList.remove('active-row');
            this.activeRow = row;
            this.activeRow.classList.add('active-row');

        } else {
            this.activeRow = row;
            this.activeRow.classList.add('active-row');
        }
    }

    setValue([uuid, columnIndexOrName, value]) {
        const row = this.element.querySelector(`tr[data-uuid="${uuid}"]`);

        if (!row) return;

        let cellIndex;

        if (typeof columnIndexOrName === 'string') {
            cellIndex = this.columns.indexOf(columnIndexOrName);
        } else {
            cellIndex = columnIndexOrName; 
        }

        if (cellIndex === -1 || cellIndex >= row.children.length) return; // Если индекс неверный

        const cell = row.children[cellIndex];

        cell.textContent = value;
    }

    getValue([uuid, columnIndexOrName]) {
        const row = this.element.querySelector(`tr[data-uuid="${uuid}"]`);

        if (!row) return null; 

        let cellIndex;

        if (typeof columnIndexOrName === 'string') {
            cellIndex = this.columns.indexOf(columnIndexOrName);
        } else {
            cellIndex = columnIndexOrName; 
        }

        if (cellIndex === -1 || cellIndex >= row.children.length) return null; // Если индекс неверный

        const cell = row.children[cellIndex];

        return cell.textContent;
    }
    
    addResizer(th, index) {
        const resizer = th.querySelector('.resizer');
        let startX, startWidth;

        resizer.addEventListener('mousedown', (e) => {
            startX = e.pageX;
            startWidth = th.offsetWidth;

            document.addEventListener('mousemove', resizeColumn);
            document.addEventListener('mouseup', stopResize);
        });

        const resizeColumn = (e) => {
            const newWidth = startWidth + (e.pageX - startX);

            th.style.width = `${newWidth}px`;

            let startWidths = this.element.querySelectorAll('tr');

            startWidths.forEach((row)=> {
                row.children[index].style.width = `${newWidth}px`;
            })
        };

        const stopResize = () => {
            document.removeEventListener('mousemove', resizeColumn);
            document.removeEventListener('mouseup', stopResize);
        };
    }

    pinRow() {
        if (this.activeRow) {            
            this.activeRow.classList.add('active-pin');
            this.activeRow = null;
            this.activeRow.classList.remove('active-row');
        } else {
            alert('Нет выбронный элемент')
        }
    }

    unpinRow() {
        if (this.activeRow && this.activeRow.classList.contains('active-pin')) {       
            this.activeRow.classList.remove('active-pin');
            this.activeRow.classList.remove('active-row');
            this.activeRow = null;
        } else {
            alert('Это элемент не закреплено')
        }
    }

    static createElement(tagname, id = null, classList = null, innerHTML = null) {
        const element = document.createElement(tagname);

        if (id) element.id = String(id);

        if (classList) {
            const classNames = classList.split(' ');

            classNames.forEach((name) => {
                element.classList.add(name);
            });
        }

        if (innerHTML) element.innerHTML = innerHTML;

        return element;
    }
}
