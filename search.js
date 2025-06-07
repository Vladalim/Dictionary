function getQueryParam(name) {
   const urlParams = new URLSearchParams(window.location.search);
   return urlParams.get(name) || '';
}
function highlightMatches(text, search) {
   if (!search) return text;
   const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
   const regex = new RegExp(escaped, 'gi');
   return text.replace(regex, match => `<span class="highlight">${match}</span>`);
}

const searchQuery = getQueryParam('query').trim().toLowerCase();

fetch('https://raw.githubusercontent.com/Vladalim/phrase/refs/heads/main/all.json')
.then(response => response.json())
.then(data => {
      let filtered = data.filter(item =>
         item['Фразеологизм']?.toLowerCase().includes(searchQuery) ||
         item['Значение']?.toLowerCase().includes(searchQuery)
      );
      filtered.sort((a, b) => a['Фразеологизм'].localeCompare(b['Фразеологизм']));
      renderTable(filtered, searchQuery);
});

function renderTable(filteredData, search) {
   const container = document.getElementById('tableContainer');
   container.innerHTML = '';
   if (filteredData.length === 0) {
      container.textContent = 'Ничего не найдено.';
      return;
   }
   const table = document.createElement('table');
   const header = table.insertRow();
   ['Фразеологизм', 'Значение'].forEach(key => {
      const th = document.createElement('th');
      th.textContent = key;
      header.appendChild(th);
   });
   filteredData.forEach(item => {
      const row = table.insertRow();
      const phraseCell = row.insertCell();
      phraseCell.innerHTML = highlightMatches(item['Фразеологизм'], search);
      const meaningCell = row.insertCell();
      meaningCell.innerHTML = highlightMatches(item['Значение'], search);
   
      
   });
   container.appendChild(table);
}


let allData = [];
const tableContainer = document.getElementById('tableContainer');
const localSearchInput = document.getElementById('localSearchInput');

function getQueryParam(name) {
   const urlParams = new URLSearchParams(window.location.search);
   return urlParams.get(name) || '';
}
const initialQuery = getQueryParam('query').trim().toLowerCase();

fetch('https://raw.githubusercontent.com/Vladalim/phrase/refs/heads/main/all.json')
   .then(response => response.json())
   .then(data => {
      allData = data;
      filterAndRender(initialQuery);
});

function highlightMatches(text, search) {
   if (!search) return text;
   const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
   const regex = new RegExp(escaped, 'gi');
   return text.replace(regex, match => `<span class="highlight">${match}</span>`);
}

function filterAndRender(query) {
   query = query.trim().toLowerCase();
   const filtered = allData.filter(item =>
      item['Фразеологизм']?.toLowerCase().includes(query) ||
      item['Значение']?.toLowerCase().includes(query)
   );
   renderTable(filtered, query);
}

function renderTable(filteredData, search) {
   tableContainer.innerHTML = '';
   if (!filteredData.length) {
      tableContainer.textContent = 'Ничего не найдено.';
      return;
   }
   const table = document.createElement('table');
   const header = table.insertRow();
   ['Фразеологизм', 'Значение'].forEach(key => {
      const th = document.createElement('th');
      th.textContent = key;
      header.appendChild(th);
   });
   filteredData.forEach(item => {
      const row = table.insertRow();
      const phraseCell = row.insertCell();
      phraseCell.innerHTML = highlightMatches(item['Фразеологизм'] || '', search);
      const meaningCell = row.insertCell();
      meaningCell.innerHTML = highlightMatches(item['Значение'] || '', search); 
   });
   tableContainer.appendChild(table);
}

localSearchInput.addEventListener('input', function() {
   filterAndRender(this.value);
});

