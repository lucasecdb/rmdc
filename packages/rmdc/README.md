# React Material Design Components

[![Build Status](https://img.shields.io/travis/lucasecdb/rmdc/master?style=flat-square)](https://travis-ci.com/lucasecdb/rmdc)
[![NPM](https://img.shields.io/npm/v/@lucasecdb/rmdc?style=flat-square)](https://www.npmjs.com/package/@lucasecdb/rmdc)
[![License](https://img.shields.io/github/license/lucasecdb/rmdc?style=flat-square)](https://github.com/lucasecdb/rmdc/blob/master/LICENSE)

This library is a [React](https://reactjs.org) adapter for the [Material Design Components for Web](https://github.com/material-components/material-components-web) package.
We aim to support all components currently implemented in MDC Web, but we are not there yet. Bellow you can find a table
that describes which components we have implemented yet, and we are working on adding documentation soon. For now, you can
see the components in action in our example app.

## Motivation

This library was created because the official adapter implementation for React was abandoned. The repo can be found [here](https://github.com/material-components/material-components-web-react).
Also, there were [some issues](https://github.com/material-components/material-components-web/issues/4357) with the foundation
implementation, which made the React components that used solely the foundation a bit awkward. These components weren't syncing
with the props passed, because the foundation kept an internal state which was made impossible to change via it's public API.

## Installation

```sh
yarn add @lucasecdb/rmdc
```

## Available components

| Component | Implemented |
| --- | --- |
| Button | ✅ |
| Card | ✅ |
| Checkbox | ✅ |
| CircularProgress | ✅ |
| Dialog | ✅ |
| Fab | ✅ |
| FloatingLabel | ✅ |
| FormField | ✅ |
| Icon | ✅ |
| IconButton | ✅ |
| LineRipple | ✅ |
| NotchedOutline | ✅ |
| Ripple | ✅ |
| Snackbar | ✅ |
| Tab | ✅ |
| TabBar | ✅ |
| TabIndicator | ✅ |
| TabScroller | ✅ |
| TopAppBar | ✅ |
| Typography | ✅ |
