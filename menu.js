(function () {
  function qs(sel, scope){ return (scope||document).querySelector(sel); }
  var btn = qs('#mobile-menu-button');
  var menu = qs('#mobile-menu');

  if (!btn || !menu) return;

  function toggle(){
    var isOpen = !menu.classList.contains('hidden');
    if (isOpen){
      menu.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    } else {
      menu.classList.remove('hidden');
      btn.setAttribute('aria-expanded', 'true');
    }
  }

  btn.addEventListener('click', toggle);
  // Close on ESC
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape'){
      if (!menu.classList.contains('hidden')) toggle();
    }
  });
  // Close on outside click
  document.addEventListener('click', function(e){
    var clickInsideMenu = menu.contains(e.target);
    var clickOnBtn = btn.contains(e.target);
    if (!clickInsideMenu && !clickOnBtn && !menu.classList.contains('hidden')){
      toggle();
    }
  });
})();