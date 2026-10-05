const canvas = document.querySelector('.university-life');
const world = document.getElementById('mindmapWorld');
const connections = document.querySelector('.mindmap-connections');
const BRANCH_WIDTH = 380;
let activeTrigger;
let activeBranch;

// 예시 항목입니다. 실제 이력에 맞게 여기의 제목과 목록을 수정하세요.
const contents = {
    me_study: { title: '학업 관리', description: '주전공: 기계공학 - 학업 관리의 세부가지입니다.', items: ['전필 모두 "무사히" 이수하기', '캐드 스킬 향상하기'] },
    me_ability: { title: '전공 관련 역량', description: '주전공: 기계공학 - 전공 관련 역량의 세부가지입니다.', items: ['캐드 스킬 향상하기', '관련 산업기사 및 기사 자격증 취득하기'] },
    me_experience: { title: '전공 관련 경험', description: '주전공: 기계공학 - 전공 관련 경험의 세부가지입니다.', items: ['아두이노, 라즈베리파이 활용 시제품 제작', '공모전, 학술대회 등 참가'] },
    IP_activities: { title: '비교과', description: '복수전공: 지식재산학 - 비교과의 세부가지입니다.', items: ['IPAT 4급 이상(재학 기간 동안 2급 이상)', 'CPU(캠퍼스 특허 유니버시아드) 입상하기', '교내 IP EXPO 대회 입상하기', 'IP 지역인재 인증받기'] },
    IP_career: { title: '진로 대비', description: '복수전공: 지식재산학 - 진로 대비의 세부가지입니다.', items: ['변리사?', '대학원 진학하기'] },
    semiconductor_study: { title: '학업 관리', description: '부전공: 반도체공학 - 학업 관리의 세부가지입니다.', items: ['최소 재수강하지 않을 정도의 성적 유지하기', '비전공자에게 가장 쉽게 전공 내용 설명하기', '용어집 제작하기'] },
    semiconductor_ability: { title: '전공 역량', description: '부전공: 반도체공학 - 전공 역량의 세부가지입니다.', items: ['용어집 제작하기', '산업 전시회 참관(구경)하기', '직무 포함 전반적인 특강 참여하기'] },
    social: { title: '사회성 기르기', description: '비교과 활동 - 사회성 기르기의 세부가지입니다.', items: ['공모전, 학술대회 등 참가하기', '동아리 활동 증가하기', '여러 비교과 캠프 참여하기'] },
    personal_ability: { title: '개인 역량', description: '비교과 활동 - 개인 역량의 세부가지입니다.', items: ['(바이브)코딩 계속해서 기르기', '사진 찍기'] },
    hobby: { title: '취미', description: '비교과 활동 - 취미의 세부가지입니다.', items: ['블로그 꾸준히 운영하기', '사진 찍기', '글 쓰기'] },
    etc: { title: '기타', description: '비교과 활동 - 기타의 세부가지입니다.', items: ['블로그 운영하기', '포트폴리오 꾸준히 업데이트하기'] }
};

function createBranch(section, content) {
    const branch = document.createElement('article');
    branch.className = 'branch-node';
    branch.id = 'expandedBranch';
    branch.setAttribute('aria-labelledby', 'expandedBranchTitle');

    const closeButton = document.createElement('button');
    closeButton.className = 'branch-close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', '가지 접기');
    closeButton.textContent = '×';
    closeButton.addEventListener('click', collapseBranch);

    const kicker = document.createElement('p');
    kicker.className = 'branch-kicker';
    kicker.textContent = 'EXPANDED BRANCH';

    const title = document.createElement('h2');
    title.id = 'expandedBranchTitle';
    title.textContent = content.title;

    const description = document.createElement('p');
    description.className = 'branch-description';
    description.textContent = content.description;

    const list = document.createElement('ul');
    list.className = 'branch-items';
    content.items.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.style.setProperty('--branch-delay', `${index * 100}ms`);

        if (section === 'etc' && item === '포트폴리오 꾸준히 업데이트하기') {
            const link = document.createElement('a');
            link.href = 'https://portfolio-dohyeons10-mk2.vercel.app';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = item;
            listItem.appendChild(link);
        } else {
            listItem.textContent = item;
        }

        list.appendChild(listItem);
    });

    branch.append(closeButton, kicker, title, description, list);
    return branch;
}

function openBranch(section, trigger) {
    const content = contents[section];
    if (!content) return;

    if (activeTrigger === trigger) {
        collapseBranch();
        return;
    }

    if (activeTrigger) {
        activeTrigger.classList.remove('is-active');
        activeTrigger.setAttribute('aria-expanded', 'false');
        activeTrigger.removeAttribute('aria-controls');
    }
    activeBranch?.remove();

    activeTrigger = trigger;
    activeBranch = createBranch(section, content);
    activeTrigger.classList.add('is-active');
    activeTrigger.setAttribute('aria-expanded', 'true');
    activeTrigger.setAttribute('aria-controls', activeBranch.id);
    world.appendChild(activeBranch);
    positionBranch();
}

