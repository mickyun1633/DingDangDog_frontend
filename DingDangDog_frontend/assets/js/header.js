async function loadLayout() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const headerFile = isLoggedIn ? './header_login.html' : './header_logout.html';

    try {
        const hResp = await fetch(headerFile);
        const hData = await hResp.text();
        document.getElementById('header-container').innerHTML = hData;
    } catch (e) { console.error("헤더 로드 실패", e); }


    try {
        const fResp = await fetch('./footer.html');
        const fData = await fResp.text();
        document.getElementById('footer-container').innerHTML = fData;
    } catch (e) { console.error("풋터 로드 실패", e); }
}

window.addEventListener('DOMContentLoaded', loadLayout);