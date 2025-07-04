
$(function(){
    let i=0;
    let currentDay = null; // 이 줄 추가!
    let currentItem = null; //운동 추가하기 기능

    function slide(){
        if(i<4){
            i++;
        }else{
            i=0;
        }

        $(".slide>ul").animate({marginTop:-150*i}, 1000);
    }
    setInterval(slide, 3000);

    $(".clickmap").click(function(){
        const cls = $(this).attr("class").split(' ')[1]; // ex: "Mon", "Tue" 등
        currentDay = cls; // ✅ 꼭 필요
        $(`.${cls}Map`).stop().show();
        renderPlans(cls);
        currentExerciseName = null;
    });
    
    // 팝업 닫기 (공통 close 클래스 처리)
    $(".close button").click(function(){
        if(currentDay){
            $(`.${currentDay}Map`).stop().hide();
            currentDay = null;
            currentExerciseName = null;
        }
    });

    $(document).on("click", ".exerciseButton", function(){
        const exerciseName = $(this).data("exercise");

        if (currentItem && currentItem.data("name") === exerciseName) {
            // 같은 버튼 연속 클릭: 회차 증가
            let countSpan = currentItem.find("span");
            let count = parseInt(countSpan.text().replace("회", ""));
            count++;
            countSpan.text(`${count}회`);
        } else {
            // 다른 버튼 클릭: 새로운 항목 생성
            let newItem = $(`
                <div class="exerciseItem" data-name="${exerciseName}">
                    ${exerciseName} <span>1회</span>
                    <button class="helpBtn">자세히</button>
                    <button class="deleteBtn">❌</button>
                </div>
            `);
            $(`.${currentDay}Map .backgroundArea`).append(newItem);
            currentItem = newItem;
        }
        savePlans(currentDay);
    });

    // ❌ 삭제 버튼 클릭 시 항목 제거
    $(".backgroundArea").on("click", ".deleteBtn", function(){
        const item = $(this).closest(".exerciseItem");
        // 현재 활성 항목이 삭제되는 경우 초기화
        if (item.is(currentItem)) {
            currentItem = null;
        }
        item.remove();
        savePlans(currentDay);
    });
    
    // 전체 삭제 버튼 기능
    $(".clearAllButton").click(function() {
        $(`.${currentDay}Map .backgroundArea`).empty(); // 모든 운동 항목 삭제
        currentItem = null; // 현재 활성 항목 초기화
        savePlans(currentDay);
    });

    // 운동명 → 유튜브 영상 정보 매핑
    const videoData = {
        ex1: {
            thumbnail: "https://img.youtube.com/vi/영상ID/mqdefault.jpg",
            link: "https://www.youtube.com/watch?v=iNdDN4GKtHk"
        },
        ex2: {
            thumbnail: "https://img.youtube.com/vi/영상ID2/mqdefault.jpg",
            link: "https://www.youtube.com/watch?v=영상ID2"
        },
        // 필요한 만큼 추가
    };
    
    // 도움말 팝업 여는 이벤트 (동적 생성될 때마다 연결 필요)
    $(".backgroundArea").on("click", ".helpBtn", function(){
        const exerciseName = $(this).closest(".exerciseItem").data("name");
        const data = videoData[exerciseName];
        
        if (data) {
            $(".videoThumbnail").attr("src", data.thumbnail);
            $(".videoLink").attr("href", data.link);
            $(".helpPopup").fadeIn();
        } else {
            alert("해당 운동의 도움말 정보가 없습니다.");
        }
    });

    // 요일별 계획 저장 함수
    function savePlans(day) {
        const $area = $(`.${day}Map .backgroundArea`);
        const plans = [];

        $area.find(".exerciseItem").each(function () {
            const name = $(this).data("name");
            const count = parseInt($(this).find("span").text().replace("회", ""));
            plans.push({ name, count });
        });
    
        localStorage.setItem(`plan_${day}`, JSON.stringify(plans));
    }
    
    // 요일별 계획 불러오기 함수
    function renderPlans(day) {
        const saved = localStorage.getItem(`plan_${day}`);
        const $area = $(`.${day}Map .backgroundArea`);
        $area.empty();
    
        if (saved) {
            const plans = JSON.parse(saved);
            plans.forEach(plan => {
                const newItem = $(`
                    <div class="exerciseItem" data-name="${plan.name}">
                        ${plan.name} <span>${plan.count}회</span>
                        <button class="helpBtn">자세히</button>
                        <button class="deleteBtn">❌</button>
                    </div>
                `);
                $area.append(newItem);
            });
        }
    }
    
    
    // 닫기 버튼
    $(".helpCloseBtn").click(function(){
        $(".helpPopup").fadeOut();
    });
    
})

