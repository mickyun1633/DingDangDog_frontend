const detailTitle = document.getElementById("detailTitle");
const detailWriter = document.getElementById("detailWriter");
const detailDate = document.getElementById("detailDate");
const detailMainImg = document.getElementById("detailMainImg");
const detailMainPost = document.getElementById("detailMainPost");

const commentList = document.getElementById("commentList");
const commentWriteContainer = document.getElementById("commentWriteContainer");
const commentWriteInput = document.getElementById("commentWriteInput");
const btnCommentWrite = document.getElementById("btnCommentWrite");

const btnBackToList = document.getElementById("btnBackToList");
const btnDetailEdit = document.getElementById("btnDetailEdit");
const btnDetailDelete = document.getElementById("btnDetailDelete");

/* =========================
   임시 데이터
========================= */
const currentUser = {
  id: 1,
  userId: "lucas1144",
  nickname: "철수",
  role: "user"
};

const postDetailData = {
  id: 101,
  title: "저희 강아지 구경하고 가세요!",
  writer: "철수",
  writerId: 1,
  date: "2026.03.07",
  thumbnail:
    "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTEwMzFfMTU2%2FMDAxNzYxOTEyMzUzODIy.JauIsGx3oY4yGHHaCzkNBKFphQnoYrlTDoFDjP0nXL0g.VyBolt5gEwBxPkbLzf5XE1nNG0Q5ZHlou2VGyUNNVN0g.JPEG%2FP20200101_100034852_82847168-F64B-4527-921D-98D1D04EDDA9.JPG&type=sc960_832",
  content: `
    <p>멍! 매칭 입양했는데 너무 만족스럽습니다!!!</p>
    <p>처음에는 걱정도 많았는데 생각보다 너무 잘 적응하고 있어요.</p>
    <p>다들 건강하고 행복한 반려생활 하셨으면 좋겠습니다.</p>
  `
};

let commentData = [
  {
    id: 1,
    writer: "철수",
    writerId: 1,
    date: "2026.03.07",
    content: "강아지 너무 이쁘네요 ㅎㅎㅎ"
  },
  {
    id: 2,
    writer: "영희",
    writerId: 2,
    date: "2026.03.08",
    content: "사진 분위기가 너무 좋아요!"
  },
  {
    id: 3,
    writer: "민수",
    writerId: 3,
    date: "2026.03.09",
    content: "행복해 보여서 보기 좋네요."
  }
];

/* =========================
   초기 실행
========================= */
renderPostDetail();
renderCommentList();
bindEvents();

/* =========================
   렌더링
========================= */
function renderPostDetail() {
  detailTitle.textContent = postDetailData.title;
  detailWriter.textContent = postDetailData.writer;
  detailDate.textContent = postDetailData.date;

  renderThumbnail(postDetailData.thumbnail);
  detailMainPost.innerHTML = postDetailData.content;

  setButtonLinks();
  applyPostPermission();
}

function renderThumbnail(imageSrc) {
  if (!imageSrc) {
    detailMainImg.innerHTML = "";
    return;
  }

  detailMainImg.innerHTML = `<img src="${imageSrc}" alt="대표 이미지" />`;
}

function renderCommentList() {
  commentList.innerHTML = commentData
    .map((comment) => {
      const canDeleteComment = currentUser && currentUser.id === comment.writerId;

      return `
        <div class="detail-comment-container" data-comment-id="${comment.id}">
          <div class="detail-comment-info">
            <div class="comment-info-name">${escapeHtml(comment.writer)}</div>
            <div class="comment-info-date">${escapeHtml(comment.date)}</div>
          </div>
          <div class="detail-comment-post">
            <div class="comment-post-content">${escapeHtml(comment.content).replace(/\n/g, "<br>")}</div>
            ${
              canDeleteComment
                ? `
                <div class="comment-btn-wrap">
                  <button type="button" class="btn btn-comment-delete" data-action="delete-comment">삭제</button>
                </div>
              `
                : ""
            }
          </div>
        </div>
      `;
    })
    .join("");
}

/* =========================
   이벤트
========================= */
function bindEvents() {
  btnCommentWrite?.addEventListener("click", handleCommentWrite);
  btnDetailDelete?.addEventListener("click", handlePostDelete);
  commentList?.addEventListener("click", handleCommentAction);
}

function handleCommentWrite() {
  const commentText = commentWriteInput.value.trim();

  if (!commentText) {
    alert("댓글 내용을 입력해주세요.");
    commentWriteInput.focus();
    return;
  }

  const newComment = {
    id: Date.now(),
    writer: currentUser.nickname,
    writerId: currentUser.id,
    date: getTodayString(),
    content: commentText
  };

  commentData.unshift(newComment);
  commentWriteInput.value = "";
  renderCommentList();
}

function handleCommentAction(event) {
  const deleteButton = event.target.closest('button[data-action="delete-comment"]');
  if (!deleteButton) return;

  const commentContainer = deleteButton.closest(".detail-comment-container");
  if (!commentContainer) return;

  const commentId = Number(commentContainer.dataset.commentId);
  deleteComment(commentId);
}

function deleteComment(commentId) {
  const targetComment = commentData.find((comment) => comment.id === commentId);
  if (!targetComment) return;

  const isMyComment = currentUser && currentUser.id === targetComment.writerId;
  if (!isMyComment) {
    alert("본인 댓글만 삭제할 수 있습니다.");
    return;
  }

  const isConfirmed = confirm("댓글을 삭제하시겠습니까?");
  if (!isConfirmed) return;

  commentData = commentData.filter((comment) => comment.id !== commentId);
  renderCommentList();
}

function handlePostDelete() {
  if (!canDeletePost()) {
    alert("삭제 권한이 없습니다.");
    return;
  }

  const isConfirmed = confirm("게시글을 삭제하시겠습니까?");
  if (!isConfirmed) return;

  alert("게시글 삭제 처리");
  location.href = "./doglog_list.html";
}

/* =========================
   권한
========================= */
function applyPostPermission() {
  const canEdit = canEditPost();
  const canDelete = canDeletePost();

  if (!canEdit && btnDetailEdit) {
    btnDetailEdit.style.display = "none";
  }

  if (!canDelete && btnDetailDelete) {
    btnDetailDelete.style.display = "none";
  }

  if (!currentUser && commentWriteContainer) {
    commentWriteContainer.style.display = "none";
  }
}

function canEditPost() {
  return !!currentUser && currentUser.id === postDetailData.writerId;
}

function canDeletePost() {
  return !!currentUser && (
    currentUser.id === postDetailData.writerId ||
    currentUser.role === "admin"
  );
}

/* =========================
   링크 / 유틸
========================= */
function setButtonLinks() {
  if (btnBackToList) {
    btnBackToList.href = "./doglog_list.html";
  }

  if (btnDetailEdit) {
    btnDetailEdit.href = `./doglog_edit.html?id=${postDetailData.id}`;
  }
}

function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");

  return `${year}.${month}.${date}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// 수정
const btnEdit = document.getElementById("btnDetailEdit");

// 예: 현재 게시글 id
const postId = new URLSearchParams(location.search).get("id");

btnEdit.addEventListener("click", function(e){
  e.preventDefault();

  location.href = `doglog_edit.html?id=${postId}`;
});