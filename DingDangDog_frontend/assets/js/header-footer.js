// header js
async function loadLayout() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const getPath = (file) => {
        const pathArray = window.location.pathname.split('/');
        const isInSubFolder = pathArray.some(p => ['login', 'dogarchive', 'dogcare', 'doglog', 'dogmatching', 'mypage', 'signup', 'admin'].includes(p));

        return isInSubFolder ? `../${file}` : `./${file}`;
    };

    const headerFile = isLoggedIn ? getPath('header_login.html') : getPath('header_logout.html');
    const footerFile = getPath('footer.html');

    try {
        const hResp = await fetch(headerFile);
        if (!hResp.ok) throw new Error();
        const hData = await hResp.text();
        document.getElementById('header-container').innerHTML = hData;
    } catch (e) {
        console.error("헤더 로드 실패: 경로를 확인하세요. 시도한 경로 ->", headerFile);
    }

    try {
        const fResp = await fetch(footerFile);
        if (!fResp.ok) throw new Error();
        const fData = await fResp.text();
        document.getElementById('footer-container').innerHTML = fData;
    } catch (e) {
        console.error("풋터 로드 실패: 경로를 확인하세요. 시도한 경로 ->", footerFile);
    }
}

window.addEventListener('DOMContentLoaded', loadLayout);