// ==== BACKGROUND POINTS (doar în editor, nu la export) ====
const POINTS_COUNT = 20;
const points = [];
let pointProps = [];
function randomBetween(a, b) {
  return Math.random() * (b - a) + a;
}
function initPoints() {
  const container = document.getElementById('points-bg');
  if (!container) return;
  container.innerHTML = '';
  points.length = 0;
  pointProps = [];
  const w = window.innerWidth, h = window.innerHeight;
  for (let i = 0; i < POINTS_COUNT; i++) {
    const dot = document.createElement('div');
    dot.className = 'point-dot';
    container.appendChild(dot);
    const px = randomBetween(0, w - 8);
    const py = randomBetween(0, h - 8);
    dot.style.left = px + 'px';
    dot.style.top = py + 'px';
    pointProps.push({
      x: px,
      y: py,
      vx: randomBetween(-0.08, 0.08),
      vy: randomBetween(-0.08, 0.08),
      dot: dot
    });
    points.push(dot);
  }
}
function animatePoints() {
  const w = window.innerWidth, h = window.innerHeight;
  for (const p of pointProps) {
    p.vx += randomBetween(-0.012, 0.012);
    p.vy += randomBetween(-0.012, 0.012);
    p.vx = Math.max(-0.13, Math.min(0.13, p.vx));
    p.vy = Math.max(-0.13, Math.min(0.13, p.vy));
    p.x += p.vx;
    p.y += p.vy;
    if (p.x <= 0 || p.x >= w - 8) p.vx = -p.vx;
    if (p.y <= 0 || p.y >= h - 8) p.vy = -p.vy;
    p.x = Math.max(0, Math.min(p.x, w - 8));
    p.y = Math.max(0, Math.min(p.y, h - 8));
    p.dot.style.left = p.x + 'px';
    p.dot.style.top = p.y + 'px';
  }
  requestAnimationFrame(animatePoints);
}
window.addEventListener('resize', () => {
  initPoints();
});
initPoints();
animatePoints();

// ==== COPYRIGHT/FOOTER EDIT ====
const copyrightSpan = document.getElementById('copyright-text');
const copyrightBtn = document.getElementById('footerEditBtn');
const footerBar = document.getElementById('footerBar');
let copyrightEditing = false;
function activateCopyrightEdit() {
  if (copyrightEditing) return;
  copyrightEditing = true;
  const input = document.createElement('input');
  input.type = 'text';
  input.value = copyrightSpan.textContent.trim();
  input.className = 'footer-edit-input';
  copyrightSpan.style.display = "none";
  copyrightBtn.style.display = "none";
  footerBar.insertBefore(input, copyrightBtn);
  input.focus();
  input.select();
  function finishEdit(save) {
    if (save) {
      let val = input.value.trim();
      if (!val) val = 'Copyright © 2025 - Somsht';
      copyrightSpan.textContent = val;
    }
    input.remove();
    copyrightSpan.style.display = "";
    copyrightBtn.style.display = "";
    copyrightEditing = false;
  }
  input.addEventListener('keydown', function (e) {
    if (e.key === "Enter") finishEdit(true);
    if (e.key === "Escape") finishEdit(false);
  });
  input.addEventListener('blur', () => finishEdit(true));
}
if (copyrightBtn) copyrightBtn.addEventListener('click', activateCopyrightEdit);
if (copyrightSpan) copyrightSpan.addEventListener('dblclick', activateCopyrightEdit);

