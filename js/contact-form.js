/* Earth Exports · contact form + "notify me" signup.
   If a Formspree ID is set in js/forms-config.js, the form POSTs to https://formspree.io/f/<ID>
   and shows an honest success or error message. If the ID is still the "YOUR_…" placeholder,
   it falls back to a prefilled mailto: link (the pre-Formspree behaviour). */
(function () {
  "use strict";
  var CFG = window.EE_FORMS || {};
  var TO = CFG.EMAIL || "earthexportsshop@gmail.com";
  function configured(id) { return !!id && !/^YOUR_/.test(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function status(form, cls, html) {
    var el = form.querySelector(".form-status");
    if (!el) {
      el = document.createElement("p"); el.setAttribute("role", "status"); el.setAttribute("aria-live", "polite");
      (form.querySelector(".form-body") || form).appendChild(el);
    }
    el.className = "form-note form-status " + cls;
    el.innerHTML = html;
    return el;
  }
  var mailLink = '<a href="mailto:' + TO + '">' + TO + '</a>';
  function wire(form, id, buildMail, okMsg, opts) {
    opts = opts || {};
    var done = function (kind) { if (opts.onResult) try { opts.onResult(kind); } catch (e) {} };
    var useFs = configured(id);
    form.dataset.mode = useFs ? "formspree" : "mailto"; // exposed for QA
    if (useFs) {
      form.setAttribute("action", "https://formspree.io/f/" + id);
      form.setAttribute("method", "POST");
      form.removeAttribute("enctype");
    }
    form.addEventListener("submit", function (e) {
      if (!form.checkValidity()) return; // browser shows required-field hints
      e.preventDefault();
      if (!useFs) {
        var href = buildMail();
        form.dataset.mailto = href;
        status(form, "form-sent", "Your email app should open now with everything filled in. Just hit send. If nothing happened, email us at " + mailLink + ".");
        window.location.href = href;
        done("mailto");
        return;
      }
      var btn = form.querySelector("button[type=submit]");
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Sending…"; }
      status(form, "form-pending", "Sending…");
      fetch("https://formspree.io/f/" + id, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) {
          if (r.ok) { form.reset(); status(form, "form-ok", okMsg); done("ok"); return; }
          return r.json().catch(function () { return {}; }).then(function (j) {
            var why = j && j.errors && j.errors.length ? " (" + esc(j.errors.map(function (x) { return x.message; }).join("; ")) + ")" : "";
            status(form, "form-err", "Sorry, that didn’t go through" + why + ". Please try again, or email us at " + mailLink + ".");
            done("err");
          });
        })
        .catch(function () { status(form, "form-err", "Sorry, we couldn’t reach the form service. Check your connection and try again, or email us at " + mailLink + "."); done("err"); })
        .then(function () { if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || "Send"; } });
    });
  }
  function notifyMail(email) {
    var body = "Please email me when the Earth Exports shop opens.\n\nMy email: " + email + "\n";
    return "mailto:" + TO + "?subject=" + encodeURIComponent("Notify me") + "&body=" + encodeURIComponent(body);
  }
  window.EEForms = { wire: wire, configured: configured, notifyMail: notifyMail, cfg: CFG };
  var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; };

  var query = document.getElementById("query");
  if (query) {
    wire(query, CFG.CONTACT_FORM_ID, function () {
      var topic = v("intent") || "Question";
      var subject = "Earth Exports: " + topic;
      var body = "Name: " + v("name") + "\nEmail: " + v("email") + "\nAbout: " + topic + "\n\n" + v("message") + "\n";
      return "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    }, "Thanks! Your message reached our inbox. We usually reply within a few days.");
    if (configured(CFG.CONTACT_FORM_ID)) {
      var how = query.querySelector(".form-how"); if (how) how.textContent = "“Send message” sends your note straight to our inbox. Real people reply, usually within a few days.";
      var fc = query.querySelector(".fc-how"); if (fc) fc.textContent = "sends to our inbox";
    }
  }
  var notify = document.getElementById("notify-form");
  if (notify) {
    wire(notify, CFG.NOTIFY_FORM_ID, function () { return notifyMail(v("notify-email")); }, "You’re on the list. We’ll send one email when the shop opens.");
  }
})();
