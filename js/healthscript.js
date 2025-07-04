/*$(function(){
    $('#checkBtn').on('click', function () {
        const height = parseFloat($('#height').val());
        const weight = parseFloat($('#weight').val());
        const $resultBox = $('#resultBox');
  
        if (!height || !weight || height <= 0 || weight <= 0) {
            $resultBox.text('올바른 값을 입력해주세요.');
            return;
        }
  
        const bmi = weight / Math.pow(height / 100, 2);
        let category = '';
  
        if (bmi < 18.5) category = '저체중';
        else if (bmi < 23) category = '정상';
        else if (bmi < 25) category = '과체중';
        else if (bmi < 30) category = '비만';
        else category = '고도비만';
  
        $resultBox.html(`당신의 BMI는 <strong>${bmi.toFixed(1)}</strong>이며, <strong>${category}</strong>입니다.`);
    });
})*/

let bmiHistory = [];

$(function(){
    $('#checkBtn').on('click', function () {
      const height = parseFloat($('#height').val());
      const weight = parseFloat($('#weight').val());
      const $resultBox = $('#resultBox');
      const $pointer = $('#bmiPointer');
  
      if (!height || !weight || height <= 0 || weight <= 0) {
        $resultBox.text('올바른 값을 입력해주세요.');
        $pointer.hide();
        return;
      }
  
      const bmi = weight / Math.pow(height / 100, 2);
      let category = '';
      let index = 0;
  
      if (bmi < 18.5)       { category = '저체중'; index = 0; }
      else if (bmi < 23)    { category = '정상'; index = 1; }
      else if (bmi < 25)    { category = '비만전단계'; index = 2; }
      else if (bmi < 30)    { category = '1단계 비만'; index = 3; }
      else if (bmi < 35)    { category = '2단계 비만'; index = 4; }
      else                 { category = '3단계 비만'; index = 5; }
  
      $resultBox.html(`당신의 BML는 <strong>${bmi.toFixed(1)}</strong>로 <strong>${category}</strong>입니다.`);
  
      const stageWidth = $('.bmi-stage').eq(0).outerWidth();
      const left = index * stageWidth + stageWidth / 2 - 10; // 가운데로 조정
      $pointer.css('left', left + 'px').show();
      $(".bmi-pointer").stop().show();

      // 기록 저장 및 차트 그리기
      bmiHistory.push(bmi.toFixed(2));
      if (bmiHistory.length > 7) {
        bmiHistory.shift(); // 가장 오래된 값 제거
      }
      
      updateChart();
    });
  }
);

let bmiChart;

function updateChart() {
    const ctx = document.getElementById('bmiChart').getContext('2d');
    const labels = bmiHistory.map((_, index) => `${index + 1}회차`);

    if (bmiChart) {
        bmiChart.data.labels = labels;
        bmiChart.data.datasets[0].data = bmiHistory;
        bmiChart.update();
    } else {
        bmiChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'BMI 기록',
                    data: bmiHistory,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}


function drawChart() {
    const canvas = document.getElementById('bmiChart');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(40, 10);
    ctx.lineTo(40, 280);
    ctx.lineTo(580, 280);
    ctx.stroke();

    const barWidth = 50;
    const gap = 20;
    for (let i = 0; i < bmiHistory.length; i++) {
        const value = parseFloat(bmiHistory[i]);
        const height = value * 10;
        ctx.strokeRect(50 + i * (barWidth + gap), 280 - height, barWidth, height);
        ctx.fillText(`${i + 1}회`, 60 + i * (barWidth + gap), 295);
    }
}
  