let selectedPostId = null;      // 선택된 게시글 ID

$(function () {
  loadPosts();                  // 처음 로드

  /* ───────── 글쓰기 ───────── */
  $('#write').click(function () {
    const title   = $('#title').val().trim();
    const content = $('#content').val().trim();

    if (!title || !content) {
      alert("제목과 내용을 입력하세요");
      return;
    }

    const post = {
      id: Date.now(),                  // 고유 ID
      title,
      content,
      date: new Date().toLocaleString(),
      likes: 0,
      comments: []
    };

    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.unshift(post);               // 최신글 맨 위
    localStorage.setItem('posts', JSON.stringify(posts));

    $('#title').val('');
    $('#content').val('');
    loadPosts();
  });

  /* ───────── 삭제 버튼 ───────── */
  $(".delete-btn").click(function (e) {
    e.stopPropagation();
    if (selectedPostId !== null) {
      const posts = JSON.parse(localStorage.getItem('posts')) || [];
      const updated = posts.filter(post => post.id !== selectedPostId);
      localStorage.setItem('posts', JSON.stringify(updated));
      selectedPostId = null;
      $(".delete-btn").hide();
      loadPosts();
    }
  });

  /* ───────── 여백 클릭 시 삭제버튼 숨김 ───────── */
  $(document).click(function () {
    $(".delete-btn").hide();
    selectedPostId = null;
  });
});

/* -------------------------------------------------------------------- */
/* 게시글 리스트 로드 & 이벤트 바인딩                                   */
/* -------------------------------------------------------------------- */
function loadPosts() {
  let posts = JSON.parse(localStorage.getItem('posts')) || [];

  // 추천수 순으로 정렬 (내림차순)
  posts.sort((a, b) => b.likes - a.likes);

  const $list = $('#post-list');
  $list.empty();                           // 기존 목록 비우기

  posts.forEach(post => {
    /* ───── 카드(HTML 템플릿) ───── */
    const $post = $(`
      <div class="post" data-id="${post.id}">
        <!-- 왼쪽 동그란 배지(추천수) -->
        <div class="post-badge recommend"></div>

        <!-- 본문 -->
        <div class="post-body">
          <h3 class="post-title">${post.title}</h3>
          <div class="vvv">
            <small class="post-date">${post.date}</small>
            <p class="likes">👍${post.likes}</p>
          </div>

          <input type="text" class="comment-input" placeholder="댓글 입력 (Enter)">
          <button class="open">댓글</button>
          <ul class="comment-list">
            ${post.comments.map(c =>
              `<li class="qqq">
                 <small>${typeof c === 'string' ? post.date : c.date}</small><br><br>
                 ${typeof c === 'string' ? c : c.text}
               </li>`
            ).join('')}
          </ul>
        </div>
      `);

    /* ───── 좋아요(추천) 클릭 ───── */
    $post.find('.likes').click(function (e) {
      e.stopPropagation();
      post.likes++;
      localStorage.setItem('posts', JSON.stringify(posts));
      loadPosts();                       // 다시 그려서 정렬 반영
    });

    /* ───── 댓글 입력 ───── */
    $post.find('.comment-input').keydown(function (e) {
      if (e.key === 'Enter') {
        const text = $(this).val().trim();
        if (!text) return;
    
        // 1) 로컬 데이터에 저장
        const now = new Date().toLocaleString();
        post.comments.push({ text, date: now });
        localStorage.setItem('posts', JSON.stringify(posts));
    
        // 2) 화면에 바로 추가
        $(this)
          .siblings('.comment-list')
          .append(`<li class="qqq"><small>${now}</small><br><br>${text}</li>`);
    
        // 3) 입력창 비우기
        $(this).val('');
      }
    });
    

    let isVisible = false;
  $(".open").off("click").on("click", function () {
    isVisible = !isVisible;
    $(this).siblings(".comment-list, .comment-input").toggle(isVisible);
  });
    /* ───── 게시글 클릭 → 삭제 버튼 표시 ───── */
    $post.click(function (e) {
      e.stopPropagation();
      selectedPostId = post.id;
      $(".delete-btn").show();
    });

    $list.append($post);                 // 목록에 추가
  });

  /* ───────── 팝업 토글 (글쓰기 버튼) ───────── */
  let isVisible = false;
  $(".dad").off("click").on("click", function () {
    isVisible = !isVisible;
    $(".popup").toggle(isVisible);
  });

  /* 로고·메뉴 클릭 시 팝업 닫기 */
  $(".da1").off("click").on("click", function () {
    $(".popup").hide();
  });

  /* ───────── 위/아래 스크롤 애니메이션 ───────── */
  let a = 0;
  $(".up").off("click").on("click", function () {
    a++;
    $("main").animate({ marginTop: -200 * a + "px" }, 1000);
  });
  $(".down").off("click").on("click", function () {
    a--;
    $("main").animate({ marginTop: -200 * a + "px" }, 1000);
  });
}
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

    $('main').stop().animate(
      { marginTop: -STEP * page + 'px' },
      200,
      () => { isAnimating = false; }        // 애니메이션 끝나면 해제
    );

    // 기본 스크롤 막고 싶다면
    e.preventDefault();
  });

});