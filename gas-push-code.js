// ============================================================
// ДОБАВИТЬ В GOOGLE APPS SCRIPT
// Файл: Code.gs (или основной файл)
// ============================================================

// --- Функция отправки push-уведомлений ---
function notifyAdmins(title, body, tag, url) {
  var pushUrl = 'https://gs-push-server.qwe1303rty.workers.dev/send';
  var payload = JSON.stringify({
    title: title || 'ГС Заказы',
    body: body || 'Новое уведомление',
    tag: tag || 'gs-order',
    url: url || '/gastro-admin/'
  });

  try {
    UrlFetchApp.fetch(pushUrl, {
      method: 'POST',
      contentType: 'application/json',
      payload: payload,
      muteHttpExceptions: true
    });
  } catch (e) {
    Logger.log('Push notification failed: ' + e.message);
  }
}

// ============================================================
// ВСТАВИТЬ ВЫЗОВ В СУЩЕСТВУЮЩУЮ ФУНКЦИЮ doPost()
// Найти место ПОСЛЕ создания заказа и записи в таблицу
// ============================================================

// Пример: если doPost записывает заказ и получает orderId:
//
//   // ... существующий код создания заказа ...
//   var orderId = 'ORD-' + ...;
//   var customerName = ...;
//   var totalPrice = ...;
//
//   // >>> ДОБАВИТЬ ПОСЛЕ ЭТОГО <<<
//   notifyAdmins(
//     'Новый заказ! ' + orderId,
//     customerName + ' — ' + totalPrice + '₽',
//     'order-' + orderId,
//     '/gastro-admin/order/' + orderId
//   );
//
//   // ... остальной код ...
