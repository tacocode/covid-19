google.charts.load('current', {
    'packages': [
        'bar',
        'table'
    ]
});

let jsonData = null;

fetch('https://coviddata.github.io/covid-api/v1/countries/stats.json?v=' + Date.now())
    .then(res => res.json())
    .then((out) => {
        jsonData = out;
        google.charts.setOnLoadCallback(drawTable);
    })
    .catch(err => {
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
    const table = new google.visualization.Table(document.getElementById('table_div'));
    table.draw(data, {
        showRowNumber: true,
        width: '100%',
        height: '100%',
        sortAscending: false,
        sortColumn: 1,
    });
}
