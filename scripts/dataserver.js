'use strict';


const description = "";
const chalk = require('chalk');
const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');
const yargs = require('yargs');
let request = require('request');

/**
 * Allow random color generation for Chalk package.
 * @returns {string}
 */
function getRandomColor() {
  const letters = 'ABCDEF'.split('');
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

chalk.random = str => chalk.hex(getRandomColor()).inverse(str);

const DDF_SAP = '';

const cookies = request.jar();
request = request.defaults({ jar: cookies });

yargs
  .usage(description)
  .version(false)
  .option('env', {
    alias: 'e',
    description: 'Context of the dataserver. It basically defines the config file to use',
    type: 'string'
  })
  .example('npm run dataserver', 'Launch the dataserver by using the db/config.js')
  .example('npm run dataserver -- --env=test', 'Launch the dataserver by using the db/config.js')
  .wrap(null);

const parameters = yargs.parse(process.argv);

/*
  Look for config.'env'.js, ie 'node dataserver --env=test' will load db/config.test.js
  The same with npm run : npm run dataserver -- --env=test
  By default, laod db/config.js
*/
const env = parameters.env ? '.' + parameters.env : '';
const configName = `/db/config${env}.js`;
let config;

try {
  config = require('..' + configName).values;
} catch (e) {
  console.error(e);
  console.error('Unable to load the configuration file. Please check the file ', configName);
  console.log('You can create one based on config.test.js');
}

const port = config.port || 4300;
const liveServerBase = config.liveUrl;
const DDFliveServerBase = config.DDFliveUrl;
const firstUrlPathRegExp = /^\/[^/]*\//;
const urlParametersRegExp = /\?[^?]*$/;

/**
 * Nice counter to follow requests if needed.
 * @type {number}
 */
let counter = 0;

// var readline = require('readline-sync');
// var username = config.upmUsername || readline.question("Enter your windows username (for UPM auth)", {hideEchoBack: true});
// var password = config.upmPassword || readline.question("Enter your windows password (for UPM auth)", {hideEchoBack: true});

function followRedirects(url, onEnd, onErr, maxRedirects = 10, isWithAuth = false) {
  let auth;

  if (maxRedirects < 0) {
    onErr('Max number of redirects exceeded (infinite loop?)');
    return;
  }

  console.log('Login process, going to ' + url + ' (isWithAuth: ' + isWithAuth + ')');
  if (isWithAuth) {
    auth = { user: username, pass: password };
  }

  request.get(url, { auth: auth, followRedirect: false }).on('response', function(response) {
    if (response.statusCode === 302 || response.statusCode === 301) {
      const newUrl = getRedirectAbsoluteUrl(url, response.headers);
      followRedirects(newUrl, onEnd, onErr, maxRedirects - 1, false);
    } else if (response.statusCode === 401) {
      if (!isWithAuth) {
        followRedirects(url, onEnd, onErr, maxRedirects - 1, true);
      } else {
        onErr('401 status on ' + url);
      }
    } else if (response.statusCode === 403) {
      onErr('403 (unauthorized status on ' + url + ' (wrong user/pass?)');
    } else if (response.statusCode === 200) {
      onEnd('Login process finished with OK status on ' + url);
      response.on('data', function(data) {
        console.log('Login process reply:' + data);
      });
    } else {
      onErr('Unexpected status code: ' + response.statusCode);
    }
  });
}

function loginProcess(finalResponse) {
  followRedirects(
    liveServerBase + '/api/login',
    function(msg) {
      console.log(msg);
      finalResponse.end(msg);
    },
    function(msg) {
      console.error(msg);
      finalResponse.end(msg);
    }
  );
}

function getRedirectAbsoluteUrl(initialUrl, responseHeaders) {
  let newUrl = responseHeaders['Location'] || responseHeaders['location'];
  if (!newUrl.startsWith('http')) {
    const u = url.parse(initialUrl);
    newUrl = u.protocol + '//' + u.host + newUrl;
  }
  return newUrl;
}

function getTargetName(req, params, isDefault) {
  const targetName = [];
  let url = req.url.replace(firstUrlPathRegExp, '').replace(urlParametersRegExp, '');
  // .replace(/\//g, separator)

  if (isDefault && url.indexOf('/') !== -1) {
    const depth = 1; //= (url.match(/\//g) || []).length;
    url = url.substr(0, url.lastIndexOf('/'));
    targetName.push(url);
    for (let i = 0; i < depth; i++) {
      targetName.push('/default/');
    }
  } else {
    targetName.push(url);
  }

  if (params) {
    targetName.push(
      '/',
      req.method,
      '_',
      crypto
        .createHash('md5')
        .update([req.url, req.method, params].join(''))
        .digest('hex')
    );
  } else {
    targetName.push('/', req.method, '_default');
  }

  targetName.push('.js');

  return path.join(config.staticFolder || '', targetName.join(''));
}

function getCounter() {
  return ++counter;
}

function processRequest(req, res, params) {
  const url = req.url;
  const method = req.method;
  const targetFile = getTargetName(req, params);
  const targetDefaultFile = getTargetName(req, null);
  const fullPath = path.join(__dirname, '..', 'db', targetFile);
  const fullPathDefaultFile = path.join(__dirname, '..', 'db', targetDefaultFile);
  const auth = req.headers.authorization;

  console.log('\n' + chalk.random(' ' + getCounter() + ' ') + ' Hit on ' + url);

  if (config.mode !== 'live' && fs.existsSync(fullPath)) {
    serveLocalFile(fullPath, res);
  } else if (config.mode !== 'live' && fs.existsSync(fullPathDefaultFile)) {
    console.log(chalk.yellow('Static file not found'), chalk.red(fullPath));
    serveLocalFile(fullPathDefaultFile, res);
  } else if (config.mode !== 'static') {
    // always use available live DDF API when no local file found
    relayToServer(url, method, params, res, fullPath, auth);
  } else {
    // config.mode is static here - look for generic default mock file without any params
    const targetDefaultFile = getTargetName(req, null, true);
    const fullDefaultPath = path.join(__dirname, '..', 'db', targetDefaultFile);

    console.log(chalk.yellow('Static file not found'), chalk.red(fullPath));

    if (fs.existsSync(fullDefaultPath)) {
      serveLocalFile(fullDefaultPath, res);
    } else {
      console.log('Static default file not found', chalk.red(fullDefaultPath));
      res.statusCode = 404;
      res.end(chalk.yellow('Static file not found'));
    }
  }
}

function serveLocalFile(fullPath, res) {
  console.log(chalk`{green Serving cached file} {underline ${fullPath}}`);
  try {
    delete require.cache[fullPath];
    const content = require(fullPath).DATA;
    res.statusCode = content.statusCode || 200;
    res.end(JSON.stringify(content.response || content));
  } catch (err) {
    console.log(err);
    res.statusCode = 404;
    res.end('Unable to get the file ' + fullPath);
  }
}

function relayToServer(url, method, params, myResponse, filePath, auth) {
  let serverUrl = liveServerBase + url;
  if (url.startsWith(DDF_SAP)) {
    serverUrl = DDFliveServerBase + url;
  }
  console.log(' Fetching ' + serverUrl);

  const requestOptions = {
    uri: serverUrl,
    method: method,
    headers: {
      Authorization: auth
    }
  };

  if (method === 'POST' || method === 'PUT') {
    requestOptions.body = params;
  }

  request(requestOptions, function(error, response, body) {
    console.log('response body: ', body);
    if (response && response.statusCode === 200) {
      if (config.mode !== 'live') {
        // Do not save local files for DDF API as it will generate a lot of files
        saveLocalFile(filePath, body);
      }
      myResponse.end(body);
    } else {
      myResponse.statusCode = response ? response.statusCode : 404;
      myResponse.end(body);
    }
  });
}

function saveLocalFile(filePath, content) {
  console.log(filePath);
  fs.writeFile(filePath, content, function(err) {
    if (err) {
      console.log('Error writing file ' + filePath + ': ' + err);
    } else {
      console.log('Saved file ' + filePath);
    }
  });
}

const server = http.createServer(function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method !== 'OPTIONS') {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method ==='DELETE') {
      let body = '';
      req.on('data', function(data) {
        body += data;
      });
      req.on('end', function() {
        req.body = body;
        processRequest(req, res, body);
      });
    } else if (req.method === 'GET') {
      let params = req.url.split('?');
      params.shift();
      params = params.join('?');

      processRequest(req, res, params);
    }
  } else {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    res.end();
  }
});

server.listen(port);
console.clear();
console.log(chalk.inverse('Web server started on localhost:' + port + ' ...'));