// ==== TITLE TOOLBAR EDIT ====
const pageTitleH2 = document.getElementById('pageTitle');
const pageTitleBtn = document.getElementById('editTitleBtn');
const pageTitleEditContainer = document.getElementById('pageTitleEditContainer');
let titleToolbar = null;
let titleEditing = false;
function setPageTitle(newTitle) {
  pageTitleH2.innerHTML = newTitle.replace(/\n/g, "<br>");
  document.title = newTitle.replace(/<br\s*\/?>/gi, ' ').replace(/\n/g, ' ');
}
function formatTitle(cmd) {
  document.execCommand(cmd, false, null);
  updateTitleToolbar();
}
function updateTitleToolbar() {
  if (!titleToolbar) return;
  const states = {
    bold: document.queryCommandState('bold'),
    italic: document.queryCommandState('italic'),
    underline: document.queryCommandState('underline'),
    strikeThrough: document.queryCommandState('strikeThrough'),
  };
  titleToolbar.remove();
  titleToolbar = createToolbar(states, formatTitle, null, false);
  titleToolbar.classList.add('title-toolbar');
  pageTitleEditContainer.appendChild(titleToolbar);
}
function activateTitleEdit() {
  if (titleToolbar) titleToolbar.remove();
  pageTitleH2.contentEditable = "true";
  pageTitleH2.spellcheck = false;
  pageTitleH2.focus();
  titleEditing = true;
  const states = {
    bold: document.queryCommandState('bold'),
    italic: document.queryCommandState('italic'),
    underline: document.queryCommandState('underline'),
    strikeThrough: document.queryCommandState('strikeThrough'),
  };
  titleToolbar = createToolbar(states, formatTitle, null, false);
  titleToolbar.classList.add('title-toolbar');
  pageTitleEditContainer.appendChild(titleToolbar);
  // Place caret at end
  const range = document.createRange();
  range.selectNodeContents(pageTitleH2);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  pageTitleBtn.style.display = "none";
}
function finishTitleEdit() {
  pageTitleH2.contentEditable = "false";
  pageTitleBtn.style.display = "";
  setPageTitle(pageTitleH2.innerHTML.replace(/<div>/g, '\n').replace(/<\/div>/g, '').replace(/<br>/g, '\n'));
  if (titleToolbar) { titleToolbar.remove(); titleToolbar = null; }
  titleEditing = false;
  window.getSelection().removeAllRanges();
}
if (pageTitleBtn) pageTitleBtn.addEventListener('click', activateTitleEdit);
if (pageTitleH2) pageTitleH2.addEventListener('dblclick', activateTitleEdit);
if (pageTitleH2) pageTitleH2.addEventListener('focus', function () {
  if (!titleToolbar && titleEditing) updateTitleToolbar();
});
if (pageTitleH2) pageTitleH2.addEventListener('input', function () {
  if (titleEditing) updateTitleToolbar();
});
if (pageTitleH2) pageTitleH2.addEventListener('mouseup', function () {
  if (titleEditing) updateTitleToolbar();
});
if (pageTitleH2) pageTitleH2.addEventListener('keyup', function (e) {
  if (!titleEditing) return;
  updateTitleToolbar();
  if (e.key === "Enter") {
    finishTitleEdit();
  } else if (e.key === "Escape") {
    finishTitleEdit();
  }
});
if (pageTitleH2) pageTitleH2.addEventListener('blur', function () {
  setTimeout(() => {
    if (titleEditing && (!document.activeElement.closest('.text-toolbar') && document.activeElement !== pageTitleH2)) {
      finishTitleEdit();
    }
  }, 100);
});
document.addEventListener('mousedown', function (e) {
  if (titleEditing && !pageTitleEditContainer.contains(e.target)) {
    finishTitleEdit();
  }
});

// ==== TOOLBAR HTML ====
function createToolbar(formatStates, onFormat, onAddButton, hasButtonSection) {
  const toolbar = document.createElement('div');
  toolbar.className = 'text-toolbar';
  toolbar.innerHTML = `
    <span class="tb-section">
      <button type="button" data-cmd="bold" title="Bold (Ctrl+B)" ${formatStates.bold ? 'class="active"' : ''}><b>B</b></button>
      <button type="button" data-cmd="italic" title="Italic (Ctrl+I)" ${formatStates.italic ? 'class="active"' : ''}><i>I</i></button>
      <button type="button" data-cmd="underline" title="Underline (Ctrl+U)" ${formatStates.underline ? 'class="active"' : ''}><u>U</u></button>
      <button type="button" data-cmd="strikeThrough" title="Strikethrough" ${formatStates.strikeThrough ? 'class="active"' : ''}><s>S</s></button>
    </span>
    ${hasButtonSection ? `
    <span class="tb-section">
      <span class="toolbar-label">Buttons:</span>
      <button type="button" class="add-btn-link" title="Add button" style="color: #888; background:#464646;"><span class="toolbar-icon">➕</span></button>
    </span>` : ''}
  `;
  toolbar.querySelectorAll('button[data-cmd]').forEach(btn => {
    btn.addEventListener('mousedown', function (e) {
      e.preventDefault();
      onFormat(btn.dataset.cmd);
    });
  });
  if (hasButtonSection) {
    toolbar.querySelector('.add-btn-link').addEventListener('mousedown', function (e) {
      e.preventDefault();
      onAddButton();
    });
  }
  return toolbar;
}

