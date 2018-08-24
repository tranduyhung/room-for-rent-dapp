App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }

    web3 = new Web3(App.web3Provider);

    if (web3.version.network != 3) {
      $('#error').html('Please switch your MetaMask network to Ropsten.');
    } else {
      return App.render();
    }
  },

  render: function() {
    var rooms = $('#rooms');
    var roomTemplate = $('#roomTemplate');

    for (i = 0; i < 100; i++) {
      roomTemplate.find('.room-name').text('Room ' + (i + 1));
      roomTemplate.find('.rent-button').attr('data-room-id', i);

      rooms.append(roomTemplate.html());
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('RoomForRent.json', function(data) {
      var RoomForRentArtifact = data;

      App.contracts.RoomForRent = TruffleContract(RoomForRentArtifact);
      App.contracts.RoomForRent.setProvider(App.web3Provider);

      return App.getStatus();
    });

    return App.bindEvents();
  },

  getStatus: function() {
    App.contracts.RoomForRent.deployed().then(function(instance) {
      return instance.getRentors.call();
    }).then(function(rentors) {
      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }

        var account = accounts[0];

        for (i = 0; i < rentors.length; i++) {
          if (rentors[i] !== '0x0000000000000000000000000000000000000000') {
            if (rentors[i] != account) {
              App.markUnavailable(i);
            } else {
              App.markLeave(i);
            }
          }
        };
      });
    }).catch(function(error) {
      console.log(error.message);
    });
  },

  markAvailable: function(roomId) {
    $('.room').eq(roomId).find('button').text('Rent')
      .removeClass('button-leave').addClass('pure-button-primary')
      .attr('disabled', false);
  },

  markUnavailable: function(roomId) {
    $('.room').eq(roomId).find('button').text('Unavailable')
      .removeClass('pure-button-primary').attr('disabled', true);
  },

  markLeave: function(roomId) {
    $('.room').eq(roomId).find('button').removeClass('pure-button-primary')
      .addClass('button-leave').text('Leave');
  },

  bindEvents: function() {
    $(document).on('click', '.rent-button', App.handleClick);
  },

  handleClick: function(event) {
    var roomId = parseInt($(event.target).data('room-id'));

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var contractInstance;
      var account = accounts[0];
      var rent = true;

      App.contracts.RoomForRent.deployed().then(function(instance) {
        contractInstance = instance;

        return contractInstance.isRentor(roomId);
      }).then(function(isRentor) {
        if (!isRentor) {
          contractInstance.rent(roomId, { from: account }).then(function(result) {
            if (result.receipt.status == '0x1' || result.receipt.status == '0x01') {
              App.markLeave(roomId);
            }
          });
        } else {
          contractInstance.leave(roomId, { from: account }).then(function(result) {
            if (result.receipt.status == '0x1' || result.receipt.status == '0x01') {
              App.markAvailable(roomId);
            }
          });
        }
      }).catch(function(error) {
        console.log(error.message);
      });
    });
  }
}

$(function() {
  window.addEventListener('load', function() {
    if (typeof web3 !== 'undefined') {
      App.init();
    } else {
      $('#error').html('Please add <a href="https://metamask.io/" target="_blank">Metamask<a/> to your browser and refresh the page.');
    }
  });
});
