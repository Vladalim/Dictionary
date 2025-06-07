fetch('https://raw.githubusercontent.com/Vladalim/phrase/refs/heads/main/lucky.json')
.then(response => response.json())
.then(data => {
    const categories = Array.from(new Set(data.map(item => item['Категория'])));
    const select = document.getElementById('categorySelect');
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });

    const visibleKeys = ['Фразеологизм', 'Значение'];

    function highlightMatches(text, search) {
        if (!search) return text;
        const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'gi');
        return text.replace(regex, match => `<span class="highlight">${match}</span>`);
    }

    function renderTableWithHighlight(filteredData, search = '') {
        const container = document.getElementById('tableContainer');
        container.innerHTML = '';
        const table = document.createElement('table');
        table.style.marginTop = '20px';

        const header = table.insertRow();
        visibleKeys.forEach(key => {
            const th = document.createElement('th');
            th.textContent = key;
            if (key === 'Фразеологизм') th.className = 'phrase-header';
            if (key === 'Значение') th.className = 'meaning-header';
            header.appendChild(th);
        });

        filteredData.forEach(item => {
            const row = table.insertRow();
            visibleKeys.forEach(key => {
                const cell = row.insertCell();
                cell.innerHTML = highlightMatches(item[key], search);
                if (key === 'Фразеологизм') cell.className = 'phrase-cell';
                if (key === 'Значение') cell.className = 'meaning-cell';
            });
        });
        container.appendChild(table);
    }

    renderTableWithHighlight(data);

    select.addEventListener('change', function() {
        const value = this.value;
        if (value === 'all') {
            renderTableWithHighlight(data, '');
        } else {
            renderTableWithHighlight(data.filter(item => item['Категория'] === value), '');
        }
    });

    const input = document.getElementById('text');
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const search = input.value.trim();
            let filteredData = data;
            const selectValue = select.value;
            if (selectValue !== 'all') {
                filteredData = data.filter(item => item['Категория'] === selectValue);
            }
            if (search) {
                filteredData = filteredData.filter(item =>
                    item['Фразеологизм'].toLowerCase().includes(search.toLowerCase()) ||
                    item['Значение'].toLowerCase().includes(search.toLowerCase())
                );
            }
            renderTableWithHighlight(filteredData, search);
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    new HystModal({
        linkAttributeName: "data-hystmodal"
    });
});

const quizUrl = 'https://raw.githubusercontent.com/Vladalim/phrase/refs/heads/main/lucky.json';

let quizData = [];
let usedIndexes = [];
let currentIdx = null;

// Получение случайного индекса, который ещё не использовался
function getRandomIdx() {
  if (usedIndexes.length === quizData.length) return null;
  let idx;
  do {
    idx = Math.floor(Math.random() * quizData.length);
  } while (usedIndexes.includes(idx));
  usedIndexes.push(idx);
  return idx;
}

// Показать карточку с фразеологизмом
function showCard(idx) {
  document.getElementById('cardFront').style.display = '';
  document.getElementById('cardBack').style.display = 'none';
  document.getElementById('phraseText').textContent = quizData[idx]['Фразеологизм'];
  document.getElementById('meaningText').textContent = quizData[idx]['Значение'];
}

function showNextCard() {
  let idx = getRandomIdx();
  if (idx === null) {
    alert('Фразеологизмы закончились!');
    closeQuizModal();
    return;
  }
  currentIdx = idx;
  showCard(idx);
}

// Открыть/закрыть модалку
function openQuizModal() {
  document.getElementById('quizModal').style.display = 'flex';
  usedIndexes = [];
  showNextCard();
}
function closeQuizModal() {
  document.getElementById('quizModal').style.display = 'none';
}

// Показываем карточку (сброс flip)
function showCard(idx) {
  document.getElementById('cardInner').classList.remove('flipped');
  document.getElementById('phraseText').textContent = quizData[idx]['Фразеологизм'];
  document.getElementById('meaningText').textContent = quizData[idx]['Значение'];
}

document.addEventListener('DOMContentLoaded', function() {
  // Загрузка данных
  fetch(quizUrl)
    .then(r => r.json())
    .then(data => { quizData = data; });

  // Открытие квиза
  document.getElementById('startQuizBtn').onclick = openQuizModal;
  document.getElementById('closeQuiz').onclick = closeQuizModal;
  document.getElementById('finishBtn').onclick = closeQuizModal;

  // Перевернуть карточку (показать значение) — ИЗМЕНЁННЫЙ КОД
  document.getElementById('flipBtn').onclick = function() {
    document.getElementById('cardInner').classList.add('flipped');
  };

  // Следующий фразеологизм
  document.getElementById('nextBtn').onclick = function() {
    showNextCard();
  };
});