// ==== LINK/BUTTON POPUP ====
function openButtonPopup(div, onAdd, btnToEdit = null) {
  let popup = document.createElement('div');
  popup.className = 'link-btn-popup';
  popup.innerHTML = `
    <div class="popup-title">${btnToEdit ? "Edit Button" : "Add Button with Link"}</div>
    <label for="btnText">Button Text:</label>
    <input id="btnText" type="text" maxlength="50" autocomplete="off" placeholder="Button label" />
    <label for="btnUrl">Button Link (URL):</label>
    <input id="btnUrl" type="url" autocomplete="off" placeholder="https://example.com" />
    <div class="popup-actions">
      <button type="button" class="popup-cancel">Cancel</button>
      <button type="button" class="popup-ok">${btnToEdit ? "Save" : "Add"}</button>
    </div>
  `;
  document.body.appendChild(popup);
  if (btnToEdit) {
    popup.querySelector('#btnText').value = btnToEdit.text;
    popup.querySelector('#btnUrl').value = btnToEdit.url;
  }
  popup.querySelector('.popup-cancel').onclick = () => popup.remove();
  popup.querySelector('.popup-ok').onclick = () => {
    const text = popup.querySelector('#btnText').value.trim();
    const url = popup.querySelector('#btnUrl').value.trim();
    if (text && url) {
      onAdd(text, url);
      popup.remove();
    } else {
      popup.querySelector('#btnText').focus();
    }
  };
  popup.querySelector('#btnText').focus();
  popup.addEventListener('keydown', e => {
    if (e.key === "Escape") popup.remove();
    if (e.key === "Enter") popup.querySelector('.popup-ok').click();
  });
}

// ==== DIVS: DRAG, RESIZE, TOOLBAR, BUTTONS ====
const editableArea = document.getElementById('editableArea');
const resizeBar = document.getElementById('resizeBar');
let dragData = null;
let resizeData = null;
let gridResizeData = null;
let zIndexCounter = 20;
// Crește gridul la 64px pentru spațiere mai mare între divuri
const gridSize = 64;
const margin = 16;

function snapToGrid(val) {
  return Math.round(val / gridSize) * gridSize;
}

function getNextDivPosition(width = 240, height = 120) {
  let maxRight = 44;
  let divs = editableArea.querySelectorAll('.draggable-div');
  if (divs.length === 0) return { left: 44, top: 44 };
  divs.forEach(div => {
    const left = parseInt(div.style.left) || 0;
    const w = parseInt(div.style.width) || width;
    const right = left + w;
    if (right > maxRight) maxRight = right;
  });
  let newLeft = snapToGrid(maxRight + 32);
  return { left: newLeft, top: 44 };
}

