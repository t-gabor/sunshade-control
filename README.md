# sunshade-control
[![Build][travis-image]][travis-url]

An automatic weather aware sunshade control web app to be run on a Raspberry Pi, with Node.js.

# Somfy 
Earlier a remote supporting open/close commands was hooked up on the GPIO.  
Now based on
[Pi-Somfy] the Somfy RTS commands are bit banged to
a 433MHz transmitter connected to GPIO4.  
``pigpiod`` needs to be installed.

```bash
sudo apt install pigpiod
```

# somfy-cli.js
A basic cli tool for configuring/using the virtual remote. The remote address is in ``somfy.json``.

```json
{
  "remoteAddress": 2594127,
  "rollingCode": 47
}
```

CLI usage examples:

```bash
dotenvx run -- node somfy-cli.js new-config
dotenvx run -- node somfy-cli.js open
dotenvx run -- node somfy-cli.js close
dotenvx run -- node somfy-cli.js prog
```

[Pi-Somfy]: https://github.com/Nickduino/Pi-Somfy
[travis-image]: https://travis-ci.org/t-gabor/sunshade-control.svg?branch=master
[travis-url]: https://travis-ci.org/t-gabor/sunshade-control
