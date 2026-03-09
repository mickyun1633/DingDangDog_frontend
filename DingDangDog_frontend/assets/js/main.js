async function includeLayout() {
    const headerContainer = document.getElementById('header-container');
    const footerContainer = document.getElementById('footer-container');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const headerFile = isLoggedIn ? './header_login.html' : './header_logout.html';


    if (headerContainer) {
        try {
            const response = await fetch(headerFile);
            const data = await response.text();
            headerContainer.innerHTML = data;
        } catch (error) {
            console.error('헤더 로드 실패:', error);
        } ÍÍÍ
    }

    if (footerContainer) {
        try {
            const response = await fetch('./footer.html');
            const data = await response.text();
            footerContainer.innerHTML = data;
        } catch (error) {
            console.error('풋터 로드 실패:', error);
        }
    }
}

window.addEventListener('DOMContentLoaded', includeLayout);