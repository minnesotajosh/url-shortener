// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {

  $('form').submit(function(event) {
    event.preventDefault();
    var inputUrl = $('input').val();
    var patt = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
    var result = patt.test(inputUrl);
    if (result) {
    $.post('/api/submitUrl/', {url: inputUrl} , function(data) {
      $('.output').html(`Your URL is: https://perpetual-catsup.glitch.me/url/${data}`);
    });
    } else {
      $('.output').html('invalid url');
    }
  });

});
