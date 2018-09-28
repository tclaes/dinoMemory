System.config({
  paths: {'npm':'/node_modules/'},
  map: {
    app: 'dist / app','@angular / core': 'npm: @angular / core / bundles / core.umd.js',
    '@angular / common': 'npm: @angular / common / bundles / common.umd.js',
    '@angular / compiler': 'npm: @angular / compiler / bundles / compiler.umd.js',
    '@angular / platform - browser': 'npm: @angular / platform - browser / bundles / platform - browser.umd.js',
    '@angular / platform - browser - dynamic': 'npm: @angular / platform - browser - dynamic / bundles / platform - browser - dynamic.umd.js',
    'core - js': 'npm: core - js',
    'zone.js': 'npm: zone.js',
    'rxjs': 'npm: rxjs',
    'rxjs - compat': 'npm: rxjs - compat',
    'tslib': 'npm: tslib / tslib.js',
    '@angular/material': 'npm:@angular/material/bundles/material.umd.js',

    // CDK individual packages
    '@angular/cdk/platform': 'npm:@angular/cdk/bundles/cdk-platform.umd.js',
    '@angular/cdk/a11y': 'npm:@angular/cdk/bundles/cdk-a11y.umd.js',
    // ...
    'hammerjs': 'npm:hammerjs',
  },
  packages: {'dist / app': {},
    'rxjs': {'main': 'index.js',
      'defaultExtension': 'js'
    },
    'rxjs / operators': {'main': 'index.js',
      'defaultExtension': 'js'
    },
    'rxjs / internal - compatibility': {'main': 'index.js',
      'defaultExtension': 'js'
    },
    'rxjs / testing': {'main': 'index.js',
      'defaultExtension': 'js'
    },
    'rxjs / ajax': {'main': 'index.js',
      'defaultExtension': 'js'
    },
    'rxjs / webSocket': {'main': 'index.js',
      'defaultExtension': 'js'
    },
    'rxjs - compat': {'main': 'index.js',
      'defaultExtension': 'js'
    },
    'core - js': {},
    'zone.js': {},
    'hammerjs': {'main': './hammer.min.js', 'defaultExtension': 'js'}
  }
});
