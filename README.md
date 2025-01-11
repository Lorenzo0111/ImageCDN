# ImageCDN

<div align="center">

[![GitHub Release](https://img.shields.io/github/v/release/Lorenzo0111/ImageCDN)](https://github.com/Lorenzo0111/ImageCDN/releases/latest)
[![GitHub License](https://img.shields.io/github/license/Lorenzo0111/ImageCDN)](LICENSE)
[![Discord](https://img.shields.io/discord/1088775598337433662)](https://discord.gg/HT47UQXBqG)

</div>

## What is ImageCDN

ImageCDN is a simple image hosting service that allows you to upload images and share them with your friends.

## Deploying

You'll have to set the following environment variables to setup the api:

### Dashboard Environment Variables

| Key          | Description   | Example                             |
| ------------ | ------------- | ----------------------------------- |
| DATABASE_URL | The MySQL URL | mysql://root:example@localhost:3306 |

### Selfhosting

If you want to selfhost, you can run `bun install`, `bun start` to start the program.

The api will usually be available [here](http://localhost:3000/).

## Routes

| Route          | Method | Description                | Body            |
| -------------- | ------ | -------------------------- | --------------- |
| /              | GET    | Get info about the api     |                 |
| /images/upload | POST   | Upload an image to the api | FormData: image |
| /images/:id    | GET    | Get an image by id         |                 |
| /images/:id    | DELETE | Delete an image by id      | JSON: deleteKey |
| /images/random | GET    | Get a random image         |                 |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you need help, feel free to join the [Discord Server](https://discord.gg/HT47UQXBqG) or open an issue.
