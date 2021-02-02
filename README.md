# OpenDEX Desktop

A graphical user interface for setting up and/or interacting with an [opendex-docker](https://github.com/opendexnetwork/opendex-docker) environment.

## Getting started

- Download and run the OpenDEX Desktop executable. The latest release can be found [here](https://github.com/opendexnetwork/opendex-desktop/releases/latest).

- Make sure to have an [opendex-docker](https://github.com/opendexnetwork/opendex-docker) environment running with API enabled. You can do that by either entering the environment with `bash opendexd.sh --proxy.disabled=false` or enabling the API permanently in `mainnet.conf`:

```
[proxy]
disabled = false
expose-ports = ["8889"]
```

- The API is accessible via the following ports
  - mainnet: 8889 (`localhost:8889`) - _default_
  - testnet: 18889 (`localhost:18889`)
  - simnet: 28889 (`localhost:28889`)
- If you are running opendex-docker mainnet locally, OpenDEX Desktop connects automatically to this instance

## Application logs

Logs are written to the following locations

- on Linux: ~/.config/opendex-desktop/logs/
- on macOS: ~/Library/Logs/opendex-desktop/
- on Windows: %USERPROFILE%\AppData\Roaming\opendex-desktop\logs\

## Application data

Application data is stored in the following locations

- on Linux: ~/.config/opendex-desktop/
- on macOS: ~/Library/Application\ Support/opendex-desktop/
- on Windows: %USERPROFILE%\AppData\Roaming\opendex-desktop\

## Development

### Requirements

- Node v12.1.0+
- Yarn

### Install dependencies

`yarn`

### Start in development mode

#### Windows (Powershell)

`($env:HTTPS = "true") -and (yarn start)`

#### Linux, macOS (Bash)

`HTTPS=true yarn start`

### Tests

`yarn test`

### Lint

`yarn lint`

## Building an executable

`yarn build` to build for an OS the command is executed from.
