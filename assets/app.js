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
    })
    .then(() => {
        document.getElementById('loader').classList.add('d-none')
    });

function drawTable() {
    let dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Country');
    dataTable.addColumn('number', 'Active');
    dataTable.addColumn('number', 'Confirmed');
    dataTable.addColumn('number', 'Recovered');
    dataTable.addColumn('number', 'Deceased');
    dataTable.addColumn('number', 'Recovery %');
    dataTable.addColumn('number', 'Fatality %');

    let countryData = [];
    let totals = {
        cases: 0,
        recoveries: 0,
        deaths: 0,
    };

    jsonData.forEach((country, idx) => {
        let lastDate = country.dates[Object.keys(country.dates)[Object.keys(country.dates).length - 1]];
        let recoveryRate = lastDate.cumulative.recoveries / lastDate.cumulative.cases * 100;
        let fatalityRate = lastDate.cumulative.deaths / lastDate.cumulative.cases * 100;
        totals.cases += lastDate.cumulative.cases;
        totals.recoveries += lastDate.cumulative.recoveries;
        totals.deaths += lastDate.cumulative.deaths;
        countryData.push([
            country.country.name,
            lastDate.cumulative.cases - (lastDate.cumulative.recoveries + lastDate.cumulative.deaths),
            lastDate.cumulative.cases,
            lastDate.cumulative.recoveries,
            lastDate.cumulative.deaths,
            recoveryRate > 0 ? parseFloat(recoveryRate.toFixed(2)) : 0.00,
            fatalityRate > 0 ? parseFloat(fatalityRate.toFixed(2)) : 0.00,
        ]);
    });

    let recoveryRateTotal = totals.recoveries / totals.cases * 100;
    let fatalityRateTotal = totals.deaths / totals.cases * 100;

    countryData.push([
        'WORLD',
        totals.cases - (totals.recoveries + totals.deaths),
        totals.cases,
        totals.recoveries,
        totals.deaths,
        recoveryRateTotal > 0 ? parseFloat(recoveryRateTotal.toFixed(2)) : 0.00,
        fatalityRateTotal > 0 ? parseFloat(fatalityRateTotal.toFixed(2)) : 0.00,
    ]);

    dataTable.addRows(countryData);

    const table = new google.visualization.Table(tableDiv);
    table.draw(dataTable, {
        allowHTML: true,
        showRowNumber: true,
        width: '100%',
        height: '100%',
        sortAscending: false,
        sortColumn: 1,
    });
}