function createDraggableDiv(x, y, w = 240, h = 120, text = 'Div nou', buttons = []) {
  if (typeof x === "undefined" || typeof y === "undefined") {
    const pos = getNextDivPosition(w, h);
    x = pos.left;
    y = pos.top;
  }
  const div = document.createElement('div');
  div.className = 'draggable-div';
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;
  div.style.width = `${w}px`;
  div.style.height = `${h}px`;
  div.style.zIndex = zIndexCounter++;
  div.tabIndex = 0;

  // Buttons area
  let btnsHtml = `<div class="div-buttons-area"></div>`;

  div.innerHTML = `
    <button class="close-btn" title="Șterge div" aria-label="Închide">&times;</button>
    <div class="div-content" contenteditable="true" spellcheck="false">${text}</div>
    <div class="resize-handle"></div>
    ${btnsHtml}
  `;

  // Restore buttons if any
  const btnArea = div.querySelector('.div-buttons-area');
  function renderBtns() {
    btnArea.innerHTML = '';
    buttons.forEach((btn, idx) => {
      const a = document.createElement('a');
      a.className = 'div-link-btn';
      a.href = btn.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = btn.text;

      const utilBox = document.createElement('span');
      utilBox.className = 'btn-util-icons';

      // Edit icon
      const edit = document.createElement('button');
      edit.type = "button";
      edit.className = "btn-edit";
      edit.title = "Edit";
      edit.innerHTML = '<span style="font-size:16px;vertical-align:middle;opacity:0.95;color:#888;" class="toolbar-icon">&#9998;</span>';
      edit.onclick = e => {
        e.preventDefault();
        openButtonPopup(div, (newText, newUrl) => {
          buttons[idx] = { text: newText, url: newUrl };
          renderBtns();
        }, { text: btn.text, url: btn.url });
      };

      // Remove icon
      const rem = document.createElement('button');
      rem.type = "button";
      rem.className = "btn-x";
      rem.title = "Remove";
      rem.innerHTML = '<span style="font-size:19px;vertical-align:middle;opacity:0.85;color:#888;" class="toolbar-icon">&times;</span>';
      rem.onclick = e => {
        e.preventDefault();
        buttons.splice(idx, 1);
        renderBtns();
      };

      utilBox.appendChild(edit);
      utilBox.appendChild(rem);
      a.appendChild(utilBox);
      btnArea.appendChild(a);
    });
  }
  renderBtns();

  div.querySelector('.close-btn').onclick = e => {
    e.stopPropagation();
    div.remove();
  };

  div.addEventListener('mousedown', e => {
    if (e.target.classList.contains('div-content')) return;
    document.querySelectorAll('.draggable-div.selected').forEach(d => d.classList.remove('selected'));
    div.classList.add('selected');
    div.style.zIndex = zIndexCounter++;
  });

  div.addEventListener('mousedown', function (e) {
    if (
      e.target.classList.contains("resize-handle") ||
      e.target.classList.contains("close-btn") ||
      e.target.classList.contains("div-content")
    ) return;
    e.preventDefault();
    dragData = {
      offsetX: e.offsetX,
      offsetY: e.offsetY,
      element: div
    };
    document.body.style.cursor = "move";
  });

  const handle = div.querySelector('.resize-handle');
  handle.addEventListener('mousedown', function (e) {
    e.stopPropagation();
    e.preventDefault();
    resizeData = {
      startX: e.clientX,
      startY: e.clientY,
      startW: parseInt(window.getComputedStyle(div).width),
      startH: parseInt(window.getComputedStyle(div).height),
      element: div
    };
    div.classList.add('selected');
    document.body.style.cursor = "se-resize";
  });

  const contentDiv = div.querySelector('.div-content');
  let toolbar = null;
  let interacting = false;

  function formatDivText(cmd) {
    document.execCommand(cmd, false, null);
    updateDivToolbar();
  }
  function updateDivToolbar() {
    if (!toolbar) return;
    const states = {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
    };
    toolbar.remove();
    toolbar = createToolbar(states, formatDivText, openAddBtnDialog, true);
    toolbar.style.position = 'absolute';
    toolbar.style.left = (div.offsetLeft + div.offsetWidth + 10) + 'px';
    toolbar.style.top = (div.offsetTop) + 'px';
    editableArea.appendChild(toolbar);
  }
  function showDivToolbar() {
    if (toolbar) toolbar.remove();
    const states = {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
    };
    toolbar = createToolbar(states, formatDivText, openAddBtnDialog, true);
    toolbar.style.position = 'absolute';
    toolbar.style.left = (div.offsetLeft + div.offsetWidth + 10) + 'px';
    toolbar.style.top = (div.offsetTop) + 'px';
    editableArea.appendChild(toolbar);
  }
  function hideDivToolbar() {
    if (toolbar) { toolbar.remove(); toolbar = null; }
  }

  function keepToolbarPosition() {
    if (toolbar && interacting) {
      toolbar.style.left = (div.offsetLeft + div.offsetWidth + 10) + 'px';
      toolbar.style.top = (div.offsetTop) + 'px';
    }
  }

  function openAddBtnDialog() {
    openButtonPopup(div, (btnText, btnUrl) => {
      buttons.push({ text: btnText, url: btnUrl });
      renderBtns();
    });
  }

  contentDiv.addEventListener('focus', function () {
    interacting = true;
    setTimeout(showDivToolbar, 5);
  });
  contentDiv.addEventListener('input', updateDivToolbar);
  contentDiv.addEventListener('mouseup', updateDivToolbar);
  contentDiv.addEventListener('keyup', function (e) {
    updateDivToolbar();
    if (e.key === "Escape") {
      contentDiv.blur();
    }
  });
  contentDiv.addEventListener('blur', function () {
    setTimeout(() => {
      if (toolbar && !document.activeElement.closest('.text-toolbar')) {
        interacting = false;
        hideDivToolbar();
      }
    }, 100);
  });

  editableArea.addEventListener('mousedown', function (e) {
    if (toolbar && toolbar.contains(e.target)) {
      interacting = true;
    }
  });
  document.addEventListener('mousedown', function (e) {
    if (
      !div.contains(e.target) &&
      (!toolbar || !toolbar.contains(e.target))
    ) {
      interacting = false;
      hideDivToolbar();
    }
  });

  window.addEventListener('scroll', keepToolbarPosition);
  window.addEventListener('resize', keepToolbarPosition);
  new ResizeObserver(keepToolbarPosition).observe(div);

  editableArea.appendChild(div);
}

