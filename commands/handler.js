function handleCommand(text) {
  switch ((text || '').trim().toLowerCase()) {
    case '.menu':
      return `🎯 Commandes disponibles :
- .menu
- .help
- .info`;
    case '.help':
      return `📃 Utilisez le pairing code pour connecter votre bot WhatsApp.
Commandes customisées : .menu, .info, etc.`;
    case '.info':
      return 'ℹ️ crazy-mini - Plateforme SaaS WhatsApp Bot 🤖';
    default:
      return null; // rien pour messages provenant des users n'invoquant pas une commande
  }
}
module.exports = { handleCommand };
