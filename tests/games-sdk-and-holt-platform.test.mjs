import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { guestIdentityResponse } from "../src/server/holt-identity.mjs";

const file = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("The original website2 SDK router remains for reference, and 2022 Theatre loads the edge SDK", async () => {
  const [runtime, interactions, sdk, pkg, css] = await Promise.all([
    file("../runtime.js"),
    file("../src/systemya/interactions.ts"),
    file("../src/systemya/games-sdk.ts"),
    file("../package.json"),
    file("../src/systemya/stomp.css"),
  ]);
  assert.match(runtime, /from "\.\/sdk\/dist\/server\/router\.js"/);
  assert.match(runtime, /huRouter\.shouldUpgrade\(req\)/);
  assert.match(runtime, /huRouter\.upgrade\(req, socket, head\)/);
  assert.match(interactions, /mountGamesSDK\(root\)/);
  assert.match(sdk, /\/cdn\/index\.js/);
  for (const method of ["query", "getGame", "countPlay"])
    assert.match(sdk, new RegExp(`(?:sdk|client)\\.${method}\\(`));
  assert.match(sdk, /safeLocalPath\(game\.launchPath\)/);
  assert.match(css, /systemya-sdk-catalog/);
  const scripts = JSON.parse(pkg).scripts;
  assert.equal(scripts["predev"], "npm run prepare:stomp");
  assert.equal(scripts["prebuild"], "npm run prepare:stomp");
  assert.match(scripts["build"], /astro build/);
  assert.doesNotMatch(scripts["build"], /build:sdk/);
});

test("HU Games SDK client issues opaque, same-origin API calls", () => {
  const program = String.raw`
    import { createHUDataClient } from './sdk/src/browser/client.ts';
    const calls = [];
    const fetchFn = async (url, init = {}) => {
      calls.push({url: String(url), method: init.method || 'GET', body: init.body});
      if (String(url).includes('opaque-game')) return new Response(JSON.stringify({id:'sonic', name:'Sonic', type:'embed', category:['arcade'], controls:[], launchPath:'/cdn/opaque-player?v=abc', src:'https://example.com/game'}), {status:200});
      if (String(url).includes('opaque-play')) return new Response('{}', {status:200});
      return new Response(JSON.stringify({total:1, pages:1, entries:[{id:'sonic', name:'Sonic'}]}), {status:200});
    };
    const sdk = createHUDataClient({routes:{queryPath:'/cdn/opaque-query', gamePath:'/cdn/opaque-game', playPath:'/cdn/opaque-play', imagePrefix:'/cdn/opaque-image/', assetPrefix:'/cdn/opaque-asset/', webretroPath:'/cdn/opaque-webretro/'}, origin:'https://systemya.fracit.al', fetchFn});
    const page = await sdk.query({q:'sonic',limit:24});
    const game = await sdk.getGame('sonic');
    await sdk.countPlay('sonic');
    if(page.entries[0].name !== 'Sonic' || game.launchPath !== '/cdn/opaque-player?v=abc') throw new Error('bad SDK data');
    if (calls.length !== 3 || !calls.every(c => c.url.startsWith('https://systemya.fracit.al/cdn/'))) throw new Error('SDK requested a wrong origin');
    if (!calls[0].url.includes('search=sonic') || calls[1].method !== 'POST' || calls[2].method !== 'POST') throw new Error('bad SDK requests');
    console.log('sdk-client-pass');
  `;
  const result = spawnSync(
    process.execPath,
    [
      "--no-warnings",
      "--experimental-strip-types",
      "--input-type=module",
      "-e",
      program,
    ],
    {
      cwd: new URL("../", import.meta.url).pathname,
      encoding: "utf8",
      timeout: 10_000,
    },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /sdk-client-pass/);
});

test("Legacy Holt identity response is preserved but not deployed as a static endpoint", async () => {
  const [env, config, identity] = await Promise.all([
    file("../legacy/website2/env.example"),
    file("../config/config.example.js"),
    file("../legacy/website2/pages/api/me/chat.ts"),
  ]);
  assert.match(env, /HOLT_PLATFORM=systemya/);
  assert.match(env, /systemya\.fracit\.al/);
  assert.match(config, /mainWebsite: "systemya\.fracit\.al"/);
  assert.match(identity, /guestIdentityResponse/);
  const { existsSync } = await import("node:fs");
  assert.equal(
    existsSync(new URL("../src/pages/api/me/chat.ts", import.meta.url)),
    false,
  );
  const response = guestIdentityResponse();
  assert.equal(response.status, 401);
  assert.match(response.headers.get("cache-control"), /no-store/);
  assert.deepEqual(await response.json(), { message: "Unauthorized" });
  assert.equal(response.headers.get("set-cookie"), null);
});