function collapseBranch() {
    if (!activeTrigger) return;

    const trigger = activeTrigger;
    trigger.classList.remove('is-active');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.removeAttribute('aria-controls');
    activeBranch?.remove();
    activeTrigger = undefined;
    activeBranch = undefined;

    world.style.width = '';
    world.style.removeProperty('--camera-x');
    world.style.removeProperty('--camera-y');
    drawConnections();
    trigger.focus();
}

document.querySelectorAll('.item-card').forEach((button) => {
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => openBranch(button.dataset.section, button));
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeBranch) collapseBranch();
});

function positionBranch() {
    if (!activeBranch || !activeTrigger) return;

    const sourceCard = activeTrigger.closest('.category-card');
    if (window.innerWidth <= 640) {
        world.style.width = '';
        world.style.removeProperty('--camera-x');
        world.style.removeProperty('--camera-y');
        activeBranch.classList.add('branch-node-mobile');
        sourceCard.insertAdjacentElement('afterend', activeBranch);
        requestAnimationFrame(() => activeBranch?.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            block: 'center'
        }));
        return;
    }

    activeBranch.classList.remove('branch-node-mobile');
    world.appendChild(activeBranch);
    activeBranch.style.position = 'absolute';
    activeBranch.style.width = `${Math.min(BRANCH_WIDTH, window.innerWidth - 40)}px`;

    const worldRect = world.getBoundingClientRect();
    const cardRect = sourceCard.getBoundingClientRect();
    const triggerRect = activeTrigger.getBoundingClientRect();
    const branchX = cardRect.right - worldRect.left + 84;
    const anchorY = triggerRect.top + triggerRect.height / 2 - worldRect.top;
    const branchHeight = activeBranch.offsetHeight;
    const worldHeight = Math.max(canvas.clientHeight, window.innerHeight);
    const branchY = Math.max(24, Math.min(
        anchorY - branchHeight / 2,
        worldHeight - branchHeight - 24
    ));
    const worldWidth = Math.max(canvas.clientWidth + 900, branchX + activeBranch.offsetWidth + 80);
    const targetX = Math.max(24, Math.min(
        canvas.clientWidth * 0.68,
        canvas.clientWidth - activeBranch.offsetWidth - 28
    ));
    const cardLeft = cardRect.left - worldRect.left;
    const cameraX = Math.max(targetX - branchX, 24 - cardLeft);
    const cameraY = Math.max(-180, Math.min(
        180,
        canvas.clientHeight * 0.5 - (branchY + branchHeight / 2)
    ));

    world.style.width = `${worldWidth}px`;
    world.style.setProperty('--canvas-width', `${canvas.clientWidth}px`);
    activeBranch.style.left = `${branchX}px`;
    activeBranch.style.top = `${branchY}px`;
    world.style.setProperty('--camera-x', `${cameraX}px`);
    world.style.setProperty('--camera-y', `${cameraY}px`);
    drawConnections();
}

function drawConnections() {
    if (!canvas || !world || !connections || window.innerWidth <= 640) {
        connections?.replaceChildren();
        return;
    }

    const worldRect = world.getBoundingClientRect();
    const worldWidth = world.clientWidth;
    const worldHeight = Math.max(world.clientHeight, canvas.clientHeight);
    const root = world.querySelector('.center-node');
    const rootRect = root.getBoundingClientRect();
    const startX = rootRect.right - worldRect.left;
    const startY = rootRect.top + rootRect.height / 2 - worldRect.top;
    connections.setAttribute('viewBox', `0 0 ${worldWidth} ${worldHeight}`);
    connections.replaceChildren();

    document.querySelectorAll('.category-card').forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const endX = cardRect.left - worldRect.left;
        const endY = cardRect.top + cardRect.height / 2 - worldRect.top;
        const curve = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const bend = Math.max(0, (endX - startX) * 0.48);
        curve.setAttribute('d', `M ${startX} ${startY} C ${startX + bend} ${startY}, ${endX - bend} ${endY}, ${endX} ${endY}`);
        curve.setAttribute('class', 'connection-line');
        connections.appendChild(curve);
    });

    if (activeBranch && activeTrigger) {
        const triggerRect = activeTrigger.getBoundingClientRect();
        const branchRect = activeBranch.getBoundingClientRect();
        const branchPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const x1 = triggerRect.right - worldRect.left;
        const y1 = triggerRect.top + triggerRect.height / 2 - worldRect.top;
        const x2 = branchRect.left - worldRect.left;
        const y2 = branchRect.top + branchRect.height / 2 - worldRect.top;
        const bend = Math.max(48, (x2 - x1) * 0.48);
        branchPath.setAttribute('d', `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`);
        branchPath.setAttribute('pathLength', '1');
        branchPath.setAttribute('class', 'connection-line branch-connection-line');
        connections.appendChild(branchPath);
    }
}

window.addEventListener('load', () => {
    world.style.setProperty('--canvas-width', `${canvas.clientWidth}px`);
    drawConnections();
});
window.addEventListener('resize', () => {
    world.style.setProperty('--canvas-width', `${canvas.clientWidth}px`);
    if (activeBranch) positionBranch();
    else drawConnections();
});