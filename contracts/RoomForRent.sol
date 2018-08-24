pragma solidity ^0.4.24;

contract RoomForRent {
  address[20] public rentors;

  function rent(uint roomId) public returns (uint) {
    require(roomId >= 0 && roomId < 20);
    require(rentors[roomId] == address(0));

    rentors[roomId] = msg.sender;

    return roomId;
  }

  function leave(uint roomId) public returns (uint) {
    require(roomId >= 0 && roomId < 20);
    require(rentors[roomId] == msg.sender);

    rentors[roomId] = address(0);

    return roomId;
  }

  function isRentor(uint roomId) public view returns (bool) {
    require(roomId >= 0 && roomId < 20);

    if (rentors[roomId] == msg.sender) {
      return true;
    } else {
      return false;
    }
  }

  function getRentors() public view returns (address[20]) {
    return rentors;
  }
}