// ==== ADD DIV BUTTON ====
const addDivBtn = document.getElementById('add-div-btn');
if (addDivBtn) addDivBtn.addEventListener('click', () => {
  createDraggableDiv();
});

// ==== RESIZE BAR LOGIC ====
if (resizeBar) {
  resizeBar.addEventListener('mousedown', function (e) {
    e.preventDefault();
    gridResizeData = {
      startY: e.clientY,
      startH: parseInt(window.getComputedStyle(editableArea).height || editableArea.style.minHeight || 600)
    };
    resizeBar.classList.add('active');
    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";
  });
}

document.addEventListener('mousemove', function (e) {
  if (dragData) {
    let areaRect = editableArea.getBoundingClientRect();
    let newX = e.clientX - areaRect.left - dragData.offsetX;
    let newY = e.clientY - areaRect.top - dragData.offsetY;
    newX = Math.max(margin, Math.min(newX, editableArea.clientWidth - dragData.element.offsetWidth - margin));
    newY = Math.max(margin, Math.min(newY, editableArea.clientHeight - dragData.element.offsetHeight - margin));
    newX = snapToGrid(newX);
    newY = snapToGrid(newY);
    dragData.element.style.left = `${newX}px`;
    dragData.element.style.top = `${newY}px`;
  }
  if (resizeData) {
    let dx = e.clientX - resizeData.startX;
    let dy = e.clientY - resizeData.startY;
    let newW = Math.max(100, resizeData.startW + dx);
    let newH = Math.max(60, resizeData.startH + dy);
    newW = snapToGrid(newW);
    newH = snapToGrid(newH);
    let left = parseInt(resizeData.element.style.left);
    let top = parseInt(resizeData.element.style.top);
    let maxW = editableArea.clientWidth - left - margin;
    let maxH = editableArea.clientHeight - top - margin;
    newW = Math.min(newW, maxW);
    newH = Math.min(newH, maxH);
    resizeData.element.style.width = `${newW}px`;
    resizeData.element.style.height = `${newH}px`;
  }
  if (gridResizeData) {
    let dy = e.clientY - gridResizeData.startY;
    let newH = Math.max(200, snapToGrid(gridResizeData.startH + dy));
    editableArea.style.height = `${newH}px`;
  }
});
document.addEventListener('mouseup', function (e) {
  if (dragData) {
    dragData = null;
    document.body.style.cursor = "";
  }
  if (resizeData) {
    resizeData = null;
    document.body.style.cursor = "";
  }
  if (gridResizeData) {
    gridResizeData = null;
    if (resizeBar) resizeBar.classList.remove('active');
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }
});

document.addEventListener('mousedown', function (e) {
  if (!e.target.closest('.draggable-div')) {
    document.querySelectorAll('.draggable-div.selected').forEach(d => d.classList.remove('selected'));
  }
});

setTimeout(() => createDraggableDiv(44, 44, 240, 120, 'Exemplu div'), 100);

function ensureMinHeight() {
  if (!editableArea.style.height || parseInt(editableArea.style.height) < 200) {
    editableArea.style.height = editableArea.style.minHeight || "80vh";
  }
}
ensureMinHeight();
window.addEventListener('resize', ensureMinHeight);

