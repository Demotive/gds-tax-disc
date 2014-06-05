var taxDisc = {

  // see server.rb - performance platform url
  urlUsers: '/tax-disc-users',
  urlSatisfaction: '/tax-disc-satisfaction',

  // array to hold 2 realtime user values
  usersCount: [],

  loadUsers: function() {
    // clear the users array
    taxDisc.usersCount.length = 0;
    loadUrl = taxDisc.urlUsers;
    if (typeof offline !== 'undefined') {
      taxDisc.populateUsers(tax_disc_users_json);
      return;
    }
    $.ajax({
      dataType: 'json',
      cache: false,
      url: loadUrl,
      success: function(d) {
        taxDisc.populateUsers(d);
      }
    });
  },

  populateUsers: function(d) {
    var i, _i;
    for (i=0, _i=d.data.length; i<_i; i++) {
      taxDisc.usersCount.push(d.data[i].unique_visitors)
    }
    // update the display
    taxDisc.updateUsersDisplay();
  },

  updateUsersDisplay: function() {
    var r = getRandomInt(0, taxDisc.usersCount.length);
    $('.tax-disc .users-count').text(taxDisc.usersCount[r]);
  },

  loadSatisfaction: function() {
    loadUrl = taxDisc.urlSatisfaction;
    if (typeof offline !== 'undefined') {
      taxDisc.renderSatisfaction(satisfaction_json);
      return;
    }
    $.ajax({
      dataType: 'json',
      cache: false,
      url: loadUrl,
      success: function(d) {
        taxDisc.renderSatisfaction(d);
      }
    });
  },

  renderSatisfaction: function(d) {
    var percent = scoreToPercentage(d.data[d.data.length-1].satisfaction_tax_disc);
    $('.tax-disc .user-satisfaction').text(percent);
    var el = $('.tax-disc .user-satisfaction-pie');
    var measure = el.width() / 2;
    renderPie($('.tax-disc .user-satisfaction-pie').get(0), measure, measure, measure, [percent, 100 - percent], ["#fff", "transparent"], "#006435");
  }

};

$(function() {
  taxDisc.loadUsers();
  taxDisc.loadSatisfaction();
  // set up a "wobble"
  var taxDiscWobble = window.setInterval(taxDisc.updateUsersDisplay, 10e3);
  // poll gov.uk once every 5 minutes
  var taxDiscUpdate = window.setInterval(taxDisc.loadUsers, 300e3);
});
