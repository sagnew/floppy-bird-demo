# Step by Step Demo Instructions

First things first, make sure you follow the [steps below](#setup) beautifully written by DevEd for setting up the Sync quickstart (`npm install` and all that jazz). When you're finished with those steps, you should be able to run `node .` and visit [http://localhost:3000](http://localhost:3000) and see a working version of Floppy Bird with no Sync functionality.

Now you can hop into the live coding with the premise that this game is fun to play alone, but would be much more fun to play with the entire audience.

You can find the diff [here](https://github.com/sagnew/floppy-bird-demo/commit/a65de670a3dc8b919b62a508cf672f4dc177cba2) between the code you start with and the code you finish the demo with.

## Live Coding demo

First open `public/index.html` and add the scripts we need that link to Twilio's CDN:

```
<script src="//media.twiliocdn.com/sdk/js/common/v0.1/twilio-common.min.js"></script>
<script src="//media.twiliocdn.com/sdk/js/sync/v0.2/twilio-sync.min.js"></script>
```

It's a good idea to have the [Sync documentation](https://www.twilio.com/docs/api/sync/sync-sdk-download) open that you can copy and paste these from. But we also need to make sure that these links don't contain any breaking changes at the time of your demo.

Next head over to `public/js/main.js` where the main logic for the game exists. Here is where we need to add Sync functionality.

Start by writing the skeleton of an AJAX request to grab a token from the server to the `$(document).ready(function() {` section of the code right after the variable declarations:

```JavaScript
  // Make a request to grab a token from the server
  $.getJSON('/token', {
    device: playerId
  }, tokenResponse => {
  
  });
```

Now that we have a token from the server, we need to use it to create an Access Manager and instantiate our Sync client:

```JavaScript
 // Use our token to authenticate with Twilio
 accessManager = new Twilio.AccessManager(tokenResponse.token);
 syncClient = new Twilio.Sync.Client(accessManager);
```

After this you can create a map for all of the players joining the game.

```JavaScript
    // Create a 'playersMap' sync object.
    syncClient.map('playersMap')
      .then(map => {
        playersMap = map;

      });
```

In the callback for this map, add a listener for the `itemAdded` event and create a new bird object whenever a new player joins the game:

```JavaScript
        // Create a new bird on the screen when an item is added to the map.
        playersMap.on('itemAdded', item => {
          if (playerId !== item.key) {
            var newBird = createBird(item);
            flyarea.appendChild(newBird);
          }
        });
```

Add another listener for the `itemUpdated` event. When this happens, grab the `div` associated with the updated player and update its position and orientation on the screen:

```JavaScript
        // When an item is updated, reset the div with that item's ID.
        playersMap.on('itemUpdated', item => {
          if (playerId !== item.key) {
            $(`#${item.key}`).css({ rotate: item.value.rotate, top: item.value.top });
          }
        });
```

We're now finished with the Sync map and all of the code in our token asynchronous request callback.

The final step is to "sync" (pun slightly intended) our `playersMap` object with the bird that our game is actually controlling. 

In the same file, head down to the `updatePlayer` function and add the following code immediately after the calculation of the `rotation` variable:

```JavaScript
  // Update the playersMap with this bird's current status.
  // This will be called on every game loop (so every frame of the game).
  if (playersMap) {
    playersMap.set(playerId, {
      rotate: rotation,
      top: position,
      id: playerId
    });
  }
```

This function gets called on each iteration of the game loop (however many times per second according to the frame rate we set). So on each game tick, we will tell Sync what is happening with the bird on our screen. Keep in mind this will also happen for *everyone* else connected to the game. This is how we are able to tell the vertical position of each player participating in the game.

With this, the demo should be finished and you should be able to restart the server and direct the audience to visit a URL so that they can play with you.

## Setup

# Sync Quickstart for Node.js

This application should give you a ready-made starting point for writing your
own real-time apps with Sync. Before we begin, we need to collect
all the config values we need to run the application:

| Config Value  | Description |
| :-------------  |:------------- |
Service Instance SID | Like a database for your Sync data - generate one with the curl command below.
Account SID | Your primary Twilio account identifier - find this [in the console here](https://www.twilio.com/console).
API Key | Used to authenticate - [Use the IP Messaging dev tools to generate one here](https://www.twilio.com/user/account/ip-messaging/dev-tools/api-keys).
API Secret | Used to authenticate - [just like the above, you'll get one here](https://www.twilio.com/user/account/ip-messaging/dev-tools/api-keys).

## Temporary: Generating a Service Instance

During the Sync developer preview, you will need to generate Sync service
instances via API until the Console GUI is available. Using the API key pair you
generated above, generate a service instance via REST API with this curl command:

```bash
curl -X POST https://preview.twilio.com/Sync/Services \
 -d 'FriendlyName=MySyncServiceInstance' \
 -u 'SKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX:your_api_secret'
```

## A Note on API Keys

When you generate an API key pair at the URLs above, your API Secret will only
be shown once - make sure to save this in a secure location, 
or possibly your `~/.bash_profile`.

## Setting Up The Node.js Application

Create a configuration file for your application:

```bash
cp config.sample.js config.js
```

Edit `config.js` with the four configuration parameters we gathered from above.

Next, we need to install our dependencies from npm:

```bash
npm install
```

Now we should be all set! Run the application using the `node` command.

```bash
node .
```

Your application should now be running at http://localhost:3000. Open this page
in a couple browsers or tabs, and start syncing!

## License

MIT