// ==== EXPORT HTML ====
// Distanța între divuri este corectă la export (grid 64px)! Adăugat hover efect la .draggable-div în CSS exportat!
document.getElementById('export-html-btn').addEventListener('click', function () {
  const pageTitle = document.getElementById('pageTitle');
  const editableArea = document.getElementById('editableArea');
  const copyright = document.getElementById('copyright-text').textContent;

  // 1. Particule mici și multe pe fundal
  let pointsHtml = '';
  const pointsBg = document.getElementById('points-bg');
  let dotsCount = 48;
  let dotsSize = 5;
  if (pointsBg) {
    const dots = pointsBg.querySelectorAll('.point-dot');
    dotsCount = Math.max(dots.length, dotsCount);
    pointsHtml = `<div id="points-bg" style="position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:0;">` +
      Array.from(dots).slice(0, dotsCount).map(dot => {
        let style = dot.getAttribute('style') || "";
        style = style.replace(/width:\s*\d+px/, `width:${dotsSize}px`).replace(/height:\s*\d+px/, `height:${dotsSize}px`);
        if (!/width:/.test(style)) style += `width:${dotsSize}px;`;
        if (!/height:/.test(style)) style += `height:${dotsSize}px;`;
        return `<div class="point-dot" style="${style}"></div>`;
      }).join('') +
      `</div>`;
  } else {
    let dotsArr = [];
    for (let i = 0; i < dotsCount; ++i) {
      let x = Math.round(Math.random() * 98);
      let y = Math.round(Math.random() * 96);
      dotsArr.push(`<div class="point-dot" style="left:${x}vw;top:${y}vh;width:${dotsSize}px;height:${dotsSize}px"></div>`);
    }
    pointsHtml = `<div id="points-bg" style="position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:0;">${dotsArr.join('')}</div>`;
  }

  // 2. Extrage dimensiunea zonei de editare pentru export-area
  const areaWidth = editableArea.offsetWidth;
  const areaHeight = editableArea.offsetHeight;

  // 3. Extrage și SNAPEAZĂ pe GRID fiecare div pentru distanțe identice cu gridul
  const gridSizeExport = 64;
  function snap(val) {
    if (!val) return 0;
    const n = parseInt(val);
    return Math.round(n / gridSizeExport) * gridSizeExport;
  }

  let divs = Array.from(editableArea.querySelectorAll('.draggable-div'));
  divs.sort((a, b) => {
    const ay = snap(a.style.top), by = snap(b.style.top);
    if (ay !== by) return ay - by;
    return snap(a.style.left) - snap(b.style.left);
  });
  const contentHtml = divs.map(div => {
    const left = snap(div.style.left);
    const top = snap(div.style.top);
    const width = snap(div.style.width);
    const height = snap(div.style.height);
    const zIndex = div.style.zIndex || 10;
    const contentDiv = div.querySelector('.div-content');
    const contentDivHtml = contentDiv ? contentDiv.innerHTML : '';
    let btnsHtml = '';
    const btns = div.querySelectorAll('.div-link-btn');
    if (btns.length) {
      btnsHtml = '<div class="div-buttons-area">';
      btns.forEach(btn => {
        btnsHtml += `<a class="div-link-btn" href="${btn.href}" target="_blank" rel="noopener noreferrer">${btn.childNodes[0].textContent}</a>`;
      });
      btnsHtml += '</div>';
    }
    return `
      <div class="draggable-div" style="left:${left}px;top:${top}px;width:${width}px;height:${height}px;z-index:${zIndex};">
        <div class="div-content">${contentDivHtml}</div>
        ${btnsHtml}
      </div>
    `;
  }).join('\n');

  // 4. CSS: grid INVIZIBIL, divuri puțin transparente și fără "reflex", adăugat hover efect
  const exportCSS = `
@import url('https://fonts.googleapis.com/css?family=Poppins:800&display=swap');
body, * {
  font-family: 'Poppins', Arial, sans-serif !important;
  font-weight: bold !important;
  margin: 0;
  color: #f5f5f5;
}
body {
  background: #191919;
  min-height: 100vh;
}
#points-bg {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  pointer-events: none;
  z-index: 0;
}
.point-dot {
  position: absolute;
  width: ${dotsSize}px; height: ${dotsSize}px;
  background: #fff7;
  border-radius: 50%;
  box-shadow: 0 0 6px 1.5px #fff3;
}
.main-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 32px 0 60px 0;
}
.page-title-edit h2 {
  font-size: 34px;
  font-weight: 800;
  color: #ececec;
  text-align: center;
  margin: 0 0 24px 0;
}
.export-area {
  position: relative;
  width: ${areaWidth}px;
  min-height: ${areaHeight}px;
  margin: 0 auto 36px auto;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  z-index: 2;
}
.export-area .export-grid {
  position: absolute;
  width: 100%; height: 100%;
  top: 0; left: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0;
  background-image:
    repeating-linear-gradient(to right, #fff 0 1px, transparent 1px 64px),
    repeating-linear-gradient(to bottom, #fff 0 1px, transparent 1px 64px);
}
.draggable-div {
  position: absolute;
  background: rgba(50,50,50,0.84);
  border: 2px solid #686868;
  border-radius: 10px;
  box-shadow: 0 4px 18px 0 rgba(0,0,0,0.08);
  color: #fff;
  padding: 16px;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  min-width: 120px;
  min-height: 80px;
  user-select: text;
  overflow: visible;
  font-family: inherit;
  font-weight: bold;
  z-index: 2;
  transition: 
    background 0.18s, 
    box-shadow 0.18s, 
    transform 0.18s, 
    border-color 0.18s;
}
.draggable-div:hover, .draggable-div:focus-visible {
  background: rgba(70,70,70,0.92);
  box-shadow: 0 8px 36px 0 #000a;
  border-color: #aaa;
  transform: scale(1.034);
  z-index: 99;
}
.div-content {
  flex: 1;
  min-height: 36px;
  background: transparent;
  color: #fff;
  padding: 0;
  margin-bottom: 8px;
  word-break: break-word;
  outline: none;
  font-family: inherit;
  font-weight: bold;
}
.div-buttons-area { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 8px; }
.div-link-btn {
  background: #333c;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  padding: 7px 16px;
  font-size: 15px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: background 0.2s;
  margin-right: 5px;
  font-family: inherit;
}
.div-link-btn:hover, .div-link-btn:focus {
  background: #555d;
  color: #fff;
  text-decoration: underline;
}
footer {
  width: 100%;
  background: #1a1a1a;
  padding: 10px 0;
  text-align: center;
  font-size: 14px;
  color: #888;
  border-top: 1px solid #222;
  min-height: 36px;
  position: fixed;
  bottom: 0;
  left: 0;
  font-family: inherit;
  font-weight: bold;
}
`;

  // 5. JS pentru particole animate
  const pointsJs = `
(function(){
var POINTS_COUNT = ${dotsCount};
var points = [];
function randomBetween(a, b) {return Math.random() * (b - a) + a;}
function animatePoints() {
  var w = window.innerWidth, h = window.innerHeight;
  for (var i = 0; i < points.length; i++) {
    var p = points[i];
    p.vx += randomBetween(-0.012, 0.012);
    p.vy += randomBetween(-0.012, 0.012);
    p.vx = Math.max(-0.13, Math.min(0.13, p.vx));
    p.vy = Math.max(-0.13, Math.min(0.13, p.vy));
    p.x += p.vx;
    p.y += p.vy;
    if (p.x <= 0 || p.x >= w - ${dotsSize}) p.vx = -p.vx;
    if (p.y <= 0 || p.y >= h - ${dotsSize}) p.vy = -p.vy;
    p.x = Math.max(0, Math.min(p.x, w - ${dotsSize}));
    p.y = Math.max(0, Math.min(p.y, h - ${dotsSize}));
    p.dot.style.left = p.x + 'px';
    p.dot.style.top = p.y + 'px';
  }
  requestAnimationFrame(animatePoints);
}
function initPoints() {
  var container = document.getElementById('points-bg');
  if (!container) return;
  var w = window.innerWidth, h = window.innerHeight;
  var dots = container.querySelectorAll('.point-dot');
  points = [];
  for (var i = 0; i < dots.length; i++) {
    var dot = dots[i];
    var px = parseFloat(dot.style.left) || randomBetween(0, w - ${dotsSize});
    var py = parseFloat(dot.style.top) || randomBetween(0, h - ${dotsSize});
    points.push({
      x: px,
      y: py,
      vx: randomBetween(-0.08, 0.08),
      vy: randomBetween(-0.08, 0.08),
      dot: dot
    });
  }
}
window.addEventListener('resize', initPoints);
initPoints();
animatePoints();
})();
`;

  // 6. HTML exportat
  const exportHtml = `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <title>${pageTitle.textContent.replace(/\s+/g, ' ')}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>${exportCSS}</style>
</head>
<body>
  ${pointsHtml}
  <div class="main-content" style="position:relative;z-index:1;">
    <div class="page-title-edit">
      <h2>${pageTitle.innerHTML}</h2>
    </div>
    <div class="export-area">
      <div class="export-grid"></div>
      ${contentHtml}
    </div>
  </div>
  <footer>
    ${copyright}
  </footer>
  <script>${pointsJs}</script>
</body>
</html>
`;

  const blob = new Blob([exportHtml], { type: "text/html" });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = "index.html";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { a.remove(); }, 100);
});