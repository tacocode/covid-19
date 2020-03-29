google.charts.load('current', {
    'packages': [
        'bar',
        'table'
    ]
});

const dataUrl = 'https://coviddata.github.io/coviddata/v1/countries/stats.json';
const tableDiv = document.getElementById('table_div');
let jsonData = null;

fetch(`${dataUrl}?v=${Date.now()}`)
    .then(res => res.json())
    .then((out) => {
        jsonData = out;
        google.charts.setOnLoadCallback(drawTable);
    })
    .catch(err => {
        tableDiv.innerHTML = `<span class="error">Could no load data (${err.message})</span>`;
        throw err
    });

function drawTable() {
    let data = new google.visualization.DataTable();
    data.addColumn('string', 'Country');
    data.addColumn('number', 'Active');
    data.addColumn('number', 'Confirmed');
    data.addColumn('number', 'Recovered');
    data.addColumn('number', 'Deceased');

    let countryData = [];

    jsonData.forEach((country, idx) => {
        let lastDate = country.dates[Object.keys(country.dates)[Object.keys(country.dates).length - 1]];
        countryData.push([
            country.country.name,
            lastDate.cumulative.cases - (lastDate.cumulative.recoveries + lastDate.cumulative.deaths),
            lastDate.cumulative.cases,
            lastDate.cumulative.recoveries,
            lastDate.cumulative.deaths
        ])
    });

    data.addRows(countryData);
    const table = new google.visualization.Table(tableDiv);
    table.draw(data, {
        showRowNumber: true,
        width: '100%',
        height: '100%',
        sortAscending: false,
        sortColumn: 1,
    });
}
