$(function(){
    let i=0;
    function slide(){
        if(i<2){
            i++;
        }else{
            i=0;
        }
        $(".slide>ul").animate({marginLeft:-100 * i + "%"}, 1000);
    }
    setInterval(slide, 3000);
    
    $(".login").click(function(){
        $(".popupL").stop().show();
    })
    $(".membership").click(function(){
        $(".popupN").stop().show();
    })
    $(".close").click(function(){
        $(".popupL, .popupN").stop().hide();
    })

    //추천검색어
    const suggestions = [
        "추천1", "추천2", "추천3", "추천4", "추천5", "추천6",
        "추천7", "추천8", "추천9", "추천10", "추천11", "추천12",
        "추천13", "추천14", "추천15", "추천16", "추천17", "추천18"
    ];

    function getRandomSuggestions(arr, count) {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    
    const selected = getRandomSuggestions(suggestions, 3);
    
    const $suggestBox = $(".search-suggestions");
    const $searchInput = $(".search-box input");
    
    selected.forEach(text => {
      const $item = $(`<a href="#">${text}</a>`);
      $item.on("click", function () {
        $searchInput.val(text); // 클릭하면 input에 값 넣기
      });
      $suggestBox.append($item);
    });

    //검색
    $('#searchForm').on('submit', function(e){
        e.preventDefault();
        const query = $('#searchInput').val().trim();
        if (!query) {
            alert('검색어를 입력하세요.');
            return;
        }
        const url = 'https://www.google.com/search?q=' + encodeURIComponent(query);
        location.href = url; // 현재 페이지를 구글 검색결과로 이동
    });
})