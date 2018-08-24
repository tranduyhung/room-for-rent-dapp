# Room For Rent DApp

Room For Rent is a very simple DApp for learning purpose. Click `Rent` button to rent a room and click `Leave` button to stop renting it.

[MetaMask](https://metamask.io) is required. The app is built to connect to Ropsten Test Network by default but you can change to your preferred network.

More features will be added.

## Local Development

* Install [Truffle](https://truffleframework.com/)
* Run your preferred Ethereum client
* Download/clone the repository, go into its folder
* Run `npm install`
* Change the host and post info in `truffle.js` and `src/js/app.js` to your network's ones if necessary
* Run `npm run build` to build CSS and JS files to `public` folder
* Run `truffle compile`
* Rum `truffle migrate` to deploy your contract to the network
* Run `npm run dev` to start the server and the app
