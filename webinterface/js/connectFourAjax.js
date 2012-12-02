goog.provide('cfAjax');

goog.require('goog.Uri');
goog.require('goog.net.XhrIo');

/** @private */
cfAjax.servUrl = 'lib/restServ.php'

cfAjax.getMove = function (state, callback) {
    var qd = new goog.Uri.QueryData ();
    qd.add ('state', state);
    goog.net.XhrIo.send (cfAjax.servUrl, callback, 'POST', qd.toString());
}