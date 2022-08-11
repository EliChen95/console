#!/usr/bin/env node

const yargs = require('yargs');

const { devServer, buildProd, buildDll, buildExtension } = require('./webpack');
const createExtension = require('../extension/createExtension');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const argv = yargs
  .command(
    'dev',
    'Start development server',
    {
      setAlias: {
        alias: 's',
        default: 'false',
      },
    },
    args => {
      devServer(args.setAlias);
    },
  )
  .command(
    'build:prod',
    'Build production',
    {
      setAlias: {
        alias: 's',
        default: 'false',
      },
    },
    args => {
      buildProd(args.setAlias);
    },
  )
  .command(
    'build:dll',
    'Build DLL',
    {
      setAlias: {
        alias: 's',
        default: 'false',
      },
    },
    args => {
      buildDll(args.setAlias);
    },
  )
  .command('create:ext', 'Create a new extension', {}, () => {
    createExtension();
  })
  .command(
    'build:ext <name>',
    'Build extension',
    args => {
      return args.option('name', { description: 'Extension name' });
    },
    args => {
      buildExtension(args.name);
    },
  )
  .help().argv;
