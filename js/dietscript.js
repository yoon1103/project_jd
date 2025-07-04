let meals = []; // 기존 const → let 으로 변경

const foodDB = {
  '닭가슴살': { kcal: 165, protein: 31, carb: 0, fat: 3.6 },
  '고구마': { kcal: 86, protein: 1.6, carb: 20, fat: 0.1 },
  '바나나': { kcal: 89, protein: 1.1, carb: 23, fat: 0.3 },
  '계란': { kcal: 155, protein: 13, carb: 1.1, fat: 11 },
  '두부': { kcal: 76, protein: 8, carb: 1.9, fat: 4.8 },
  '밥': { kcal: 130, protein: 2.7, carb: 28, fat: 0.3 },
  '아보카도': { kcal: 160, protein: 2, carb: 9, fat: 15 }
};

function addMeal() {
  const meal = document.getElementById("meal").value.trim();
  const weight = parseFloat(document.getElementById("weight").value);
  const caloriesInput = parseFloat(document.getElementById("calories").value);

  if (!meal) {
    alert("음식명을 입력하세요.");
    return;
  }

  let entry = { meal: weight ? `${meal} (${weight}g)` : meal, calories: 0, protein: 0, carb: 0, fat: 0 };

  if (!isNaN(weight) && foodDB[meal]) {
    const info = foodDB[meal];
    const factor = weight / 100;
    entry.calories = parseFloat((info.kcal * factor).toFixed(1));
    entry.protein = parseFloat((info.protein * factor).toFixed(1));
    entry.carb = parseFloat((info.carb * factor).toFixed(1));
    entry.fat = parseFloat((info.fat * factor).toFixed(1));
  } else if (!isNaN(caloriesInput)) {
    entry.calories = caloriesInput;
  } else {
    alert("무게 또는 칼로리 중 하나를 정확히 입력해주세요.");
    return;
  }

  meals.push(entry);
  saveMeals(); // ✅ 저장

  document.getElementById("meal").value = "";
  document.getElementById("weight").value = "";
  document.getElementById("calories").value = "";

  renderMeals();
}

function removeMeal(index) {
  meals.splice(index, 1);
  saveMeals(); // ✅ 저장
  renderMeals();
}

function renderMeals() {
  const list = document.getElementById("mealList");
  list.innerHTML = "";

  let totalCal = 0, totalProtein = 0, totalCarb = 0, totalFat = 0;
  meals.forEach((item, index) => {
    totalCal += item.calories;
    totalProtein += item.protein || 0;
    totalCarb += item.carb || 0;
    totalFat += item.fat || 0;

    const div = document.createElement("div");
    div.className = "meal-item";
    div.innerHTML = `${item.meal} - ${item.calories} kcal <button onclick="removeMeal(${index})">삭제</button>`;
    list.appendChild(div);
  });

  document.getElementById("totalCalories").innerText = `총 칼로리: ${totalCal.toFixed(1)} kcal`;
  document.getElementById("totalMacros").innerText =
    `단백질: ${totalProtein.toFixed(1)}g, 탄수화물: ${totalCarb.toFixed(1)}g, 지방: ${totalFat.toFixed(1)}g`;

  renderChart(totalProtein, totalCarb, totalFat);
}

// ✅ localStorage에 저장
function saveMeals() {
  localStorage.setItem("meals", JSON.stringify(meals));
}

// ✅ localStorage에서 불러오기
function loadMeals() {
  const stored = localStorage.getItem("meals");
  if (stored) {
    meals = JSON.parse(stored);
  }
}

function renderChart(protein, carb, fat) {
  const ctx = document.getElementById('nutritionChart').getContext('2d');

  if (window.nutritionChart instanceof Chart) {
    window.nutritionChart.destroy();
  }

  window.nutritionChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['단백질', '탄수화물', '지방'],
      datasets: [{
        label: '영양소(g)',
        data: [protein, carb, fat],
        backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
        borderColor: ['#388e3c', '#1976d2', '#f57c00'],
        borderWidth: 1,
        borderRadius: 10,
        barPercentage: 0.6,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function toggleChart() {
  const chartDiv = document.getElementById("chartArea");
  chartDiv.style.display = chartDiv.style.display === "none" ? "block" : "none";
}

window.onload = function () {
  loadMeals();     // ✅ 저장된 데이터 불러오기
  renderMeals();   // ✅ 화면에 출력
};

let isVisible = false;
$(".goat").click(function(){
  isVisible= !isVisible;
  $(".container").toggle(isVisible);
});
let a = 0;
$(".up").click(function () {
  a++;
  $(".container").animate({ marginTop: -200 * a + "px" }, 1000);
});
$(".down").click(function () {
  a--;
  $(".container").animate({ marginTop: -200 * a + "px" }, 1000);
});

$(function () {

  /* 1) 한 번만 선언해 두는 전역 변수 */
  let page = 0;             // 현재 위치(몇 칸 내려갔는지)
  const STEP = 100;         // 한 번에 이동할 px
  let isAnimating = false;  // 애니메이션 중 중복 입력 방지

  /* 2) 휠 이벤트 */
  $(window).on('wheel', function (e) {
    if (isAnimating) return;                // 진행 중이면 무시
    isAnimating = true;

    const dir = e.originalEvent.deltaY > 0 ? 1 : -1;  // 1=아래, -1=위
    page += dir;

    // 필요하면 page 최소·최대값 제한
    // page = Math.max(0, Math.min(maxPage, page));

    $('.container').stop().animate(
      { marginTop: -STEP * page + 'px' },
      200,
      () => { isAnimating = false; }        // 애니메이션 끝나면 해제
    );

    // 기본 스크롤 막고 싶다면
    e.preventDefault();
  });

});
