# platform-config

## Easy setup

<%= examples.easy.index %> -->

```bash
$ node examples/easy
{ description: 'BY THE POWER OF DEVELOPMENT' }
```

```bash
$ node examples/easy --NODE_ENV production
{ description: 'BY THE POWER OF PRODUCTION' }
```

```bash
$ export NODE_ENV=production
$ node examples/easy
{ description: 'BY THE POWER OF PRODUCTION' }
```

```bash
$ echo $NODE_ENV
production
$ unset NODE_ENV
$ echo NODE_ENV

```
