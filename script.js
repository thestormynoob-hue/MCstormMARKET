// افکت ظاهر شدن کارت‌ها
document.addEventListener('DOMContentLoaded',()=>{
  const cards = document.querySelectorAll('.product-card, .card');
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.style.opacity=1;
    });
  },{threshold:0.15});
  cards.forEach(c=>{
    c.style.opacity=0;
    c.style.transition='opacity 800ms ease, transform 0.8s ease';
    io.observe(c);
  });
});

// باز و بستن فرم ورود
document.addEventListener('DOMContentLoaded', ()=>{
  const loginBtn = document.querySelector('.login-btn');
  const modal = document.getElementById('login-modal');
  const closeBtn = document.getElementById('login-close');

  loginBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    modal.style.display = 'flex';
  });

  closeBtn.addEventListener('click', ()=>{
    modal.style.display = 'none';
  });

  // بستن با کلیک روی زمینه
  modal.addEventListener('click', (e)=>{
    if(e.target === modal) modal.style.display = 'none';
  });

  // دکمه گوگل (فعلاً فقط پیام تست)
  const googleBtn = document.querySelector('.google-btn');
  googleBtn.addEventListener('click', ()=>{
    alert('ورود با Google فعلاً فقط نمایشی است 😎');
  });
});
