# services-config

## Description

Fetch and validate service configurations more easily by first trying to
retrieve `SERVICE_ENV_{service name}` from command line, then from `process.env.SERVICE_ENV_{service name}` and if all else
fails it will be set to the service default. The resulting value will be used to
get a specific configuration from the given service.

## Installation

```zsh
$ npm install --save services-config
```

*If you'd like to try these examples, please run `gulp prepare-examples` first*

## Running tests

```zsh
$ gulp test
```

Test reports are written to `./reports`.

## Contributing

-   Do pull requests.
-   Make sure there's tests and meaningful coverage.
-   Respect `./eslintrc`.
-   Issues should go in issues.
