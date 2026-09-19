var FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbwdCFqeK0OXNwu7YkeM-nzoP7TbW7gzYJUw3SN0-GUgj8-ovdEIwV9vjp4O0ULMMLZZ/exec";

document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('form[data-name="Contact Form"]').forEach(function(form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      e.stopPropagation();
      var data = {
        formType: "contact",
        name: form.querySelector('[name="Contact-Name"]') ? form.querySelector('[name="Contact-Name"]').value : "",
        email: form.querySelector('[name="Contact-Email"]') ? form.querySelector('[name="Contact-Email"]').value : "",
        phone: form.querySelector('[name="Contact-Phone"]') ? form.querySelector('[name="Contact-Phone"]').value : "",
        message: form.querySelector('[name="Contact-Message"]') ? form.querySelector('[name="Contact-Message"]').value : ""
      };
      fetch(FORM_ENDPOINT, { method: "POST", body: JSON.stringify(data), mode: "no-cors" })
        .then(function() {
          form.style.display = "none";
          var done = form.parentElement.querySelector(".w-form-done");
          if (done) done.style.display = "block";
        });
    });
  });

  document.querySelectorAll('form[data-name="Footer Subscribe Form"], form[data-name="Subscribe Form"], form[data-name="Hero Subscribe Form"], form[data-name="Email Form"]').forEach(function(form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      e.stopPropagation();
      var emailInput = form.querySelector('[name="Subscriber-Email"]') || form.querySelector('[name="Signup-Email"]') || form.querySelector('[type="email"]');
      var data = {
        formType: "subscribe",
        email: emailInput ? emailInput.value : "",
        source: form.getAttribute("data-name") || "Website"
      };
      fetch(FORM_ENDPOINT, { method: "POST", body: JSON.stringify(data), mode: "no-cors" })
        .then(function() {
          form.style.display = "none";
          var done = form.parentElement.querySelector(".w-form-done");
          if (done) done.style.display = "block";
        });
    });
  });
});
