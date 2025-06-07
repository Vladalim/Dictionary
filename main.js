document.addEventListener('DOMContentLoaded', function() {
    new HystModal({
        linkAttributeName: "data-hystmodal"
    });
});

const quizUrl = 'https://raw.githubusercontent.com/Vladalim/phrase/refs/heads/main/all.json';

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

document.getElementById('searchInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const search = encodeURIComponent(this.value.trim());
        if (search) {
            // Переходим на страницу поиска, передавая поисковый запрос через URL
            window.location.href = 'search.html?query=' + search;
        }
    }
});
