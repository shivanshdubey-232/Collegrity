const btn = $('.back-to-top');

$(window).scroll(function() {
  if ($(window).scrollTop() > 300) {
    btn.addClass('show');
  } else {
    btn.removeClass('show');
  }
});

btn.on('click', function(e) {
  e.preventDefault();
  window.scrollTo({
    top: 100,
    behavior: "smooth",
  });
});

