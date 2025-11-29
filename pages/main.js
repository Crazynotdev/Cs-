document.addEventListener('DOMContentLoaded', () => {
  const pairForm = document.getElementById('pairForm');
  const phoneInput = document.getElementById('phoneInput');
  const pairResult = document.getElementById('pairResult');
  const codeTxt = document.getElementById('codeTxt');
  const copyBtn = document.getElementById('copyBtn');
  const alertDiv = document.getElementById('alert');
  const showSessions = document.getElementById('showSessions');
  const adminSection = document.getElementById('adminSection');
  const sessionsList = document.getElementById('sessionsList');
  const logsTable = document.getElementById('logsTable');
  const closeAdmin = document.getElementById('closeAdmin');

  // Générer le code pairing
  pairForm.addEventListener('submit', async e => {
    e.preventDefault();
    alertDiv.classList.add('hidden');
    pairResult.classList.add('hidden');
    let number = phoneInput.value.trim();
    if (!/^\+\d{8,16}$/.test(number)) {
      alertDiv.textContent = "Numéro WhatsApp non valide !";
      alertDiv.classList.remove('hidden');
      return;
    }
    // Demande code pairing
    try {
      const resp = await fetch('/api/pairing', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ number })
      });
      const data = await resp.json();
      if (data.error) {
        alertDiv.textContent = data.error;
        alertDiv.classList.remove('hidden');
      } else if (data.code) {
        codeTxt.textContent = data.code;
        pairResult.classList.remove('hidden');
        // Save JID pour récupération session...
      } else {
        alertDiv.textContent = "Erreur inattendue.";
        alertDiv.classList.remove('hidden');
      }
    } catch (err) {
      alertDiv.textContent = "Impossible de contacter le serveur.";
      alertDiv.classList.remove('hidden');
    }
  });

  // Copier le code dans le presse-papier
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(codeTxt.textContent);
    copyBtn.textContent = "Copié ✔";
    setTimeout(() => copyBtn.textContent = "Copier le code", 1600);
  });

  // Afficher l’admin (sessions + logs)
  showSessions.addEventListener('click', async () => {
    adminSection.classList.remove('hidden');
    // Récup session active
    try {
      const r = await fetch('/api/admin/sessions');
      const d = await r.json();
      sessionsList.innerHTML = d.map(sess => `
        <li class="mb-1 text-green-700"><b>${sess.jid}</b> <span class="text-xs text-gray-400">${sess.session.version || ''}</span></li>
      `).join('');
    } catch {}
    // Récup logs
    try {
      const r = await fetch('/api/admin/logs');
      const d = await r.json();
      logsTable.innerHTML = `<table class="w-full"><tr>
        <th>Heure</th><th>JID</th><th>Action</th><th>Plus...</th></tr>${
        d.slice(-35).reverse().map(l => `<tr>
          <td class="pr-2">${new Date(l.timestamp).toLocaleTimeString()}</td>
          <td class="pr-2">${l.jid || '-'}</td>
          <td class="pr-2 font-semibold">${l.action||"-"}</td>
          <td class="text-gray-600">${l.code || l.text || l.response || l.reason || ''}</td>
        </tr>`).join('')
      }</table>`;
    } catch {}
  });

  // Fermer admin
  closeAdmin.addEventListener('click', () => adminSection.classList.add('hidden'));
});
