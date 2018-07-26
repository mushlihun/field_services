<plugin name="cordova-plugin-googlemaps" spec="https://github.com/phonegap-googlemaps-plugin/cordova-plugin-googlemaps">
    <variable name="API_KEY_FOR_ANDROID" value="AIzaSyBlEvVLjNRwDyd2vNECoBSsS6v_yEYc0m0" />
    <variable name="API_KEY_FOR_IOS" value="AIzaSyBlOXsfHGBOwzQyoVs-fkrjo9LC8K3GeI0" />
</plugin>

The main purpose for this project, it's provide a simple starting point for building 'on-demand/rideshare taxi' ionic application ( something like Uber, Lyft or Sidecar .. ) or more generally, applications using extensively Google Maps JavaScript API. 

When you start the app, you see a map centering around your location, with a marker permanently fixed to the center of map. 
When the user stop moving the map, an InfoWindow shows the new position. To achieve this, I use google maps geocoder service along with rxjs, that let you easily handle 'OVER_QUERY_LIMIT' response ( API Usage Limits ).

** Build configuration and test setup is heavily inspired from this great Ionic 2 boilerplate, take a look [here](https://github.com/marcoturi/ionic2-boilerplate). ** 

If you are looking for a more complex and complete Ionic 2 app sample, [check out here](https://github.com/ddellamico/ionic-conference-app).

**Note: This project is under development.**
 
## Features
  * Ionic 2 Final: <https://github.com/driftyco/ionic>
  * [TypeScript](http://www.typescriptlang.org/)
  * [RxJS](https://github.com/Reactive-Extensions/RxJS)
  * [Webpack](http://webpack.github.io/)
  * [Yarn](https://github.com/yarnpkg/yarn) for fast, reliable, and secure dependency management.
  * [BetterScripts](https://github.com/benoror/better-npm-run) for better NPM scripts.
  * [tslint](https://github.com/palantir/tslint)
  * [Codelyzer](https://github.com/mgechev/codelyzer)
  * [Typedoc](https://github.com/TypeStrong/typedoc)
  * [NVM](https://github.com/creationix/nvm) to manage multiple active node.js versions

## Install
  **Make sure you have Node version >= 6.X and NPM >= 3** (node.js version used 7.5.0 and NPM v. 4.1.2)
  
  ```bash
  # Clone the repo
  $ git clone https://github.com/mushlihun/order_service
  -----
  # change directory to our repo
  cd order_service
  -----
  # install the repo with yarn
  yarn
  -----
  # restore plugins and platforms
  cordova prepare
  -----
  # start the server (webpack-dev-server)
  npm run dev
  ```
  
  go to [http://0.0.0.0:8100](http://0.0.0.0:8100) or [http://localhost:8100](http://localhost:8100) in your browser
  
## Commands
  ```bash
  $ npm run dev             --> Run ionic serve ( development )
  $ npm run build           --> build files inside www folder ( production )
  $ npm run test            --> run test with Karma
  $ npm run ios:dev         --> start ios simulator (ionic run ios)
  $ npm run ios:release     --> build files for ios platform and generate xcodeproj (ionic build ios)
  $ npm run android:dev     --> start android simulator (ionic run android)
  $ npm run android:release --> build files for android platform and generate apk (ionic build android)
  ```
  
## Commit:
  ```sh
  # Lint and execute tests before committing code.
  npm run commit
  # OR
  # use git commit directly with correct message convention.
  git commit -m "chore(ghooks): Add pre-commit and commit-msg ghook"
  ```

## Tests

```sh
$ npm test
```

## Todo

* Add more test with karma 
* Add protractor (E2E testing)
* Add HMR

## License

MIT
