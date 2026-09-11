// Form handler - sends to Google Sheets via Apps Script
// UPDATE THIS URL after deploying Apps Script
var FORM_ENDPOINT = "";

document.addEventListener("DOMContentLoaded", function() {
  // Handle Contact Forms
  document.querySelectorAll('form[data-name="Contact Form"]').forEach(function(form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      if (!FORM_ENDPOINT) { alert("Form endpoint not configured yet"); return; }
      
      var data = {
        formType: "contact",
        name: form.querySelector('[name="Contact-Name"]')?.value,
        email: form.querySelector('[name="Contact-Email"]')?.value,
        phone: form.querySelector('[name="Contact-Phone"]')?.value,
        message: form.querySelector('[name="Contact-Message"]')?.value,
      };
      
      fetch(FORM_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(data),
        mode: "no-cors",
      }).then(function() {
        form.style.display = "none";
        form.parentElement.querySelector(".w-form-done").style.display = "block";
      });
    });
  });

  // Handle Subscribe Forms
  document.querySelectorAll('form[data-name="Footer Subscribe Form"], form[data-name="Subscribe Form"]').forEach(function(form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      if (!FORM_ENDPOINT) { alert("Form endpoint not configured yet"); return; }
      
      var emailInput = form.querySelector('[name="Subscriber-Email"], [name="Signup-Email"]');
      var data = {
        formType: "subscribe",
        email: emailInput?.value,
      };
      
      fetch(FORM_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(data),
        mode: "no-cors",
      }).then(function() {
        form.style.display = "none";
        form.parentElement.querySelector(".w-form-done").style.display = "block";
      });
    });
  });
});
