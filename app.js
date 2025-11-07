
(function(){
  function qs(s,root){ return (root||document).querySelector(s); }
  function qsa(s,root){ return Array.from((root||document).querySelectorAll(s)); }

  function toggleTargets(targets, force){
    targets.forEach(function(el){
      var isHidden = el.classList.contains('hidden');
      var willOpen = force !== undefined ? force : isHidden;
      el.classList.toggle('hidden', !willOpen);
      el.classList.toggle('open', willOpen);
    });
  }

  // Bind any element that declares a target
  qsa('[data-toggle-target], [aria-controls], .burger').forEach(function(btn){
    var targetSelectors = [];
    var attr = btn.getAttribute('data-toggle-target');
    if (attr) targetSelectors = attr.split(',').map(function(s){ return s.trim(); });
    var aria = btn.getAttribute('aria-controls');
    if (aria) targetSelectors.push('#'+aria);

    if (targetSelectors.length === 0){
      // fallback: next sibling with role menu or class mobile-menu/menu
      var next = btn.nextElementSibling;
      if (next) targetSelectors.push('#'+(next.id || (next.className? '.'+next.className.split(' ').join('.') : '')));
    }
    var targets = [];
    targetSelectors.forEach(function(sel){
      try{
        if (!sel) return;
        if (sel.startsWith('#') && sel.length>1){
          var byId = document.getElementById(sel.slice(1));
          if (byId) targets.push(byId);
        }else{
          qsa(sel).forEach(function(el){ targets.push(el); });
        }
      }catch(e){}
    });
    btn.addEventListener('click', function(e){
      e.preventDefault();
      toggleTargets(targets);
      // aria-expanded
      var anyOpen = targets.some(function(t){ return !t.classList.contains('hidden'); });
      btn.setAttribute('aria-expanded', String(anyOpen));
    });
  });

  // Close menus when clicking outside
  document.addEventListener('click', function(e){
    qsa('.open').forEach(function(menu){
      // elements that toggled it?
      var toggler = qsa('[aria-controls="'+menu.id+'"], [data-toggle-target*="#'+menu.id+'"]')
        .find(function(b){ return b.contains(e.target); });
      if (!menu.contains(e.target) && !toggler){
        menu.classList.add('hidden');
        menu.classList.remove('open');
        qsa('[aria-controls="'+menu.id+'"]').forEach(function(b){ b.setAttribute('aria-expanded','false'); });
      }
    });
  });

  // Close on Escape
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape'){
      qsa('.open').forEach(function(menu){
        menu.classList.add('hidden'); menu.classList.remove('open');
      });
      qsa('[aria-expanded="true"]').forEach(function(b){ b.setAttribute('aria-expanded','false'); });
    }
  });
})();
